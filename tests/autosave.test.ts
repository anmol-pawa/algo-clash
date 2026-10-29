import { describe, expect, it } from "vitest";
import { DraftAutosaver, type Timers } from "@/lib/save/autosave";
import { MemoryBackend } from "@/lib/save/backend";
import { SaveService } from "@/lib/save/service";

function fakeTimers() {
  let next = 1;
  const tasks = new Map<number, () => void>();
  const timers: Timers = {
    set: (fn) => {
      tasks.set(next, fn);
      return next++;
    },
    clear: (h) => void tasks.delete(h as number),
  };
  return { timers, tasks, fire: () => [...tasks.values()].forEach((f) => (tasks.clear(), f())) };
}

describe("DraftAutosaver", () => {
  it("writes once per interval with the latest text", async () => {
    const svc = new SaveService(new MemoryBackend());
    const calls: string[] = [];
    const sink = { saveDraft: (id: string, c: string) => (calls.push(c), svc.saveDraft(id, c)) };
    const t = fakeTimers();
    const a = new DraftAutosaver(sink, "p1", "start", 5000, t.timers);
    a.update("a");
    a.update("ab");
    a.update("abc");
    expect(t.tasks.size).toBe(1);
    expect(calls).toEqual([]);
    t.fire();
    await a.flush();
    expect(calls).toEqual(["abc"]);
    expect((await svc.loadDraft("p1"))?.code).toBe("abc");
  });

  it("does not write unchanged text, and flush is immediate", async () => {
    const calls: string[] = [];
    const t = fakeTimers();
    const a = new DraftAutosaver({ saveDraft: async (_i, c) => void calls.push(c) }, "p", "init", 5000, t.timers);
    a.update("init");
    await a.flush();
    expect(calls).toEqual([]);
    a.update("x");
    await a.flush();
    expect(calls).toEqual(["x"]);
    expect(t.tasks.size).toBe(0);
  });

  it("retries after a storage failure and ignores updates once disposed", async () => {
    let fail = true;
    const calls: string[] = [];
    const t = fakeTimers();
    const sink = { saveDraft: async (_i: string, c: string) => (fail ? Promise.reject(new Error("quota")) : void calls.push(c)) };
    const a = new DraftAutosaver(sink, "p", "", 5000, t.timers);
    a.update("v1");
    await a.flush();
    fail = false;
    a.update("v1");
    await a.flush();
    expect(calls).toEqual(["v1"]);
    await a.dispose();
    a.update("v2");
    expect(t.tasks.size).toBe(0);
  });
});
