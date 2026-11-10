import { describe, expect, it } from "vitest";
import { STATEMENTS } from "@/content/recognition";
import { outcomeOf, pickRound, recordScout, scoutOutcome, scoutProgress } from "@/lib/recognition/progress";
import type { CoreSave } from "@/lib/save/schema";

const empty = { flags: {} } as unknown as CoreSave;

describe("scout progress", () => {
  it("maps grading results to outcomes", () => {
    expect(outcomeOf({ correct: true, inTime: true })).toBe(2);
    expect(outcomeOf({ correct: true, inTime: false })).toBe(1);
    expect(outcomeOf({ correct: false, inTime: false })).toBe(0);
  });
  it("records the latest outcome idempotently", () => {
    const a = recordScout(empty, "x", 2);
    expect(scoutOutcome(a, "x")).toBe(2);
    expect(recordScout(a, "x", 2)).toBe(a);
    expect(scoutOutcome(recordScout(a, "x", 0), "x")).toBe(0);
    expect(scoutOutcome(empty, "x")).toBeUndefined();
  });
  it("masters at 50 seen and 90% in time, not before", () => {
    let c = empty;
    STATEMENTS.slice(0, 49).forEach((s) => (c = recordScout(c, s.id, 2)));
    expect(scoutProgress(c, STATEMENTS).mastered).toBe(false);
    c = recordScout(c, STATEMENTS[49]!.id, 2);
    expect(scoutProgress(c, STATEMENTS).mastered).toBe(true);
    // 6 misses out of 50 = 88 % < 90 %
    STATEMENTS.slice(0, 6).forEach((s) => (c = recordScout(c, s.id, 0)));
    expect(scoutProgress(c, STATEMENTS).mastered).toBe(false);
    expect(scoutProgress(c, STATEMENTS).seen).toBe(50);
    c = recordScout(c, STATEMENTS[0]!.id, 2);
    expect(scoutProgress(c, STATEMENTS).mastered).toBe(true); // 5 misses = 90 %
  });
  it("rounds put unseen first, then misses, then in-time, deterministically", () => {
    let c = empty;
    STATEMENTS.slice(0, 5).forEach((s) => (c = recordScout(c, s.id, 2)));
    c = recordScout(c, STATEMENTS[5]!.id, 0);
    const round = pickRound(c, STATEMENTS, 10, 1);
    expect(round).toHaveLength(10);
    expect(round.every((s) => scoutOutcome(c, s.id) === undefined)).toBe(true);
    expect(pickRound(c, STATEMENTS, 10, 1).map((s) => s.id)).toEqual(round.map((s) => s.id));
    const all = pickRound(c, STATEMENTS, STATEMENTS.length, 1);
    expect(all[STATEMENTS.length - 1] && scoutOutcome(c, all[STATEMENTS.length - 1]!.id)).toBe(2);
    expect(new Set(all.map((s) => s.id)).size).toBe(STATEMENTS.length);
  });
});
