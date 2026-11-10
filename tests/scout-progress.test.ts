import { describe, expect, it } from "vitest";
import { STATEMENTS } from "@/content/recognition";
import { newCoreSave } from "@/lib/save/schema";
import { pickRound, recordBlitz, scoutProgress, statementFlag } from "@/lib/recognition/progress";

describe("scout progress", () => {
  const fresh = () => newCoreSave(0);
  it("starts empty and not mastered", () => {
    expect(scoutProgress(fresh(), STATEMENTS)).toMatchObject({ attempted: 0, inTime: 0, mastered: false });
  });
  it("latest attempt wins and recording is idempotent", () => {
    const a = recordBlitz(fresh(), "x", { inTime: false });
    expect(a.flags[statementFlag("x")]).toBe(0);
    expect(recordBlitz(a, "x", { inTime: false })).toBe(a);
    expect(recordBlitz(a, "x", { inTime: true }).flags[statementFlag("x")]).toBe(1);
  });
  it("masters at >= 90 % in time on >= 50 statements", () => {
    let c = fresh();
    STATEMENTS.slice(0, 50).forEach((s, i) => { c = recordBlitz(c, s.id, { inTime: i >= 5 }); });
    expect(scoutProgress(c, STATEMENTS)).toMatchObject({ attempted: 50, inTime: 45, mastered: true });
    c = recordBlitz(c, STATEMENTS[10]!.id, { inTime: false });
    expect(scoutProgress(c, STATEMENTS).mastered).toBe(false);
  });
  it("49 perfect statements are not enough", () => {
    let c = fresh();
    STATEMENTS.slice(0, 49).forEach((s) => { c = recordBlitz(c, s.id, { inTime: true }); });
    expect(scoutProgress(c, STATEMENTS).mastered).toBe(false);
  });
  it("rounds prefer unseen, then missed, then done", () => {
    let c = recordBlitz(fresh(), STATEMENTS[0]!.id, { inTime: true });
    c = recordBlitz(c, STATEMENTS[1]!.id, { inTime: false });
    const r = pickRound(c, STATEMENTS, STATEMENTS.length);
    expect(r[0]!.id).toBe(STATEMENTS[2]!.id);
    expect(r[r.length - 1]!.id).toBe(STATEMENTS[0]!.id);
    expect(r[r.length - 2]!.id).toBe(STATEMENTS[1]!.id);
    expect(pickRound(c, STATEMENTS, 10)).toHaveLength(10);
  });
});
