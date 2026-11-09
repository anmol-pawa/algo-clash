import { describe, expect, it } from "vitest";
import { PATTERN_IDS } from "../content/patterns";
import { STATEMENTS } from "../content/recognition/statements";
import {
  BLITZ_SECONDS, gradeRecognition, highlight, optionsFor, pickBlitz, regionOf, summarize, type RecognitionStatement,
} from "../lib/recognition/recognition";

const one = STATEMENTS[0];

describe("recognition statements", () => {
  it("ships at least 60 uniquely identified statements", () => {
    expect(STATEMENTS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(STATEMENTS.map((s) => s.id)).size).toBe(STATEMENTS.length);
    expect(new Set(STATEMENTS.map((s) => s.statement)).size).toBe(STATEMENTS.length);
  });

  it.each(STATEMENTS.map((s) => [s.id, s] as const))("%s is well formed", (_id, s) => {
    expect(s.patterns.length).toBeGreaterThanOrEqual(1);
    expect(s.patterns.length).toBeLessThanOrEqual(2);
    for (const p of [...s.patterns, ...s.distractors]) expect(PATTERN_IDS.has(p), `unknown pattern ${p}`).toBe(true);
    expect(s.distractors.length).toBeGreaterThanOrEqual(3);
    expect(s.distractors.filter((d) => s.patterns.includes(d))).toEqual([]);
    expect(new Set(s.distractors).size).toBe(s.distractors.length);
    expect(s.constraints.length).toBeGreaterThan(0);
    expect(s.explanation.length).toBeGreaterThan(40);
    expect(s.signals.length).toBeGreaterThanOrEqual(1);
    const text = `${s.statement}\n${s.constraints.join("\n")}`.toLowerCase();
    for (const sig of s.signals) expect(text.includes(sig.toLowerCase()), `signal "${sig}" not in text`).toBe(true);
    expect(regionOf(s)).toMatch(/^R\d+$/);
  });

  it("covers the main patterns of the curriculum", () => {
    const covered = new Set(STATEMENTS.flatMap((s) => s.patterns));
    for (const p of ["hash-lookup", "two-pointers", "prefix-sum", "sliding-window", "monotonic-stack", "binary-search", "heap", "graph-traversal", "topological-sort", "dsu", "shortest-path", "backtracking", "dp-1d", "dp-grid", "dp-knapsack", "greedy", "intervals", "trie", "segment-tree", "design-ds", "bit-manipulation"]) {
      expect(covered.has(p), `no statement for ${p}`).toBe(true);
    }
    expect(covered.size).toBeGreaterThanOrEqual(28);
  });
});

describe("highlight", () => {
  it("marks signals case-insensitively and reassembles the text", () => {
    const segs = highlight("Find the Smallest missing positive value", ["smallest missing positive"]);
    expect(segs).toEqual([
      { text: "Find the ", signal: false },
      { text: "Smallest missing positive", signal: true },
      { text: " value", signal: false },
    ]);
  });
  it("merges overlapping signals and never loses text", () => {
    const text = "sorted array of sorted lists";
    const segs = highlight(text, ["sorted array", "array of sorted", "lists"]);
    expect(segs.map((s) => s.text).join("")).toBe(text);
    expect(segs.filter((s) => s.signal).map((s) => s.text)).toEqual(["sorted array of sorted", "lists"]);
  });
  it("returns the plain text when nothing matches", () => {
    expect(highlight("abc", ["zzz"])).toEqual([{ text: "abc", signal: false }]);
    expect(highlight("", ["x"])).toEqual([]);
  });
  it("highlights every shipped statement's signals", () => {
    for (const s of STATEMENTS) {
      const marked = highlight(`${s.statement}\n${s.constraints.join("\n")}`, s.signals).filter((g) => g.signal);
      expect(marked.length, s.id).toBeGreaterThan(0);
    }
  });
});

describe("gradeRecognition", () => {
  const two: RecognitionStatement = { ...one, patterns: ["prefix-sum", "hash-lookup"], distractors: ["kadane", "sliding-window", "two-pointers"] };
  it("accepts exactly the right set in time", () => {
    expect(gradeRecognition(two, ["hash-lookup", "prefix-sum"], 12).correct).toBe(true);
  });
  it("reports missed and extra patterns", () => {
    const g = gradeRecognition(two, ["prefix-sum", "kadane"], 5);
    expect(g.correct).toBe(false);
    expect(g.missed).toEqual(["hash-lookup"]);
    expect(g.extra).toEqual(["kadane"]);
  });
  it("treats a right answer after the limit, or a timeout, as a miss", () => {
    const late = gradeRecognition(two, two.patterns, BLITZ_SECONDS + 0.1);
    expect(late.rightSet).toBe(true);
    expect(late.inTime).toBe(false);
    expect(late.correct).toBe(false);
    expect(gradeRecognition(two, two.patterns, BLITZ_SECONDS).correct).toBe(true);
    expect(gradeRecognition(two, [], null).correct).toBe(false);
  });
});

describe("optionsFor", () => {
  it("contains the answers and distractors once each, stable per seed", () => {
    for (const s of STATEMENTS) {
      const o = optionsFor(s, 7);
      expect([...o].sort()).toEqual([...new Set([...s.patterns, ...s.distractors])].sort());
      expect(optionsFor(s, 7)).toEqual(o);
    }
  });
  it("does not always place the first answer in the same slot", () => {
    const slots = new Set(STATEMENTS.map((s) => optionsFor(s, 3).indexOf(s.patterns[0])));
    expect(slots.size).toBeGreaterThan(1);
  });
});

describe("summarize", () => {
  it("computes accuracy and the 90 % over 50 target", () => {
    const mk = (n: number, bad: number) => Array.from({ length: n }, (_, i) => ({ id: `x${i}`, correct: i >= bad, seconds: 10 }));
    expect(summarize(mk(50, 5)).meetsTarget).toBe(true);
    expect(summarize(mk(50, 6)).meetsTarget).toBe(false);
    expect(summarize(mk(10, 0)).meetsTarget).toBe(false);
    expect(summarize([])).toMatchObject({ total: 0, accuracy: 0, meanSeconds: 0, meetsTarget: false });
  });
  it("ignores timeouts in the mean time", () => {
    const s = summarize([{ id: "a", correct: true, seconds: 4 }, { id: "b", correct: false, seconds: null }, { id: "c", correct: true, seconds: 8 }]);
    expect(s.meanSeconds).toBe(6);
    expect(s.correct).toBe(2);
  });
});

describe("pickBlitz", () => {
  it("is deterministic, prefers unseen and avoids repeating a pattern in a session", () => {
    const a = pickBlitz(STATEMENTS, 8, 42);
    expect(pickBlitz(STATEMENTS, 8, 42).map((s) => s.id)).toEqual(a.map((s) => s.id));
    expect(a).toHaveLength(8);
    expect(new Set(a.map((s) => s.patterns[0])).size).toBe(8);
    const seen = new Set(STATEMENTS.slice(0, STATEMENTS.length - 8).map((s) => s.id));
    const b = pickBlitz(STATEMENTS, 8, 1, seen);
    expect(b.every((s) => !seen.has(s.id))).toBe(true);
  });
  it("returns fewer when the pool is small and never duplicates", () => {
    const p = pickBlitz(STATEMENTS.slice(0, 3), 8, 5);
    expect(p).toHaveLength(3);
    const all = pickBlitz(STATEMENTS, STATEMENTS.length, 9);
    expect(new Set(all.map((s) => s.id)).size).toBe(STATEMENTS.length);
  });
});
