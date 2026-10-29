import { describe, expect, it } from "vitest";
import { AUTOSAVE_MS, DraftAutosaver, restoreDraft, type Scheduler } from "@/lib/editor/autosave";
import { MemoryBackend } from "@/lib/save/backend";
import { SaveService } from "@/lib/save/service";

function fakeClock() {
  let fn: (() => void) | null = null;
  let ms = 0;
  const scheduler: Scheduler = { every: (m, f) => ((ms = m), (fn = f), () => (fn = null)) };
  return { scheduler, tick: () => fn?.(), get ms() { return ms; }, get running() { return fn !== null; } };
}

describe("DraftAutosaver", () => {
  it("saves only when the code changed, on the 5 s tick", async () => {
    const svc = new SaveService(new MemoryBackend());
    const clock = fakeClock();
    const a = new DraftAutosaver(svc, "p1", "start", clock.scheduler);
    a.start();
    expect(clock.ms).toBe(AUTOSAVE_MS);
    clock.tick();
    await a.flush();
    expect(await svc.loadDraft("p1")).toBeNull();
    a.update("v2");
    expect(a.dirty).toBe(true);
    clock.tick();
    await a.flush();
    expect((await svc.loadDraft("p1"))?.code).toBe("v2");
    expect(a.dirty).toBe(false);
  });

  it("flushes on dispose and stops the timer", async () => {
    const svc = new SaveService(new MemoryBackend());
    const clock = fakeClock();
    const a = new DraftAutosaver(svc, "p1", "", clock.scheduler);
    a.start();
    a.update("last words");
    await a.dispose();
    expect(clock.running).toBe(false);
    expect((await svc.loadDraft("p1"))?.code).toBe("last words");
  });

  it("stays dirty after a failed write and retries", async () => {
    let fail = true;
    const store = {
      saveDraft: async () => { if (fail) throw new Error("quota"); },
      loadDraft: async () => null,
    };
    const a = new DraftAutosaver(store, "p1", "a", fakeClock().scheduler);
    a.update("b");
    await a.flush();
    expect(a.dirty).toBe(true);
    fail = false;
    await a.flush();
    expect(a.dirty).toBe(false);
  });
});

describe("restoreDraft", () => {
  it("returns the saved draft, the starter when none or blank, and survives load errors", async () => {
    const svc = new SaveService(new MemoryBackend());
    expect(await restoreDraft(svc, "p", "STARTER")).toBe("STARTER");
    await svc.saveDraft("p", "   ");
    expect(await restoreDraft(svc, "p", "STARTER")).toBe("STARTER");
    await svc.saveDraft("p", "mine");
    expect(await restoreDraft(svc, "p", "STARTER")).toBe("mine");
    expect(await restoreDraft({ saveDraft: async () => {}, loadDraft: async () => { throw new Error("x"); } }, "p", "S")).toBe("S");
  });
});
