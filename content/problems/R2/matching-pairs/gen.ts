import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], target: number): string[] => [arr(xs), String(target)];
const rnd = (r: Rng, n: number, lo: number, hi: number) => r.ints(n, lo, hi);

export const gen: GenModule = {
  small: (r) => t(rnd(r, r.int(0, 10), -4, 4), r.int(-6, 6)),
  groups: {
    basic: [t([1, 4, 2, 3], 5), t([2, 2, 2], 4), t([7], 7), t([3, 1, 4, 1, 5], 6), (r) => t(rnd(r, 20, -10, 10), r.int(-8, 8))],
    edge: [t([], 0), t([0, 0], 0), t([5, 5], 10), t([-3, 3, -3, 3], 0), t([1000000, 1000000], 2000000), t([-1000000, -1000000, 1000000], 0)],
    adversarial: [
      (r) => t(rnd(r, 300, -3, 3), r.int(-4, 4)),
      t(Array.from({ length: 200 }, () => 4), 8),
      (r) => t(rnd(r, 500, -1000000, 1000000), 0),
    ],
    perf: [
      t(Array.from({ length: 100000 }, () => 0), 0),
      (r) => t(rnd(r, 100000, -1000000, 1000000), r.int(-1000, 1000)),
      (r) => t(rnd(r, 100000, -50, 50), 10),
    ],
  },
};
