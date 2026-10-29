import { describe, expect, it } from "vitest";
import { outputsMatch, parseLc, printLc, treeFromLevelOrder, treeToLevelOrder, type LcValue } from "../lib/judge/lc";
import { friendlyRuntimeReason, judgeOne, summarise } from "../lib/judge/verdict";
import type { RunResult } from "../lib/judge/client";

const run = (o: Partial<RunResult>): RunResult => ({ status: "ok", exitCode: 0, stdout: "", stderr: "", wallMs: 5, detail: "", memPages: 1, ...o });

describe("LC literals", () => {
  it.each([
    "[1,2,null,3]",
    "[[1,2],[3],[]]",
    '"abc"',
    '["a","b\\"c"]',
    "true",
    "-3",
    "1.5",
    "[]",
    "[[],[]]",
  ])("round-trips %s", (t) => {
    expect(printLc(parseLc(t))).toBe(t);
  });
  it("tolerates whitespace and normalises it away", () => {
    expect(printLc(parseLc(" [ 1 , [ 2,3 ] ,\n null ] "))).toBe("[1,[2,3],null]");
  });
  it.each(["[1,2", "[1 2]", '"abc', "tru", "[1,]x", "1 2"])("rejects %j", (t) => {
    expect(() => parseLc(t)).toThrow();
  });
});

describe("trees", () => {
  it("rebuilds level-order and trims trailing nulls", () => {
    const a = [1, null, 2, 3] as LcValue[];
    expect(treeToLevelOrder(treeFromLevelOrder(a))).toEqual([1, null, 2, 3]);
    expect(treeToLevelOrder(treeFromLevelOrder([1, 2, 3, null, null, null, null]))).toEqual([1, 2, 3]);
    expect(treeToLevelOrder(treeFromLevelOrder([]))).toEqual([]);
  });
});

describe("outputsMatch", () => {
  it("ignores spacing differences", () => {
    expect(outputsMatch("[1, 2]\n", "[1,2]")).toBe(true);
    expect(outputsMatch("[1,2]", "[2,1]")).toBe(false);
  });
  it("falls back to token comparison for non-literal output", () => {
    expect(outputsMatch("a  b", "a b\n")).toBe(true);
  });
  it("uses a relative tolerance for floats", () => {
    expect(outputsMatch("[1.0,2.5]", "[1.0000001,2.5]", 1e-5)).toBe(true);
    expect(outputsMatch("2.5", "2.6", 1e-5)).toBe(false);
  });
});

describe("verdicts", () => {
  const t = { input: "x", expected: "[1,2]" };
  it("maps each run status", () => {
    expect(judgeOne(t, run({ stdout: "[1, 2]\n" })).verdict).toBe("AC");
    const wa = judgeOne(t, run({ stdout: "[2,1]" }));
    expect(wa).toMatchObject({ verdict: "WA", got: "[2,1]", expected: "[1,2]" });
    expect(judgeOne(t, run({ status: "TLE", wallMs: 2000 })).verdict).toBe("TLE");
    expect(judgeOne(t, run({ status: "RE", detail: "stack overflow: x" })).reason).toMatch(/Stack overflow/);
  });
  it("friendly reasons", () => {
    expect(friendlyRuntimeReason("memory access out of bounds", "")).toMatch(/Out-of-bounds/);
    expect(friendlyRuntimeReason("unreachable", "")).toMatch(/aborted/);
    expect(friendlyRuntimeReason("???", "")).toMatch(/Runtime error/);
  });
  it("summarises the first failure", () => {
    const ac = { verdict: "AC" as const, wallMs: 3 };
    expect(summarise([ac, ac])).toEqual({ verdict: "AC", failedAt: null, maxMs: 3 });
    expect(summarise([ac, { verdict: "WA", wallMs: 9 }, { verdict: "TLE", wallMs: 1 }])).toEqual({ verdict: "WA", failedAt: 1, maxMs: 9 });
  });
});
