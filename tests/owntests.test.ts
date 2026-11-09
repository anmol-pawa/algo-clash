import { describe, expect, it } from "vitest";
import { MODES } from "../lib/modes/modes";
import { applicableClasses, coverage, hidesDiff, inputClasses, ownTestIssue, ownTestsGate, MIN_OWN_TESTS } from "../lib/modes/owntests";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("inputClasses", () => {
  it("detects each class", () => {
    expect(inputClasses("[]")).toContain("empty");
    expect(inputClasses("[7]")).toEqual(["single"]);
    expect(inputClasses("[0,1]")).toEqual(["zero"]);
    expect(inputClasses("[-3,4]")).toEqual(["negative"]);
    expect(inputClasses("[2,2,5]")).toEqual(["duplicate"]);
    expect(inputClasses("[2000000000]")).toEqual(["single", "large"]);
    expect(inputClasses("[1,2,3]")).toEqual([]);
  });
  it("treats a quoted empty string and a blank line as empty", () => {
    expect(inputClasses('""')).toContain("empty");
    expect(inputClasses("[1]\n")).not.toContain("empty");
  });
  it("does not count a 0 inside a larger number", () => {
    expect(inputClasses("[10,20]")).toEqual([]);
  });
});

describe("coverage and the gate", () => {
  it("only asks for classes the hidden edge tests exercise", () => {
    const a = applicableClasses([
      { input: "[1,2]", expected: "3", group: "basic" },
      { input: "[]", expected: "0", group: "edge" },
      { input: "[-1]", expected: "-1", group: "edge" },
    ]);
    expect(a).toEqual(["empty", "single", "negative"]);
  });
  it("scores the covered fraction", () => {
    const c = coverage([{ input: "[]" }, { input: "[5]" }], ["empty", "single", "negative"]);
    expect(c.covered).toEqual(["empty", "single"]);
    expect(c.missed).toEqual(["negative"]);
    expect(c.ratio).toBeCloseTo(2 / 3);
    expect(coverage([], []).ratio).toBe(1);
  });
  it("unlocks Submit only after enough passing, well-formed own tests", () => {
    const t = (passed?: boolean, input = "[1]", expected = "1") => ({ input, expected, passed });
    expect(ownTestsGate(true, []).unlocked).toBe(false);
    expect(ownTestsGate(true, [t(true), t(false)]).unlocked).toBe(false);
    expect(ownTestsGate(true, [t(true), t(true, "", "1")]).unlocked).toBe(false);
    expect(ownTestsGate(true, Array.from({ length: MIN_OWN_TESTS }, () => t(true))).unlocked).toBe(true);
    expect(ownTestsGate(false, []).unlocked).toBe(true);
  });
  it("flags blank sides", () => {
    expect(ownTestIssue({ input: " ", expected: "1" })).toMatch(/input/);
    expect(ownTestIssue({ input: "[1]", expected: "" })).toMatch(/expected/);
    expect(ownTestIssue({ input: "[1]", expected: "1" })).toBeNull();
  });
  it("only Interview and Contest gate and hide the diff", () => {
    for (const m of MODES) expect(hidesDiff(m.ownTests)).toBe(m.id === "interview" || m.id === "contest");
  });
});

describe("shipped problems", () => {
  it("derives applicable classes from each problem's own hidden tests", () => {
    const root = join(__dirname, "..", "content", "problems");
    let withEmpty = 0;
    let total = 0;
    for (const region of readdirSync(root)) {
      for (const id of readdirSync(join(root, region))) {
        const f = join(root, region, id, "tests.json");
        if (!existsSync(f)) continue;
        const hidden = JSON.parse(readFileSync(f, "utf8")) as { input: string; expected: string; group: string }[];
        const a = applicableClasses(hidden);
        total++;
        if (a.includes("empty")) withEmpty++;
        // a perfect set of own tests (all hidden edge inputs) must reach full coverage
        expect(coverage(hidden.filter((t) => t.group !== "basic"), a).ratio, id).toBe(1);
      }
    }
    expect(total).toBeGreaterThanOrEqual(20);
    expect(withEmpty).toBeGreaterThan(0);
  });
});
