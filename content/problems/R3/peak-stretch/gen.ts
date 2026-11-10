import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], k: number): string[] => [arr(xs), String(k)];
const rand = (r: Rng, n: number, lo: number, hi: number) => {
  const xs = r.ints(n, lo, hi);
  return t(xs, r.int(1, n));
};

export const gen: GenModule = {
  small: (r) => rand(r, r.int(1, 10), -6, 6),
  groups: {
    basic: [t([1, 4, 2, 10, 3], 2), t([-5, -2, -9], 1), t([3, -1, 3], 3), (r) => rand(r, 12, -10, 10)],
    edge: [t([7], 1), t([-7], 1), t([0, 0, 0, 0], 4), t([1000, -1000, 1000, -1000], 2), t([-1000, -1000, -1000], 2), t([5, 5, 5, 5, 5], 1)],
    adversarial: [(r) => rand(r, 300, -1000, 1000), (r) => rand(r, 300, -5, 5), (r) => t(r.ints(300, -1000, -1), r.int(1, 300)), () => t(Array.from({ length: 300 }, (_, i) => (i % 2 === 0 ? 1000 : -1000)), 151)],
    perf: [
      (r) => t(r.ints(100000, -1000, 1000), 50000),
      (r) => t(r.ints(100000, -1000, 1000), 40000),
      () => t(Array(100000).fill(1000), 50000),
      (r) => t(r.ints(100000, -1000, -1), 60000),
    ],
  },
};
