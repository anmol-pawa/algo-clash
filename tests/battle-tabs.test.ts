import { describe, expect, it } from "vitest";
import { BATTLE_TABS, battleOutcome, stepTab, tabAfterJudge } from "@/lib/ui/battleTabs";

describe("battle tabs", () => {
  it("run never moves the player", () => {
    for (const v of ["AC", "WA", "TLE", "RE", "CE"] as const) expect(tabAfterJudge("code", "run", v)).toBe("code");
  });
  it("submit shows the stage, except compile errors stay on the code", () => {
    expect(tabAfterJudge("code", "submit", "AC")).toBe("stage");
    expect(tabAfterJudge("code", "submit", "WA")).toBe("stage");
    expect(tabAfterJudge("code", "submit", "CE")).toBe("code");
  });
  it("stepTab wraps both ways", () => {
    expect(stepTab("code", 1)).toBe("stage");
    expect(stepTab("stage", -1)).toBe("code");
    expect(BATTLE_TABS.map((t) => t.id)).toEqual(["stage", "problem", "code"]);
  });
});

describe("battleOutcome", () => {
  it("accepted submit defeats the foe, accepted run chips it", () => {
    expect(battleOutcome("submit", "AC", 10, 10, 100).foeDamage).toBe(100);
    const r = battleOutcome("run", "AC", 2, 2, 100);
    expect(r.foeDamage).toBe(25);
    expect(r.playerHearts).toBe(0);
  });
  it("only a failed submit costs a heart", () => {
    expect(battleOutcome("submit", "WA", 3, 10, 100).playerHearts).toBe(1);
    expect(battleOutcome("run", "WA", 0, 2, 100).playerHearts).toBe(0);
    expect(battleOutcome("submit", "CE", 0, 10, 100).playerHearts).toBe(0);
  });
  it("names the failure", () => {
    expect(battleOutcome("submit", "TLE", 5, 10, 100).line).toContain("ran out of time");
    expect(battleOutcome("submit", "RE", 5, 10, 100).line).toContain("crashed");
  });
});
