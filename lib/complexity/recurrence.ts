/**
 * Recurrence solver (CURRICULUM R1). Solves T(n) = a·T(n/b) + Θ(n^c · log^k n) with the Master theorem
 * (extended for the log factor), and checks any such claim numerically by evaluating the recurrence.
 */

export interface Recurrence {
  /** Number of subproblems, a ≥ 1. */
  a: number;
  /** Shrink factor, b > 1. */
  b: number;
  /** Combine cost is Θ(n^c · (log n)^k). */
  c: number;
  k?: number;
}

export interface Solution {
  /** Θ-class exponent of n, and of log n. */
  nExp: number;
  logExp: number;
  /** Which master-theorem case applied (1: leaves dominate, 2: balanced, 3: root dominates). */
  case: 1 | 2 | 3;
  /** Human-readable Θ(...). */
  theta: string;
}

const EPS = 1e-9;

export function formatTheta(nExp: number, logExp: number): string {
  const num = (x: number) => (Math.abs(x - Math.round(x)) < EPS ? String(Math.round(x)) : x.toFixed(3).replace(/0+$/, ""));
  const parts: string[] = [];
  if (Math.abs(nExp) > EPS) parts.push(Math.abs(nExp - 1) < EPS ? "n" : `n^${num(nExp)}`);
  if (Math.abs(logExp) > EPS) parts.push(Math.abs(logExp - 1) < EPS ? "log n" : `log^${num(logExp)} n`);
  return `Θ(${parts.length ? parts.join(" ") : "1"})`;
}

export function solve(r: Recurrence): Solution {
  const k = r.k ?? 0;
  if (!(r.a >= 1) || !(r.b > 1) || r.c < 0 || k < 0) throw new RangeError("need a ≥ 1, b > 1, c ≥ 0, k ≥ 0");
  const crit = Math.log(r.a) / Math.log(r.b); // log_b a
  let nExp: number, logExp: number, cs: 1 | 2 | 3;
  if (Math.abs(r.c - crit) < EPS) { nExp = r.c; logExp = k + 1; cs = 2; }
  else if (r.c < crit) { nExp = crit; logExp = 0; cs = 1; }
  else { nExp = r.c; logExp = k; cs = 3; }
  return { nExp, logExp, case: cs, theta: formatTheta(nExp, logExp) };
}

/** Evaluate T(n) exactly for n a power of b (T(1) = 1, combine cost n^c·log2(n)^k with log2(1) treated as 1). */
export function evaluate(r: Recurrence, n: number): number {
  const k = r.k ?? 0;
  const memo = new Map<number, number>();
  const go = (m: number): number => {
    if (m <= 1) return 1;
    const hit = memo.get(m);
    if (hit !== undefined) return hit;
    const v = r.a * go(m / r.b) + m ** r.c * Math.log2(m) ** k;
    memo.set(m, v);
    return v;
  };
  return go(n);
}

/**
 * Numeric sanity check of a closed form: T(n) / (n^nExp · log^logExp n) must settle to a constant,
 * so the ratio at b^(2L) and b^L must be within `tol` of each other for large L.
 */
export function ratioSettles(r: Recurrence, s: Solution, level = 24, tol = 0.15): boolean {
  const ratio = (L: number) => {
    const n = r.b ** L;
    return evaluate(r, n) / (n ** s.nExp * Math.log2(n) ** s.logExp);
  };
  const lo = ratio(level / 2), hi = ratio(level);
  return Math.abs(hi - lo) / hi <= tol;
}

/** Closed-form helpers for the commonly taught shapes (used for card generation). */
export const KNOWN: { name: string; rec: Recurrence; where: string }[] = [
  { name: "T(n) = T(n/2) + 1", rec: { a: 1, b: 2, c: 0 }, where: "binary search" },
  { name: "T(n) = 2T(n/2) + n", rec: { a: 2, b: 2, c: 1 }, where: "merge sort" },
  { name: "T(n) = 2T(n/2) + 1", rec: { a: 2, b: 2, c: 0 }, where: "tree traversal / build a heap top-down" },
  { name: "T(n) = T(n/2) + n", rec: { a: 1, b: 2, c: 1 }, where: "quickselect with perfect pivots" },
  { name: "T(n) = 4T(n/2) + n", rec: { a: 4, b: 2, c: 1 }, where: "naive polynomial multiply by splitting" },
  { name: "T(n) = 3T(n/2) + n", rec: { a: 3, b: 2, c: 1 }, where: "Karatsuba" },
];
