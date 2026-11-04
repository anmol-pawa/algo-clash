import { describe, expect, it } from "vitest";
import { advanceStreak, clearedFromMask, dayKey, maskWith, planRift, playableRooms, riftReward, seedForDay, visibleStreak, type RiftCatalog } from "@/lib/rift";
import { applyAttempt, DAY_MS, emptyMastery } from "@/lib/srs";
import type { ProblemMastery } from "@/lib/save/schema";

const T0 = Date.parse("2026-11-04T12:00:00Z");
const catalog: RiftCatalog = {
  problems: [
    { id: "a", region: "R0", difficulty: "E", prerequisites: [] },
    { id: "b", region: "R0", difficulty: "E", prerequisites: ["a"] },
    { id: "c", region: "R3", difficulty: "M", prerequisites: ["b"] },
    { id: "d", region: "R3", difficulty: "M", prerequisites: [] },
    { id: "h1", region: "R6", difficulty: "H", prerequisites: ["c"] },
    { id: "h2", region: "R6", difficulty: "H", prerequisites: [] },
  ],
  cards: [
    ...Array.from({ length: 8 }, (_, i) => ({ id: `card${i}`, region: "R0" })),
    { id: "bug1", region: "R0", debug: true },
    { id: "bug2", region: "R0", debug: true },
  ],
};
const solved = (at: number): ProblemMastery => applyAttempt(emptyMastery(), { at, solved: true, assisted: false, seconds: 100, parSeconds: 600 });

describe("planRift", () => {
  it("is deterministic per day and varies across days", () => {
    const a = planRift("2026-11-04", {}, catalog, T0);
    expect(planRift("2026-11-04", {}, catalog, T0)).toEqual(a);
    const ids = (d: string) => planRift(d, {}, catalog, T0).rooms[1].items.map((i) => i.id).join();
    const days = ["2026-11-05", "2026-11-06", "2026-11-07", "2026-11-08"];
    expect(days.some((d) => ids(d) !== ids("2026-11-04"))).toBe(true);
    expect(seedForDay("2026-11-04")).not.toBe(seedForDay("2026-11-05"));
  });

  it("day one: no reviews, a fresh frontier problem, a debug card, five blitz cards, and no unmet prerequisites", () => {
    const p = planRift("2026-11-04", {}, catalog, T0);
    expect(p.rooms.map((r) => r.kind)).toEqual(["reviews", "blitz", "fresh", "debug", "bonus"]);
    expect(p.rooms[0].items).toEqual([]);
    expect(p.rooms[1].items).toHaveLength(5);
    expect(p.rooms[1].items.every((i) => !i.id.startsWith("bug"))).toBe(true);
    expect(p.rooms[2].items).toEqual([{ type: "problem", id: "a" }]);
    expect(p.rooms[3].items[0].id).toMatch(/^bug/);
    expect(p.rooms[4].optional).toBe(true);
    expect(p.rooms[4].items).toEqual([{ type: "problem", id: "h2" }]); // h1 needs c
    expect(playableRooms(p)).toEqual([1, 2, 3, 4]);
  });

  it("interleaves due reviews across regions and caps them at four", () => {
    const m: Record<string, ProblemMastery> = { a: solved(T0 - 5 * DAY_MS), b: solved(T0 - 4 * DAY_MS), c: solved(T0 - 3 * DAY_MS), d: solved(T0 - 9 * DAY_MS), h2: solved(T0 - 2 * DAY_MS) };
    const p = planRift("2026-11-04", m, catalog, T0);
    const ids = p.rooms[0].items.map((i) => i.id);
    expect(ids).toHaveLength(4);
    // round-robin: R0's most overdue (a), then R3's (d), R6's (h2), then R0's next (b)
    expect(ids).toEqual(["a", "d", "h2", "b"]);
    expect(p.rooms[2].items.every((i) => !ids.includes(i.id))).toBe(true);
  });

  it("not-yet-due items are not reviewed, and learned items are never 'fresh'", () => {
    const m = { a: solved(T0) };
    const p = planRift("2026-11-04", m, catalog, T0);
    expect(p.rooms[0].items).toEqual([]);
    expect(p.rooms[2].items).toEqual([{ type: "problem", id: "b" }]);
  });
});

describe("streak and rewards", () => {
  it("grows on consecutive days, restarts after a gap, ignores a repeat on the same day", () => {
    let s = advanceStreak({ streakDays: 0, lastPlayedDay: "" }, "2026-11-04");
    expect(s).toEqual({ streakDays: 1, lastPlayedDay: "2026-11-04" });
    s = advanceStreak(s, "2026-11-04");
    expect(s.streakDays).toBe(1);
    s = advanceStreak(s, "2026-11-05");
    expect(s.streakDays).toBe(2);
    s = advanceStreak(s, "2026-12-01");
    expect(s.streakDays).toBe(1);
  });
  it("handles month and leap-year boundaries", () => {
    expect(advanceStreak({ streakDays: 4, lastPlayedDay: "2028-02-28" }, "2028-02-29").streakDays).toBe(5);
    expect(advanceStreak({ streakDays: 4, lastPlayedDay: "2026-12-31" }, "2027-01-01").streakDays).toBe(5);
  });
  it("shows a stale streak as 0 without punishing anything else", () => {
    const s = { streakDays: 6, lastPlayedDay: "2026-11-03" };
    expect(visibleStreak(s, "2026-11-04")).toBe(6);
    expect(visibleStreak(s, "2026-11-05")).toBe(0);
    expect(visibleStreak({ streakDays: 0, lastPlayedDay: "" }, "2026-11-05")).toBe(0);
  });
  it("rewards scale with rooms cleared, full-clear bonus, streak bonus capped at +50%", () => {
    const p = planRift("2026-11-04", {}, catalog, T0);
    expect(riftReward(p, [], 1)).toEqual({ bits: 0, xp: 0 });
    const some = riftReward(p, [1], 1).bits;
    const more = riftReward(p, [1, 2], 1).bits;
    expect(more).toBeGreaterThan(some);
    const full = riftReward(p, [1, 2, 3], 1).bits; // room 0 is empty, so rooms 1-3 are the required set
    expect(full).toBe(10 + 25 + 15 + 25);
    expect(riftReward(p, [1, 2, 3, 4], 1).bits).toBe(full + 40);
    expect(riftReward(p, [1, 2, 3], 3).bits).toBe(Math.round(full * 1.2));
    expect(riftReward(p, [1, 2, 3], 99).bits).toBe(Math.round(full * 1.5));
  });
  it("round-trips the cleared mask and keys days in UTC", () => {
    let mask = 0;
    mask = maskWith(maskWith(mask, 2), 4);
    expect(clearedFromMask(mask)).toEqual([2, 4]);
    expect(dayKey(Date.parse("2026-11-04T23:59:59Z"))).toBe("2026-11-04");
  });
});

import { claimRift, clearedRooms, markRoomCleared, recordProblemAttempt, riftComplete } from "@/lib/rift";
import { newCoreSave } from "@/lib/save/schema";
import { riftCatalog } from "@/content/rift";

describe("rift progress", () => {
  const day = "2026-11-04";
  const plan = planRift(day, {}, catalog, T0);
  it("tracks cleared rooms idempotently and pays once", () => {
    let core = newCoreSave(T0);
    for (const i of playableRooms(plan)) core = markRoomCleared(markRoomCleared(core, day, i), day, i);
    expect(clearedRooms(core, day)).toEqual(playableRooms(plan));
    expect(riftComplete(plan, clearedRooms(core, day))).toBe(true);
    const a = claimRift(core, plan);
    expect(a.reward!.bits).toBeGreaterThan(0);
    expect(a.core.profile.streakDays).toBe(1);
    expect(a.core.profile.bits).toBe(a.reward!.bits);
    expect(claimRift(a.core, plan).reward).toBeNull();
  });
  it("pays nothing while a required room is open", () => {
    const core = markRoomCleared(newCoreSave(T0), day, 1);
    expect(claimRift(core, plan).reward).toBeNull();
  });
  it("applies attempts to SRS", () => {
    const core = recordProblemAttempt(newCoreSave(T0), "a", { at: T0, solved: true, assisted: false, seconds: 50, parSeconds: 300 });
    expect(core.mastery.a.solves).toBe(1);
  });
  it("the real catalog plans a playable day-one rift", () => {
    const p = planRift(day, {}, riftCatalog, T0);
    expect(p.rooms[1].items).toHaveLength(5);
    expect(p.rooms[3].items).toHaveLength(1); // a compiler-error card
    expect(p.rooms[2].items).toHaveLength(1);
  });
});
