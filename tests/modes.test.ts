import { describe, expect, it } from "vitest";
import { MODES, allows, clockSeconds, effectiveSeconds, modeDef, runsLeft, submitBlockedReason } from "@/lib/modes/modes";
import { classesOf, coverage } from "@/lib/modes/coverage";

describe("modes", () => {
  it("matches GDD 6.5", () => {
    expect(MODES.map((m) => m.id)).toEqual(["guided", "standard", "interview", "contest"]);
    expect(modeDef("guided").guided).toBe(true);
    expect(modeDef("standard").autocomplete).toBe(true);
    expect(modeDef("interview").autocomplete).toBe(false);
    expect(modeDef("interview").masteryMultiplier).toBe(1.25);
    expect(modeDef("nope").id).toBe("standard");
  });
  it("limits runs and gates submit on own tests", () => {
    const i = modeDef("interview");
    expect(runsLeft(i, 2)).toBe(3);
    expect(runsLeft(i, 9)).toBe(0);
    expect(runsLeft(modeDef("standard"), 99)).toBe(Infinity);
    expect(submitBlockedReason(i, 0)).toMatch(/test of your own/);
    expect(submitBlockedReason(i, 1)).toBeNull();
    expect(submitBlockedReason(modeDef("standard"), 0)).toBeNull();
  });
  it("only contest has a clock, interview forbids help", () => {
    expect(clockSeconds(modeDef("contest"), 300)).toBe(600);
    expect(clockSeconds(modeDef("interview"), 300)).toBeNull();
    expect(allows(modeDef("interview"), "hints")).toBe(false);
    expect(allows(modeDef("standard"), "hints")).toBe(true);
  });
  it("interview speeds the effective time by 1.25", () => {
    expect(effectiveSeconds(modeDef("interview"), 500)).toBe(400);
    expect(effectiveSeconds(modeDef("standard"), 500)).toBe(500);
  });
});

describe("edge-case coverage", () => {
  it("classifies inputs", () => {
    expect([...classesOf("[]\n3")]).toContain("empty");
    expect(classesOf("[5]\n1").has("single")).toBe(true);
    expect(classesOf("[1,1,2]").has("duplicates")).toBe(true);
    expect(classesOf("[7,7,7]").has("all-equal")).toBe(true);
    expect(classesOf("[-3,4]").has("negative")).toBe(true);
    expect(classesOf("[0,4]").has("zero")).toBe(true);
    expect(classesOf("[1000000000]").has("large")).toBe(true);
    expect(classesOf("[1,2,3]").has("sorted")).toBe(true);
    expect(classesOf("[3,1,2]").has("unsorted")).toBe(true);
    expect(classesOf("[1,null,2]").has("null-gap")).toBe(true);
    expect(classesOf("garbage((").size).toBe(0);
  });
  it("scores against the reference tests", () => {
    const ref = ["[]", "[5]", "[1,1]", "[-1,2]"];
    const c = coverage(["[]", "[9]"], ref);
    expect(c.covered).toEqual(["empty", "single"]);
    expect(c.missed).toEqual(expect.arrayContaining(["duplicates", "negative"]));
    expect(c.score).toBeCloseTo(2 / (2 + c.missed.length));
    expect(coverage([], []).score).toBe(1);
    expect(coverage(["[]", "[5]", "[1,1]", "[-1,2]"], ref).score).toBe(1);
  });
});

import { parseOwnTests } from "@/lib/modes/ownTests";
describe("own tests", () => {
  it("parses blocks and reports errors", () => {
    const r = parseOwnTests("[1,2,3]\n3\n=> 2\n\n[]\n0\n=> -1\n\n[1]\n5");
    expect(r.tests).toEqual([
      { input: "[1,2,3]\n3", expected: "2", group: "own" },
      { input: "[]\n0", expected: "-1", group: "own" },
    ]);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]).toMatch(/Test 3/);
    expect(parseOwnTests("[1,\n=> 2").errors[0]).toMatch(/could not read/);
    expect(parseOwnTests("").tests).toEqual([]);
  });
});
