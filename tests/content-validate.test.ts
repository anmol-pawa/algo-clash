import { describe, expect, it } from "vitest";
import { PATTERNS, PATTERN_IDS, patternById } from "../content/patterns";
import { EDITORIAL_SECTIONS, findPrerequisiteCycle, validateEditorial, validateHints, validateMeta, validateStatement, validateTests } from "../lib/content/validate";
import type { ProblemMeta } from "../lib/content/types";

const meta: ProblemMeta = {
  id: "pair-finder",
  region: "R2",
  title: "Pair Finder",
  difficulty: "E",
  patterns: ["hash-lookup"],
  signals: ["pair summing to"],
  prerequisites: [],
  parSeconds: 300,
  timeLimitMs: 1000,
  testWeights: { basic: 0.3, edge: 0.2, adversarial: 0.3, perf: 0.2 },
  similar: [{ name: "Two Sum", lcNumber: 1 }],
  spec: { kind: "function", name: "pairIndices", params: [{ type: "vector<int>&", name: "nums" }], returns: "vector<int>" },
};

const section = (n: string) => `## ${n}\n${n === "Optimal" ? "Time O(n), space O(n) using a hash map." : "Some real explanatory text here."}\n\n`;
const editorial = "# Pair Finder\n\n" + EDITORIAL_SECTIONS.map(section).join("");

describe("pattern taxonomy", () => {
  it("has unique ids, valid regions and signals", () => {
    expect(PATTERN_IDS.size).toBe(PATTERNS.length);
    for (const p of PATTERNS) {
      expect(p.region).toMatch(/^R\d+$/);
      expect(p.signals.length).toBeGreaterThan(0);
    }
    expect(patternById("heap")?.region).toBe("R11");
  });
});

describe("validateMeta", () => {
  it("accepts a good meta", () => expect(validateMeta(meta, new Set())).toEqual([]));
  it("rejects bad fields", () => {
    const errs = validateMeta({ ...meta, id: "Bad Id", region: "R99", patterns: ["nope", "nope"], prerequisites: ["ghost", "Bad Id"], parSeconds: 0, testWeights: { basic: 1, edge: 1, adversarial: 0, perf: 0 }, similar: [{ name: "x", url: "http://x" }] }, new Set());
    expect(errs.join("\n")).toMatch(/kebab-case/);
    expect(errs.join("\n")).toMatch(/R0–R23/);
    expect(errs.join("\n")).toMatch(/unknown pattern "nope"/);
    expect(errs.join("\n")).toMatch(/duplicate pattern/);
    expect(errs.join("\n")).toMatch(/unknown prerequisite "ghost"/);
    expect(errs.join("\n")).toMatch(/require itself/);
    expect(errs.join("\n")).toMatch(/parSeconds/);
    expect(errs.join("\n")).toMatch(/sum to 1/);
    expect(errs.join("\n")).toMatch(/https/);
  });
});

describe("validateEditorial", () => {
  it("accepts all eight sections in order", () => expect(validateEditorial(editorial)).toEqual([]));
  it("reports a missing section", () => expect(validateEditorial(editorial.replace("## Follow-ups", "## Other"))).toContain('editorial is missing "## Follow-ups"'));
  it("reports order and empty sections", () => {
    const swapped = "# T\n" + [...EDITORIAL_SECTIONS].reverse().map(section).join("");
    expect(validateEditorial(swapped).some((e) => e.includes("out of order"))).toBe(true);
    expect(validateEditorial(editorial.replace(/## Brute force\n.*\n/, "## Brute force\nx\n")).some((e) => e.includes('"Brute force" is empty'))).toBe(true);
  });
  it("requires a complexity claim in Optimal", () => {
    expect(validateEditorial(editorial.replace("Time O(n), space O(n) using a hash map.", "It is fast and uses little memory overall.")).some((e) => e.includes("O(...)"))).toBe(true);
  });
});

describe("validateHints and validateStatement", () => {
  const hints = "## Nudge\nThink about what you have already seen.\n## Approach\nKeep a map from value to index.\n## Key insight\nLook up the complement before inserting.\n";
  it("accepts a 3-rung ladder", () => expect(validateHints(hints)).toEqual([]));
  it("rejects wrong rungs and empty rungs", () => {
    expect(validateHints("## Nudge\nsomething long enough\n")).not.toEqual([]);
    expect(validateHints(hints.replace("Keep a map from value to index.", "x"))).toContain('hint rung "Approach" is empty');
  });
  it("checks the statement skeleton", () => {
    expect(validateStatement("# T\n\ntext\n## Examples\n...\n## Constraints\n...")).toEqual([]);
    expect(validateStatement("text")).toHaveLength(3);
  });
});

describe("validateTests", () => {
  it("checks groups, weights, duplicates and blanks", () => {
    const ok = (["basic", "edge", "adversarial", "perf"] as const).map((group, i) => ({ input: `[${i}]\n1`, expected: "1", group }));
    expect(validateTests(ok, meta)).toEqual([]);
    expect(validateTests(ok.slice(0, 3), meta)).toContain('no tests in group "perf" but its weight is 0.2');
    expect(validateTests([...ok, { ...ok[0] }], meta).some((e) => e.includes("duplicates"))).toBe(true);
    expect(validateTests([{ input: "", expected: "1", group: "basic" }], { testWeights: { basic: 1, edge: 0, adversarial: 0, perf: 0 } })).toHaveLength(1);
  });
});

describe("findPrerequisiteCycle", () => {
  it("finds cycles and accepts DAGs", () => {
    expect(findPrerequisiteCycle([{ id: "a", prerequisites: ["b"] }, { id: "b", prerequisites: [] }])).toBeNull();
    expect(findPrerequisiteCycle([{ id: "a", prerequisites: ["b"] }, { id: "b", prerequisites: ["a"] }])).toEqual(["a", "b", "a"]);
  });
});
