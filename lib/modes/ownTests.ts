/**
 * "Write your own tests" (Interview and Contest, GDD §6.5): classify the inputs the player wrote into
 * edge-case classes and score them against the classes the problem's own hidden tests exercise.
 * Inputs use the judge format: one LeetCode literal per line, one line per parameter.
 */
import { parseLc, type LcValue } from "../judge/lc";

export const EDGE_CLASSES = ["empty", "single", "duplicates", "negative", "zero", "extreme", "large"] as const;
export type EdgeClass = (typeof EDGE_CLASSES)[number];

export const EDGE_LABELS: Readonly<Record<EdgeClass, string>> = {
  empty: "an empty array or string",
  single: "a single element",
  duplicates: "repeated values",
  negative: "a negative number",
  zero: "zero",
  extreme: "a value near the int limits",
  large: "a large input (100+ elements)",
};

const EXTREME = 1_000_000_000;
const LARGE_LEN = 100;

function walk(v: LcValue, out: Set<EdgeClass>): void {
  if (typeof v === "number") {
    if (v < 0) out.add("negative");
    if (v === 0) out.add("zero");
    if (Math.abs(v) >= EXTREME) out.add("extreme");
    return;
  }
  if (typeof v === "string") {
    if (v.length === 0) out.add("empty");
    if (v.length === 1) out.add("single");
    if (new Set(v).size < v.length) out.add("duplicates");
    if (v.length >= LARGE_LEN) out.add("large");
    return;
  }
  if (Array.isArray(v)) {
    if (v.length === 0) out.add("empty");
    if (v.length === 1) out.add("single");
    if (v.length >= LARGE_LEN) out.add("large");
    const scalars = v.filter((x) => x === null || typeof x !== "object");
    if (scalars.length > 1 && new Set(scalars).size < scalars.length) out.add("duplicates");
    for (const x of v) walk(x, out);
  }
}

/** The edge classes one test input exercises. Unparseable lines are ignored (the judge reports them). */
export function classifyInput(input: string): Set<EdgeClass> {
  const out = new Set<EdgeClass>();
  for (const line of input.split("\n")) {
    if (!line.trim()) continue;
    try { walk(parseLc(line.trim()), out); } catch { /* not an LC literal */ }
  }
  return out;
}

export function classesOf(inputs: readonly string[]): Set<EdgeClass> {
  const out = new Set<EdgeClass>();
  for (const i of inputs) for (const c of classifyInput(i)) out.add(c);
  return out;
}

export interface CoverageReport {
  /** Classes the problem's hidden tests exercise: what a good tester should think of. */
  expected: EdgeClass[];
  covered: EdgeClass[];
  missing: EdgeClass[];
  /** 0..1; 1 when the problem has no edge classes. */
  score: number;
  /** Own tests needed before Submit unlocks (see `ownTestsGate`). */
  passes: boolean;
}

/** Minimum share of the expected classes, and a floor on the number of tests. */
export const COVERAGE_PASS = 0.5;
export const MIN_OWN_TESTS = 2;

/** Scores the player's own test inputs against the classes present in the problem's hidden tests. */
export function coverage(own: readonly string[], hidden: readonly string[]): CoverageReport {
  const expected = [...classesOf(hidden)].sort((a, b) => EDGE_CLASSES.indexOf(a) - EDGE_CLASSES.indexOf(b));
  const have = classesOf(own);
  const covered = expected.filter((c) => have.has(c));
  const missing = expected.filter((c) => !have.has(c));
  const score = expected.length === 0 ? 1 : covered.length / expected.length;
  const valid = own.filter((i) => i.trim().length > 0).length;
  return { expected, covered, missing, score, passes: valid >= MIN_OWN_TESTS && score >= COVERAGE_PASS };
}

/** Nudge shown when the gate refuses: names the missing classes without giving a test away. */
export function coverageNudge(r: CoverageReport, ownCount: number): string {
  if (ownCount < MIN_OWN_TESTS) return `Write at least ${MIN_OWN_TESTS} tests of your own first.`;
  if (r.passes) return "Good coverage. Submit when ready.";
  return `Think about ${r.missing.slice(0, 2).map((c) => EDGE_LABELS[c]).join(" and ")}.`;
}
