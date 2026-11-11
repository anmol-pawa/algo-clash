import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const wall = (rows: number[][]): string[] => [`[${rows.map((row) => `[${row.join(",")}]`).join(",")}]`];
/** Widths of one row whose interior boundaries are `cuts` (strictly increasing, inside (0, total)). */
const rowFromCuts = (cuts: number[], total: number): number[] => {
  const pts = [0, ...cuts, total];
  return pts.slice(1).map((p, i) => p - pts[i]);
};
const uniqSorted = (xs: number[]) => [...new Set(xs)].sort((a, b) => a - b);
/** `rows` rows over total width `total`; each interior boundary is drawn from `pool` with probability p. */
const randomWall = (r: Rng, rows: number, total: number, pool: number[], p: number): number[][] =>
  Array.from({ length: rows }, () => rowFromCuts(uniqSorted(pool.filter(() => r.next() < p)), total));
const poolOf = (r: Rng, total: number, size: number) => uniqSorted(Array.from({ length: size }, () => r.int(1, total - 1)));

export const gen: GenModule = {
  small: (r) => {
    const total = r.int(1, 8);
    const pool = total > 1 ? poolOf(r, total, r.int(1, 4)) : [];
    return wall(randomWall(r, r.int(1, 6), total, pool, 0.6));
  },
  groups: {
    basic: [
      wall([[1, 2, 2, 1], [3, 1, 2], [1, 3, 2], [2, 4], [3, 1, 2], [1, 3, 1, 1]]),
      wall([[1], [1], [1]]),
      wall([[2, 2], [1, 3]]),
      (r) => wall(randomWall(r, 8, 12, poolOf(r, 12, 5), 0.6)),
    ],
    edge: [
      // Edges 500000000 and 4794967296 differ by exactly 2^32, so a 32-bit prefix sum confuses them.
      wall([[500000000, 1000000000, 1000000000, 1000000000, 1000000000, 500000000], [1000000000, 1000000000, 1000000000, 1000000000, 794967296, 205032704]]),
      wall([[5]]),
      wall([[1, 1]]),
      wall([[1000000000], [1000000000]]),
      wall([[1, 1], [1, 1], [2]]),
      wall([[3], [1, 2], [2, 1]]),
      wall([[1, 2], [2, 1]]),
      wall([[1000000000, 1000000000, 1000000000], [1000000000, 2000000000], [3000000000 > 2147483647 ? 1000000000 : 1, 1000000000, 1000000000]]),
    ],
    adversarial: [
      (r) => wall(randomWall(r, 200, 60, poolOf(r, 60, 25), 0.5)),
      (r) => wall(randomWall(r, 100, 1000, poolOf(r, 1000, 200), 0.3)),
      (r) => wall(Array.from({ length: 150 }, () => [1, 1, 1, 1])),
      // Boundaries beyond 2^31: rows built from large widths that sum to the same total.
      (r) => {
        const big = [1000000000, 1000000000, 1000000000, 1000000000];
        return wall(Array.from({ length: 60 }, () => {
          const cuts = uniqSorted([1000000000, 2000000000, 3000000000].filter(() => r.next() < 0.7));
          return rowFromCuts(cuts, big.reduce((a, b) => a + b, 0) - 0);
        }));
      },
    ],
    perf: [
      (r) => wall(randomWall(r, 1000, 1_000_000_000, poolOf(r, 1_000_000_000, 40), 0.5)),
      (r) => wall(Array.from({ length: 10000 }, () => [1, 1])),
      (r) => wall([Array.from({ length: 20000 }, () => 1)]),
      (r) => wall(Array.from({ length: 4000 }, () => rowFromCuts(uniqSorted(Array.from({ length: 4 }, () => r.int(1, 1_000_000_000 - 1))), 1_000_000_000))),
      (r) => wall(Array.from({ length: 2000 }, () => rowFromCuts(uniqSorted(Array.from({ length: 9 }, () => r.int(1, 1_000_000_000 - 1))), 1_000_000_000))),
    ],
  },
};
