import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { MODES, MODE_IDS, hintsAllowed, masteryRule, runsLeft, timeLimitSeconds } from "@/lib/modes/modes";
import { classifyInput, coverage, coverageNudge, MIN_OWN_TESTS } from "@/lib/modes/ownTests";

describe("modes", () => {
  it("matches the GDD §6.5 table", () => {
    expect(MODE_IDS).toEqual(["guided", "standard", "interview", "contest"]);
    expect(MODES.guided.countsForMastery).toBe(false);
    expect(MODES.standard.autocomplete && MODES.standard.hints === "ladder").toBe(true);
    expect(MODES.interview.autocomplete).toBe(false);
    expect(MODES.interview.masteryMultiplier).toBe(1.25);
    expect(MODES.contest.timerParMultiple).toBe(2);
    expect(MODES.interview.timerParMultiple).toBeNull();
  });
  it("limits runs and hints", () => {
    expect(runsLeft("standard", 99)).toBeNull();
    expect(runsLeft("interview", 2)).toBe(3);
    expect(runsLeft("interview", 9)).toBe(0);
    expect(hintsAllowed("guided") && hintsAllowed("standard")).toBe(true);
    expect(hintsAllowed("interview") || hintsAllowed("contest")).toBe(false);
  });
  it("computes the clock", () => {
    expect(timeLimitSeconds("standard", 300)).toBeNull();
    expect(timeLimitSeconds("contest", 300)).toBe(600);
  });
  it("feeds the SRS honestly", () => {
    expect(masteryRule("guided", false)).toEqual({ counts: false, assisted: true, intervalMultiplier: 1 });
    expect(masteryRule("standard", false).intervalMultiplier).toBe(1);
    expect(masteryRule("interview", false).intervalMultiplier).toBe(1.25);
    expect(masteryRule("interview", true)).toEqual({ counts: true, assisted: true, intervalMultiplier: 1 });
  });
});

describe("own-test edge coverage", () => {
  it("classifies inputs", () => {
    expect([...classifyInput("[]\n5")].sort()).toEqual(["empty"]);
    expect([...classifyInput("[7]\n0")].sort()).toEqual(["single", "zero"]);
    expect([...classifyInput("[-1,-1,3]")].sort()).toEqual(["duplicates", "negative"]);
    expect(classifyInput("2000000000").has("extreme")).toBe(true);
    expect(classifyInput('"aab"').has("duplicates")).toBe(true);
    expect(classifyInput(`[${Array.from({ length: 120 }, (_, i) => i).join(",")}]`).has("large")).toBe(true);
    expect(classifyInput("not a literal").size).toBe(0);
  });
  it("scores against the hidden tests and gates", () => {
    const hidden = ["[]", "[5]", "[-2,3]", "[1,1]"];
    const none = coverage(["[1,2,3]"], hidden);
    expect(none.passes).toBe(false);
    expect(none.missing).toContain("empty");
    expect(coverageNudge(none, 1)).toMatch(/at least 2/);
    const some = coverage(["[]", "[9]", "[1,2]"], hidden);
    expect(some.score).toBeGreaterThanOrEqual(0.5);
    expect(some.passes).toBe(true);
    expect(coverageNudge(some, 3)).toMatch(/Good/);
    expect(coverageNudge(coverage(["[1]", "[2]"], hidden), 2)).toMatch(/Think about/);
    expect(coverage([], []).score).toBe(1);
    expect(MIN_OWN_TESTS).toBe(2);
  });
  it("every shipped problem has a sensible expected-class set a tester can reach", () => {
    const root = join(__dirname, "..", "content", "problems");
    let n = 0;
    for (const reg of readdirSync(root)) {
      for (const p of readdirSync(join(root, reg))) {
        let tests: { input: string; group?: string }[];
        try { tests = JSON.parse(readFileSync(join(root, reg, p, "tests.json"), "utf8")); } catch { continue; }
        const r = coverage(tests.map((t) => t.input), tests.map((t) => t.input));
        expect(r.score).toBe(1); // a tester who wrote all hidden inputs covers everything
        expect(r.passes).toBe(true);
        // the visible (basic) tests alone must not be "perfect" for every problem; we only require sanity
        expect(r.expected.length).toBeLessThanOrEqual(7);
        n++;
      }
    }
    expect(n).toBeGreaterThanOrEqual(20);
  });
});
