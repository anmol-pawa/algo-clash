/**
 * Edge-case classes for "write your own tests" (Interview and Contest, GDD §6.5).
 * Each test input is one LC literal per line (see `encodeInput`). A class is *applicable* when at least one of the
 * problem's hidden tests exhibits it, so a class the constraints rule out (say, an empty array when n >= 1) never
 * penalises the player. The score is the share of applicable classes the player's own tests covered.
 */
import { parseLc, type LcValue } from "@/lib/judge/lc";

export type EdgeClass = "empty" | "single" | "duplicates" | "all-equal" | "zero" | "negative" | "extreme";

export const EDGE_CLASSES: readonly EdgeClass[] = ["empty", "single", "duplicates", "all-equal", "zero", "negative", "extreme"];

export const EDGE_LABELS: Readonly<Record<EdgeClass, string>> = {
  empty: "Empty input", single: "A single element", duplicates: "Repeated values", "all-equal": "All elements equal",
  zero: "Zero", negative: "Negative numbers", extreme: "Values near the limits (|x| >= 10^9)",
};

const EXTREME = 1e9;

function flatten(v: LcValue, out: LcValue[]): void {
  if (Array.isArray(v)) for (const x of v) flatten(x, out);
  else out.push(v);
}

/** Linear sequences to inspect: every top-level array, every string, and every row of a 2-D array. */
function sequences(v: LcValue, out: LcValue[][]): void {
  if (typeof v === "string") out.push([...v]);
  else if (Array.isArray(v)) {
    out.push(v);
    for (const x of v) if (Array.isArray(x)) sequences(x, out);
  }
}

function parseArgs(input: string): LcValue[] {
  const args: LcValue[] = [];
  for (const line of input.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try { args.push(parseLc(t)); } catch { /* an unparsable line classifies as nothing */ }
  }
  return args;
}

/** Which classes one test input exhibits. */
export function classifyInput(input: string): Set<EdgeClass> {
  const found = new Set<EdgeClass>();
  const args = parseArgs(input);
  const seqs: LcValue[][] = [];
  const scalars: LcValue[] = [];
  for (const a of args) { sequences(a, seqs); flatten(a, scalars); }
  for (const s of seqs) {
    if (s.length === 0) found.add("empty");
    if (s.length === 1) found.add("single");
    if (s.length >= 2) {
      const keys = s.map((x) => JSON.stringify(x));
      if (new Set(keys).size < keys.length) found.add("duplicates");
      if (new Set(keys).size === 1) found.add("all-equal");
    }
  }
  for (const x of scalars) {
    if (typeof x !== "number") continue;
    if (x === 0) found.add("zero");
    if (x < 0) found.add("negative");
    if (Math.abs(x) >= EXTREME) found.add("extreme");
  }
  return found;
}

export interface EdgeCoverage {
  applicable: EdgeClass[];
  covered: EdgeClass[];
  missing: EdgeClass[];
  /** covered / applicable, 1 when nothing is applicable. */
  score: number;
}

/** Score the player's own test inputs against the classes the hidden tests exercise. */
export function scoreOwnTests(ownInputs: readonly string[], hiddenInputs: readonly string[]): EdgeCoverage {
  const hidden = new Set<EdgeClass>();
  for (const h of hiddenInputs) for (const c of classifyInput(h)) hidden.add(c);
  const own = new Set<EdgeClass>();
  for (const o of ownInputs) for (const c of classifyInput(o)) own.add(c);
  const applicable = EDGE_CLASSES.filter((c) => hidden.has(c));
  const covered = applicable.filter((c) => own.has(c));
  const missing = applicable.filter((c) => !own.has(c));
  return { applicable, covered, missing, score: applicable.length === 0 ? 1 : covered.length / applicable.length };
}
