/**
 * Edge-case-class coverage of the tests a player writes themselves (Interview mode, GDD §6.5).
 * A test input is one LC literal per line. Classes are derived from the parsed values, so the
 * score is computed, not hand-assigned.
 */
import { parseLc, type LcValue } from "../judge/lc";

export type EdgeClass = "empty" | "single" | "duplicates" | "negative" | "zero" | "large" | "sorted" | "unsorted" | "all-equal" | "null-gap";

export const EDGE_CLASSES: readonly { id: EdgeClass; label: string }[] = [
  { id: "empty", label: "Empty input" },
  { id: "single", label: "Single element" },
  { id: "duplicates", label: "Duplicates" },
  { id: "all-equal", label: "All equal" },
  { id: "negative", label: "Negative numbers" },
  { id: "zero", label: "Zero" },
  { id: "large", label: "Large values" },
  { id: "sorted", label: "Already sorted" },
  { id: "unsorted", label: "Unsorted / mixed order" },
  { id: "null-gap", label: "Missing node (null)" },
];

const LARGE = 1_000_000;

function numbersOf(v: LcValue, out: number[]): void {
  if (typeof v === "number") out.push(v);
  else if (Array.isArray(v)) for (const x of v) numbersOf(x, out);
}

function arraysOf(v: LcValue, out: LcValue[][]): void {
  if (Array.isArray(v)) {
    out.push(v);
    for (const x of v) arraysOf(x, out);
  }
}

function hasNull(v: LcValue): boolean {
  return v === null || (Array.isArray(v) && v.some(hasNull));
}

/** The edge classes one test input exercises. Unparseable input exercises none. */
export function classesOf(input: string): Set<EdgeClass> {
  const found = new Set<EdgeClass>();
  const args: LcValue[] = [];
  for (const line of input.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try { args.push(parseLc(t)); } catch { return new Set(); }
  }
  const lists: LcValue[][] = [];
  for (const a of args) arraysOf(a, lists);
  for (const a of args) if (typeof a === "string" && a.length === 0) found.add("empty");
  for (const l of lists) {
    if (l.length === 0) found.add("empty");
    if (l.length === 1) found.add("single");
    const nums: number[] = [];
    numbersOf(l, nums);
    if (l.every((x) => typeof x === "number") && l.length >= 2) {
      const n = l as number[];
      if (new Set(n).size < n.length) found.add("duplicates");
      if (new Set(n).size === 1) found.add("all-equal");
      if (n.every((x, i) => i === 0 || n[i - 1] <= x)) found.add("sorted");
      else found.add("unsorted");
    }
  }
  const nums: number[] = [];
  for (const a of args) numbersOf(a, nums);
  if (nums.some((x) => x < 0)) found.add("negative");
  if (nums.some((x) => x === 0)) found.add("zero");
  if (nums.some((x) => Math.abs(x) >= LARGE)) found.add("large");
  if (args.some(hasNull)) found.add("null-gap");
  return found;
}

export interface Coverage {
  covered: EdgeClass[];
  /** Classes that the problem's own hidden tests exercise but the player's did not. */
  missed: EdgeClass[];
  /** Covered / (covered + missed); 1 when the hidden tests need nothing. */
  score: number;
}

/** Scores the player's own tests against the classes the problem's reference tests exercise. */
export function coverage(ownInputs: readonly string[], referenceInputs: readonly string[]): Coverage {
  const want = new Set<EdgeClass>();
  for (const i of referenceInputs) for (const c of classesOf(i)) want.add(c);
  const have = new Set<EdgeClass>();
  for (const i of ownInputs) for (const c of classesOf(i)) have.add(c);
  const covered = EDGE_CLASSES.map((c) => c.id).filter((c) => want.has(c) && have.has(c));
  const missed = EDGE_CLASSES.map((c) => c.id).filter((c) => want.has(c) && !have.has(c));
  const total = covered.length + missed.length;
  return { covered, missed, score: total === 0 ? 1 : covered.length / total };
}
