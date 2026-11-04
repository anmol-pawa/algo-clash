import { describe, expect, it } from "vitest";
import { newCoreSave } from "../lib/save/schema";
import type { ProblemMastery } from "../lib/save/schema";
import { DAY_MS, emptyMastery } from "../lib/srs";
import {
  BITS_PER_ROOM, BONUS_ROOM_BITS, FULL_CLEAR_BONUS, claimReward, completeRoom, completedRooms, dayKey, daysBetween,
  frontier, pickReviews, planRift, recordActivity, rewardFor, visibleStreak, type RiftInput, type RiftProblem,
} from "../lib/rift";

const P = (id: string, difficulty: "E" | "M" | "H", pattern: string, prerequisites: string[] = []): RiftProblem => ({ id, difficulty, pattern, prerequisites });
const problems = [P("a", "E", "arrays"), P("b", "M", "arrays", ["a"]), P("c", "E", "hash"), P("d", "H", "dp", ["b"]), P("e", "H", "graph")];
const NOW = Date.UTC(2026, 10, 4, 12);
const learned = (due: number): ProblemMastery => ({ ...emptyMastery(), state: "practiced", solves: 2, due, intervalDays: 3, spacedSolves: 2 });
const base = (over: Partial<RiftInput> = {}): RiftInput => ({
  day: "2026-11-04", now: NOW, mastery: {}, problems, blitzCards: ["c1", "c2", "c3", "c4", "c5", "c6", "c7"], debugEncounters: ["d1", "d2"], ...over,
});

describe("rift days", () => {
  it("keys local days by offset", () => {
    const t = Date.UTC(2026, 10, 4, 23, 30);
    expect(dayKey(t, 0)).toBe("2026-11-04");
    expect(dayKey(t, 120)).toBe("2026-11-05");
    expect(dayKey(t, -300)).toBe("2026-11-04");
  });
  it("counts days across month and leap boundaries", () => {
    expect(daysBetween("2026-10-31", "2026-11-01")).toBe(1);
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
    expect(daysBetween("2026-11-04", "2026-11-04")).toBe(0);
    expect(daysBetween("nope", "2026-11-04")).toBeNaN();
  });
});

describe("streak", () => {
  it("increments on consecutive days, is idempotent within a day, restarts after a gap", () => {
    let s = recordActivity({ streakDays: 0, lastPlayedDay: "" }, "2026-11-01");
    expect(s.streakDays).toBe(1);
    expect(recordActivity(s, "2026-11-01")).toBe(s);
    s = recordActivity(s, "2026-11-02");
    expect(s.streakDays).toBe(2);
    s = recordActivity(s, "2026-11-04");
    expect(s.streakDays).toBe(1);
  });
  it("restarts when the clock goes backwards", () => {
    expect(recordActivity({ streakDays: 5, lastPlayedDay: "2026-11-05" }, "2026-11-03").streakDays).toBe(1);
  });
  it("shows the streak until a whole day is missed", () => {
    const s = { streakDays: 4, lastPlayedDay: "2026-11-02" };
    expect(visibleStreak(s, "2026-11-02")).toBe(4);
    expect(visibleStreak(s, "2026-11-03")).toBe(4);
    expect(visibleStreak(s, "2026-11-04")).toBe(0);
    expect(visibleStreak({ streakDays: 0, lastPlayedDay: "" }, "2026-11-04")).toBe(0);
  });
});

describe("planRift", () => {
  it("is deterministic per day and varies across days", () => {
    expect(planRift(base())).toEqual(planRift(base()));
    const days = new Set(Array.from({ length: 12 }, (_, i) => JSON.stringify(planRift(base({ day: `2026-11-${10 + i}` })).rooms[1].items)));
    expect(days.size).toBeGreaterThan(1);
  });
  it("has the five rooms in order, with the bonus optional", () => {
    const plan = planRift(base());
    expect(plan.rooms.map((r) => r.kind)).toEqual(["review", "blitz", "fresh", "debug", "bonus"]);
    expect(plan.rooms.map((r) => r.optional)).toEqual([false, false, false, false, true]);
    expect(plan.rooms[1].items).toHaveLength(5);
    expect(new Set(plan.rooms[1].items).size).toBe(5);
  });
  it("puts only due, learned problems in review, most overdue first, and never reviews them as fresh", () => {
    const mastery = { a: learned(NOW - 3 * DAY_MS), c: learned(NOW - DAY_MS), b: learned(NOW + DAY_MS) };
    const plan = planRift(base({ mastery }));
    expect(plan.rooms[0].items).toEqual(["a", "c"]);
    expect(plan.rooms[2].items).toEqual(["d"]); // b is solved, so hard d is unlocked; d precedes e in catalogue order
  });
  it("fresh problem is the easiest unsolved one whose prerequisites are solved", () => {
    expect(frontier(problems, {}).map((p) => p.id)).toEqual(["a", "c", "e"]);
    const m = { a: learned(NOW + DAY_MS) };
    expect(frontier(problems, m).map((p) => p.id)).toEqual(["c", "b", "e"]);
  });
  it("bonus is a hard problem not already in the Rift", () => {
    for (let i = 1; i < 20; ++i) {
      const plan = planRift(base({ day: `2026-12-${String(i).padStart(2, "0")}` }));
      const ids = plan.rooms.flatMap((r) => (r.kind === "blitz" || r.kind === "debug" ? [] : r.items));
      expect(new Set(ids).size).toBe(ids.length);
      expect(["d", "e"]).toContain(plan.rooms[4].items[0]);
    }
  });
  it("leaves rooms empty when there is nothing to put in them", () => {
    const plan = planRift(base({ problems: [], blitzCards: [], debugEncounters: [] }));
    expect(plan.rooms.every((r) => r.items.length === 0)).toBe(true);
  });
  it("interleaves reviews across patterns when it can", () => {
    const due = [P("x1", "E", "p"), P("x2", "E", "p"), P("y1", "E", "q"), P("x3", "E", "p")];
    expect(pickReviews(due, 4).map((p) => p.id)).toEqual(["x1", "y1", "x2", "x3"]);
    expect(pickReviews([P("x1", "E", "p"), P("x2", "E", "p")], 4).map((p) => p.id)).toEqual(["x1", "x2"]);
  });
});

describe("progress and rewards", () => {
  const plan = planRift(base());
  const core0 = newCoreSave(NOW);
  it("completing a room records it once and counts the day for the streak", () => {
    const c1 = completeRoom(core0, plan, "blitz");
    expect(completedRooms(c1, plan.day)).toEqual(["blitz"]);
    expect(c1.profile.streakDays).toBe(1);
    expect(completeRoom(c1, plan, "blitz")).toBe(c1);
    const c2 = completeRoom(completeRoom(c1, plan, "fresh"), plan, "review");
    expect(completedRooms(c2, plan.day)).toEqual(["blitz", "fresh"]); // review room is empty: ignored
  });
  it("rewards scale with completion and add a full-clear bonus for required rooms", () => {
    const required = plan.rooms.filter((r) => !r.optional && r.items.length > 0).map((r) => r.kind);
    const none = rewardFor(plan, [], 0);
    const some = rewardFor(plan, [required[0]], 0);
    const all = rewardFor(plan, required, 0);
    const allPlusBonus = rewardFor(plan, [...required, "bonus"], 0);
    expect(none).toEqual({ bits: 0, xp: 0 });
    expect(some.bits).toBe(BITS_PER_ROOM);
    expect(all.bits).toBe(required.length * BITS_PER_ROOM + FULL_CLEAR_BONUS);
    expect(allPlusBonus.bits).toBe(all.bits + BONUS_ROOM_BITS);
    expect(rewardFor(plan, [required[0]], 30).bits).toBe(BITS_PER_ROOM + 14); // streak bonus capped at 7 days
  });
  it("pays once per day", () => {
    let c = completeRoom(core0, plan, "blitz");
    const first = claimReward(c, plan);
    expect(first.reward.bits).toBe(BITS_PER_ROOM + 2);
    expect(first.core.profile.bits).toBe(BITS_PER_ROOM + 2);
    c = completeRoom(first.core, plan, "debug");
    const second = claimReward(c, plan);
    expect(second.reward).toEqual({ bits: 0, xp: 0 });
    expect(second.core).toBe(c);
  });
  it("claiming with nothing cleared pays nothing and does not lock the day", () => {
    const r = claimReward(core0, plan);
    expect(r.core).toBe(core0);
    expect(r.reward.bits).toBe(0);
  });
});
