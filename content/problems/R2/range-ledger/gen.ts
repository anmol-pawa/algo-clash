import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const qs = (ps: number[][]) => `[${ps.map((p) => `[${p[0]},${p[1]}]`).join(",")}]`;
const t = (xs: number[], ps: number[][]): string[] => [arr(xs), qs(ps)];
const BIG = 1_000_000_000;

/** `q` random in-range queries over an array of length n. */
const randomQueries = (r: Rng, n: number, q: number): number[][] =>
  Array.from({ length: q }, () => {
    const a = r.int(0, n - 1);
    const b = r.int(0, n - 1);
    return [Math.min(a, b), Math.max(a, b)];
  });

const make = (r: Rng, n: number, q: number, lo: number, hi: number) => t(r.ints(n, lo, hi), randomQueries(r, n, q));

export const gen: GenModule = {
  small: (r: Rng) => make(r, r.int(1, 9), r.int(0, 6), -9, 9),
  groups: {
    basic: [
      t([3, -1, 4, 1, 5], [[0, 4], [1, 2], [3, 3]]),
      t([7], [[0, 0]]),
      t([2, 2, 2], []),
      (r) => make(r, 10, 5, -20, 20),
    ],
    edge: [
      t([0], [[0, 0]]),
      t([-BIG], [[0, 0], [0, 0]]),
      t([BIG, BIG, BIG], [[0, 2], [1, 2]]),
      t([-5, -5, -5, -5], [[0, 3], [0, 0], [3, 3], [1, 2]]),
      t([1, 2, 3, 4], []),
    ],
    adversarial: [
      (r) => make(r, 200, 200, -1000, 1000),
      (r) => t(Array(300).fill(BIG), randomQueries(r, 300, 300)),
      (r) => t(Array.from({ length: 300 }, (_, i) => (i % 2 === 0 ? BIG : -BIG)), randomQueries(r, 300, 300)),
    ],
    perf: [
      (r) => make(r, 100000, 100000, -BIG, BIG),
      () => t(Array(100000).fill(BIG), Array.from({ length: 100000 }, () => [0, 99999])),
      (r) => t(r.ints(100000, -BIG, BIG), Array.from({ length: 100000 }, () => [r.int(0, 10), r.int(99980, 99999)])),
    ],
  },
};
