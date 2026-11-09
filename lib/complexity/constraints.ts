/** Constraint → complexity table (CURRICULUM R1). Pure; used by Scout School cards and the statement panel hints. */

export interface BudgetRow {
  /** Inclusive upper bound on n for this row. */
  maxN: number;
  /** Largest complexity class that still fits, as shown to the player. */
  fits: string;
  /** Typical patterns that live at this size. */
  patterns: string;
}

/** Ordered by maxN ascending. Assumes ~10^8 simple operations per second natively and a 1-2 s limit. */
export const BUDGET_TABLE: BudgetRow[] = [
  { maxN: 10, fits: "O(n!)", patterns: "permutations, brute-force search" },
  { maxN: 20, fits: "O(2^n)", patterns: "subsets, bitmask DP, meet in the middle" },
  { maxN: 500, fits: "O(n^3)", patterns: "triple loops, Floyd–Warshall, interval DP" },
  { maxN: 5000, fits: "O(n^2)", patterns: "pair loops, 2-D DP" },
  { maxN: 1_000_000, fits: "O(n log n)", patterns: "sorting, heaps, binary search per element, segment trees" },
  { maxN: 100_000_000, fits: "O(n)", patterns: "one pass, prefix sums, two pointers, sieve" },
  { maxN: Infinity, fits: "O(log n) or O(1)", patterns: "binary search, closed-form maths" },
];

/** The row whose class is the slowest one that fits for input size `n` (n ≥ 1). */
export function budgetFor(n: number): BudgetRow {
  if (!(n >= 1)) throw new RangeError("n must be at least 1");
  return BUDGET_TABLE.find((r) => n <= r.maxN) as BudgetRow;
}

export type Growth = "1" | "log n" | "n" | "n log n" | "n^2" | "n^3" | "2^n" | "n!";

/** Operation count of a growth class at size n, as a double (Infinity when it overflows). */
export function opCount(g: Growth, n: number): number {
  switch (g) {
    case "1": return 1;
    case "log n": return Math.log2(Math.max(n, 2));
    case "n": return n;
    case "n log n": return n * Math.log2(Math.max(n, 2));
    case "n^2": return n * n;
    case "n^3": return n * n * n;
    case "2^n": return 2 ** n;
    case "n!": { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }
  }
}

export const OPS_PER_SECOND = 1e8;

/** Does a growth class finish within `seconds` (typical limit 1-2 s; 500³ is 1.25e8, a tight but accepted fit) at size n? */
export function fits(g: Growth, n: number, seconds = 2): boolean {
  return opCount(g, n) <= OPS_PER_SECOND * seconds;
}
