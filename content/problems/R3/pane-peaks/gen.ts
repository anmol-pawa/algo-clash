import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], w: number): string[] => [arr(xs), String(w)];
const vals = (r: Rng, n: number, lo: number, hi: number) => Array.from({ length: n }, () => r.int(lo, hi));
const asc = (n: number) => Array.from({ length: n }, (_, i) => i - 50000);
const desc = (n: number) => Array.from({ length: n }, (_, i) => 50000 - i);

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(1, 12);
    return t(vals(r, n, -6, 6), r.int(1, n));
  },
  groups: {
    basic: [t([2, 7, 1, 5, 3], 3), t([4, 4, 4], 2), t([-3, -8, -1], 1), t([9, 1, 2], 3), (r) => t(vals(r, 20, -50, 50), 4)],
    edge: [
      t([5], 1),
      t([-5], 1),
      t([1, 2, 3, 4, 5], 5),
      t([5, 4, 3, 2, 1], 2),
      t([1, 2, 3, 4, 5], 2),
      t([3, 3, 3, 3, 3], 3),
      t([1000000000, -1000000000, 1000000000, -1000000000], 2),
      t([-1000000000, -1000000000], 2),
      // the maximum expires exactly when the frame slides past it
      t([9, 1, 1, 1, 2, 1], 3),
    ],
    adversarial: [
      (r) => t(vals(r, 300, -5, 5), r.int(1, 8)),
      (r) => t(vals(r, 300, -1000000000, 1000000000), r.int(2, 50)),
      (r) => t(vals(r, 300, 0, 2), 17),
      t(asc(300), 7),
      t(desc(300), 7),
    ],
    perf: [
      // widest frame, random values: a rescan does about n^2 / 4 comparisons
      (r) => t(vals(r, 100000, -1000000000, 1000000000), 50000),
      // ascending: the deque collapses to one index every step
      t(asc(100000), 50000),
      // descending: the deque grows to the full width and the front expires every step
      t(desc(100000), 50000),
      (r) => t(vals(r, 100000, 0, 3), 30000),
      (r) => t(vals(r, 100000, -1000000000, 1000000000), 100000),
    ],
  },
};
