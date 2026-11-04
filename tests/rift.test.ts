import { describe, expect, it } from "vitest";
import { allCards } from "@/content/cards";
import { dayKey, dayNumber, daysBetween, hashSeed } from "@/lib/rift/day";
import { buildRift, interleaveByRegion } from "@/lib/rift/plan";
import { BLITZ_PASS, clearRoom, clearedMask, completionReward, currentStreak, isRiftComplete, isRoomCleared, ROOM_BITS } from "@/lib/rift/progress";
import { ROOM_ORDER, type RiftItem, type RiftPool } from "@/lib/rift/types";
import { newCoreSave, type CoreSave, type ProblemMastery } from "@/lib/save/schema";
import { DAY_MS } from "@/lib/srs/scheduler";

const NOW = Date.parse("2026-11-04T12:00:00Z");
const m = (state: ProblemMastery["state"], due = 0): ProblemMastery => ({ state, solves: 1, due, intervalDays: 1, ease: 2.5, lastSolvedAt: 0 });
const prob = (id: string, region: string, difficulty: "E" | "M" | "H", prerequisites: string[] = []): RiftItem => ({ id, kind: "problem", region, difficulty, prerequisites });

const pool: RiftPool = {
  problems: [prob("a", "R0", "E"), prob("b", "R0", "E", ["a"]), prob("c", "R1", "M", ["a"]), prob("d", "R2", "H"), prob("e", "R2", "M")],
  scrolls: [{ id: "s1", kind: "scroll", region: "R0" }],
  cards: allCards.map((c) => ({ id: c.id, kind: "card" as const, region: c.region })),
  debug: [{ id: "bug1", kind: "debug", region: "R1", difficulty: "M" }],
};

describe("rift days", () => {
  it("keys the local day from an offset", () => {
    expect(dayKey(Date.parse("2026-11-04T23:30:00Z"), 0)).toBe("2026-11-04");
    expect(dayKey(Date.parse("2026-11-04T23:30:00Z"), 120)).toBe("2026-11-05");
    expect(dayKey(Date.parse("2026-11-04T01:00:00Z"), -300)).toBe("2026-11-03");
  });
  it("counts days across month and leap boundaries", () => {
    expect(daysBetween("2026-10-31", "2026-11-01")).toBe(1);
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
    expect(dayNumber("nope")).toBeNaN();
    expect(daysBetween("", "2026-11-01")).toBeNaN();
  });
  it("hashes stably", () => {
    expect(hashSeed("x")).toBe(hashSeed("x"));
    expect(hashSeed("x")).not.toBe(hashSeed("y"));
  });
});

describe("buildRift", () => {
  it("is deterministic for a day and different on another day", () => {
    const a = buildRift("2026-11-04", NOW, {}, pool);
    expect(buildRift("2026-11-04", NOW, {}, pool)).toEqual(a);
    expect(buildRift("2026-11-05", NOW, {}, pool).rooms[1].items.map((i) => i.id)).not.toEqual(a.rooms[1].items.map((i) => i.id));
  });
  it("has the five rooms in order and only the vault is optional", () => {
    const p = buildRift("2026-11-04", NOW, {}, pool);
    expect(p.rooms.map((r) => r.id)).toEqual([...ROOM_ORDER]);
    expect(p.rooms.map((r) => r.optional)).toEqual([false, false, false, false, true]);
  });
  it("blitz is five distinct cards from several regions", () => {
    const items = buildRift("2026-11-04", NOW, {}, pool).rooms[1].items;
    expect(items).toHaveLength(5);
    expect(new Set(items.map((i) => i.id)).size).toBe(5);
    expect(items.every((i) => i.kind === "card")).toBe(true);
  });
  it("frontier is the easiest fresh problem with learned prerequisites", () => {
    expect(buildRift("2026-11-04", NOW, {}, pool).rooms[2].items.map((i) => i.id)).toEqual(["a", "d"].slice(0, 1)); // d is hard; a is the easiest open
    const afterA = buildRift("2026-11-04", NOW, { a: m("learning", NOW + DAY_MS) }, pool).rooms[2].items[0];
    expect(afterA.id).toBe("b"); // easiest open: b (E) beats c (M) and d (H)
  });
  it("review room holds due items, most overdue first, interleaved across regions", () => {
    const mastery = {
      a: m("practiced", NOW - 5 * DAY_MS),
      b: m("practiced", NOW - 4 * DAY_MS),
      c: m("practiced", NOW - 3 * DAY_MS),
      d: m("learning", NOW + DAY_MS),
    };
    const ids = buildRift("2026-11-04", NOW, mastery, pool).rooms[0].items.map((i) => i.id);
    expect(ids).toEqual(["a", "c", "b"]); // R0 a, R1 c, then R0 b: never two of one region in a row while another waits
    expect(ids).not.toContain("d");
  });
  it("a quiet day warms up on learning-tier items instead of an empty room", () => {
    const ids = buildRift("2026-11-04", NOW, { a: m("learning", NOW + 2 * DAY_MS) }, pool).rooms[0].items.map((i) => i.id);
    expect(ids).toEqual(["a"]);
  });
  it("vault prefers an unmastered hard that is not the frontier", () => {
    const p = buildRift("2026-11-04", NOW, {}, pool);
    expect(p.rooms[4].items.map((i) => i.id)).toEqual(["d"]);
    const noHard = buildRift("2026-11-04", NOW, { d: m("mastered", NOW + DAY_MS) }, pool);
    expect(["c", "e"]).toContain(noHard.rooms[4].items[0].id);
  });
  it("rooms with no content are empty and flagged", () => {
    const p = buildRift("2026-11-04", NOW, {}, { problems: [], scrolls: [], cards: [], debug: [] });
    expect(p.rooms.every((r) => r.empty)).toBe(true);
  });
  it("one room's pool does not reshuffle another room (independent streams)", () => {
    const a = buildRift("2026-11-04", NOW, {}, pool);
    const b = buildRift("2026-11-04", NOW, {}, { ...pool, debug: [] });
    expect(b.rooms[1].items).toEqual(a.rooms[1].items);
  });
  it("property: any day gives distinct items per room and never offers a problem whose prerequisites are unlearned", () => {
    for (let d = 0; d < 120; ++d) {
      const day = dayKey(NOW + d * DAY_MS);
      const p = buildRift(day, NOW, {}, pool);
      for (const r of p.rooms) expect(new Set(r.items.map((i) => i.id)).size).toBe(r.items.length);
      for (const it of p.rooms[2].items) expect(it.prerequisites ?? []).toEqual([]);
      expect(p.rooms[2].items[0]?.id).not.toBe(p.rooms[4].items[0]?.id);
    }
  });
  it("interleaveByRegion keeps every item", () => {
    const items = [prob("1", "A", "E"), prob("2", "A", "E"), prob("3", "B", "E")];
    expect(interleaveByRegion(items).map((i) => i.id)).toEqual(["1", "3", "2"]);
  });
});

describe("rift progress", () => {
  const plan = buildRift("2026-11-04", NOW, { a: m("practiced", NOW - DAY_MS) }, pool);
  const fresh = (): CoreSave => newCoreSave(NOW);

  it("pays a room once and remembers it", () => {
    const r = clearRoom(fresh(), plan, 0);
    expect(r.reward.bits).toBe(ROOM_BITS[0]);
    expect(isRoomCleared(r.core, plan.day, 0)).toBe(true);
    expect(r.core.profile.bits).toBe(ROOM_BITS[0]);
    const again = clearRoom(r.core, plan, 0);
    expect(again.reward).toEqual({ bits: 0, xp: 0 });
    expect(again.core).toBe(r.core);
  });
  it("does not mutate its input", () => {
    const core = fresh();
    const snap = JSON.stringify(core);
    clearRoom(core, plan, 1);
    expect(JSON.stringify(core)).toBe(snap);
  });
  it("completing the four required rooms starts a streak and pays the bonus; the vault is optional", () => {
    let core = fresh();
    let last = clearRoom(core, plan, 0);
    for (const i of [1, 2, 3]) { core = last.core; last = clearRoom(core, plan, i); }
    expect(last.completed).toBe(true);
    expect(last.core.profile.streakDays).toBe(1);
    expect(last.core.profile.lastPlayedDay).toBe(plan.day);
    expect(last.reward.bits).toBe(ROOM_BITS[3] + completionReward(1).bits);
    expect(isRiftComplete(last.core, plan)).toBe(true);
    const vault = clearRoom(last.core, plan, 4);
    expect(vault.completed).toBe(false);
    expect(vault.core.profile.streakDays).toBe(1);
    expect(vault.reward.bits).toBe(ROOM_BITS[4]);
  });
  it("vault alone does not complete the day", () => {
    const r = clearRoom(fresh(), plan, 4);
    expect(r.completed).toBe(false);
    expect(isRiftComplete(r.core, plan)).toBe(false);
  });
  it("streak grows on consecutive days and restarts after a gap, without penalties", () => {
    const finish = (core: CoreSave, day: string): CoreSave => {
      const p = buildRift(day, NOW, {}, pool);
      let c = core;
      for (const i of [0, 1, 2, 3]) c = clearRoom(c, p, i).core;
      return c;
    };
    let core = finish(fresh(), "2026-11-04");
    core = finish(core, "2026-11-05");
    expect(core.profile.streakDays).toBe(2);
    const bitsBefore = core.profile.bits;
    expect(currentStreak(core.profile, "2026-11-06")).toBe(2); // still alive, yesterday counted
    expect(currentStreak(core.profile, "2026-11-08")).toBe(0); // lapsed: shown as 0, nothing deducted
    expect(core.profile.bits).toBe(bitsBefore);
    core = finish(core, "2026-11-08");
    expect(core.profile.streakDays).toBe(1);
  });
  it("a new day resets the cleared mask", () => {
    const r = clearRoom(fresh(), plan, 0);
    expect(clearedMask(r.core, "2026-11-04")).toBe(1);
    expect(clearedMask(r.core, "2026-11-05")).toBe(0);
  });
  it("empty rooms are free and never pay", () => {
    const sparse = buildRift("2026-11-04", NOW, {}, { ...pool, debug: [] });
    let core = fresh();
    expect(clearRoom(core, sparse, 3).reward.bits).toBe(0);
    for (const i of [0, 1, 2]) core = clearRoom(core, sparse, i).core;
    expect(isRiftComplete(core, sparse)).toBe(true);
    expect(core.profile.streakDays).toBe(1);
  });
  it("the blitz pass mark needs real recognition, not a guess", () => {
    expect(BLITZ_PASS).toBeGreaterThan(2);
    expect(BLITZ_PASS).toBeLessThanOrEqual(5);
  });
  it("streak bonus is capped at a week", () => {
    expect(completionReward(30)).toEqual(completionReward(7));
    expect(completionReward(8).bits).toBe(completionReward(7).bits);
  });
  it("garbage flags are ignored", () => {
    const core = { ...fresh(), flags: { "rift:day": "2026-11-04", "rift:cleared": 999 } };
    expect(clearedMask(core, "2026-11-04")).toBe(0);
  });
});
