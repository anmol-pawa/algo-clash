import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { constraintStats, parseInline, parseStatement } from "../lib/ui/statement";
import { buildVerdictView, firstDiffIndex } from "../lib/ui/verdictView";
import type { JudgeResult } from "../lib/judge/judge";

describe("statement markdown", () => {
  it("parses inline code and bold without emitting HTML", () => {
    expect(parseInline("a `x<y` **b** <b>c</b>")).toEqual([
      { kind: "text", text: "a " },
      { kind: "code", text: "x<y" },
      { kind: "text", text: " " },
      { kind: "bold", text: "b" },
      { kind: "text", text: " <b>c</b>" },
    ]);
  });
  it("parses a real problem into title, sections and constraint stats", () => {
    const md = readFileSync("content/problems/R6/crate-brackets/problem.md", "utf8");
    const st = parseStatement(md);
    expect(st.title).toBe("Crate Brackets");
    expect(st.sections.map((s) => s.heading)).toEqual(["", "Examples", "Constraints"]);
    const stats = constraintStats(st.sections[2]);
    expect(stats[0].value).toBe("0 <= s.length() <= 100000");
    expect(stats.length).toBe(3);
  });
});

describe("verdict view", () => {
  const tests = [{ input: "\"()\"", expected: "true", group: "basic" }, { input: "\"(\"", expected: "false", group: "edge" }];
  it("shows a diff for the first wrong answer", () => {
    const r: JudgeResult = { verdict: "WA", failedAt: 1, maxMs: 3, outcomes: [{ verdict: "AC", wallMs: 1 }, { verdict: "WA", wallMs: 2, got: "true", expected: "false", reason: "Wrong answer." }] };
    const v = buildVerdictView(r, tests);
    expect(v.tone).toBe("lose");
    expect(v.passed).toBe(1);
    expect(v.detail).toContain("Test 2 (edge)");
    expect(v.diff).toEqual({ input: "\"(\"", expected: "false", got: "true", firstDiff: 0 });
  });
  it("reports AC and CE", () => {
    const ac = buildVerdictView({ verdict: "AC", failedAt: null, maxMs: 7, outcomes: tests.map(() => ({ verdict: "AC" as const, wallMs: 7 })) }, tests);
    expect(ac.tone).toBe("win");
    expect(ac.detail).toContain("All 2 tests passed");
    const ce = buildVerdictView({ verdict: "CE", failedAt: null, maxMs: 0, outcomes: [], diagnostics: "x", firstError: { line: 4, column: 1, message: "expected ';'", entry: null } }, tests);
    expect(ce.tone).toBe("warn");
    expect(ce.compile?.line).toBe(4);
  });
  it("finds the first differing character", () => {
    expect(firstDiffIndex("[0,1]", "[0,2]")).toBe(3);
    expect(firstDiffIndex("ab", "abc")).toBe(2);
  });
});
