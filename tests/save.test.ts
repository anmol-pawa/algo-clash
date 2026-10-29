import { describe, expect, it } from "vitest";
import { MemoryBackend } from "../lib/save/backend";
import { migrateCore, SaveVersionError } from "../lib/save/migrations";
import { SAVE_VERSION, newCoreSave, sanitizeCore } from "../lib/save/schema";
import { SaveService } from "../lib/save/service";

const NOW = 1_800_000_000_000;
const svc = () => new SaveService(new MemoryBackend(), () => NOW);

describe("schema", () => {
  it("sanitises garbage into a valid save", () => {
    const c = sanitizeCore(
      { profile: { name: 5, level: 999, bits: -4 }, party: ["a", 1, "b", "c", "d", "e", "f", "g"], mastery: { x: { state: "bogus", ease: 99 } }, flags: { ok: true, bad: {} } },
      NOW,
    );
    expect(c.profile.name).toBe("Trainer");
    expect(c.profile.level).toBe(60);
    expect(c.profile.bits).toBe(0);
    expect(c.party).toEqual(["a", "b", "c", "d", "e", "f"]);
    expect(c.mastery.x).toMatchObject({ state: "unseen", ease: 3.5 });
    expect(c.flags).toEqual({ ok: true });
  });
  it("is idempotent", () => {
    const c = sanitizeCore({ profile: { name: "Ada" } }, NOW);
    expect(sanitizeCore(c, NOW)).toEqual(c);
  });
});

describe("migrations", () => {
  it("upgrades a v0 prototype save", () => {
    const c = migrateCore({ player: { name: "Old", level: 3, xp: 40 }, coins: 12, solved: ["two-sum", 7], party: ["arrayling"] }, NOW);
    expect(c.version).toBe(SAVE_VERSION);
    expect(c.profile).toMatchObject({ name: "Old", level: 3, xp: 40, bits: 12 });
    expect(Object.keys(c.mastery)).toEqual(["two-sum"]);
    expect(c.mastery["two-sum"].state).toBe("solved");
    expect(c.party).toEqual(["arrayling"]);
  });
  it("rejects a save from the future and non-objects", () => {
    expect(() => migrateCore({ version: SAVE_VERSION + 1 }, NOW)).toThrow(SaveVersionError);
    expect(() => migrateCore("x", NOW)).toThrow(/not an object/);
  });
});

describe("SaveService", () => {
  it("returns a fresh save when empty and round-trips changes", async () => {
    const s = svc();
    const c = await s.load();
    expect(c).toEqual(newCoreSave(NOW));
    c.profile.bits = 50;
    await s.save(c);
    expect((await s.load()).profile.bits).toBe(50);
  });
  it("rewrites an old-version save after migrating", async () => {
    const b = new MemoryBackend();
    await b.putCore({ player: { name: "Old" }, coins: 3 } as never);
    const s = new SaveService(b, () => NOW);
    expect((await s.load()).profile.bits).toBe(3);
    expect(((await b.getCore()) as { version: number }).version).toBe(SAVE_VERSION);
  });
  it("does not overwrite a save from a newer build", async () => {
    const b = new MemoryBackend();
    await b.putCore({ version: 99 } as never);
    await expect(new SaveService(b, () => NOW).load()).rejects.toThrow(SaveVersionError);
    expect(((await b.getCore()) as { version: number }).version).toBe(99);
  });
  it("falls back to a fresh save on corrupt data", async () => {
    const b = new MemoryBackend();
    await b.putCore("garbage" as never);
    expect(await new SaveService(b, () => NOW).load()).toEqual(newCoreSave(NOW));
  });
  it("records attempts and filters by problem; rejects invalid ones", async () => {
    const s = svc();
    const base = { at: NOW, seconds: 60, hintsUsed: 1, mode: "practice" as const };
    await s.recordAttempt({ ...base, problemId: "a", verdict: "WA" });
    await s.recordAttempt({ ...base, problemId: "b", verdict: "AC" });
    expect((await s.attempts()).length).toBe(2);
    expect((await s.attempts("a"))[0].verdict).toBe("WA");
    await expect(s.recordAttempt({ ...base, problemId: "", verdict: "AC" })).rejects.toThrow();
  });
  it("saves, loads and clears drafts", async () => {
    const s = svc();
    expect(await s.loadDraft("a")).toBeNull();
    await s.saveDraft("a", "int main(){}");
    expect(await s.loadDraft("a")).toEqual({ problemId: "a", code: "int main(){}", updatedAt: NOW });
    await s.clearDraft("a");
    expect(await s.loadDraft("a")).toBeNull();
  });
  it("exports and imports everything, replacing existing data", async () => {
    const a = svc();
    const c = await a.load();
    c.profile.name = "Ada";
    c.mastery.p = { state: "mastered", solves: 3, due: 5, intervalDays: 9, ease: 2.2, lastSolvedAt: 4 };
    await a.save(c);
    await a.recordAttempt({ problemId: "p", at: 1, verdict: "AC", seconds: 5, hintsUsed: 0, mode: "learn" });
    await a.saveDraft("q", "code");
    const json = await a.exportJson();

    const b = svc();
    await b.saveDraft("stale", "x");
    const imported = await b.importJson(json);
    expect(imported.profile.name).toBe("Ada");
    expect(imported.mastery.p.state).toBe("mastered");
    expect((await b.attempts()).length).toBe(1);
    expect(await b.loadDraft("q")).not.toBeNull();
    expect(await b.loadDraft("stale")).toBeNull();
  });
  it("rejects bad imports without touching storage", async () => {
    const s = svc();
    await s.saveDraft("keep", "x");
    await expect(s.importJson("{nope")).rejects.toThrow(/valid JSON/);
    await expect(s.importJson(JSON.stringify({ format: "other" }))).rejects.toThrow(/not an Algo Clash save/);
    await expect(s.importJson(JSON.stringify({ format: "algo-clash-save", version: 99, core: {} }))).rejects.toThrow(SaveVersionError);
    expect(await s.loadDraft("keep")).not.toBeNull();
  });
  it("reset wipes all stores", async () => {
    const s = svc();
    await s.saveDraft("a", "x");
    await s.reset();
    expect(await s.loadDraft("a")).toBeNull();
  });
});
