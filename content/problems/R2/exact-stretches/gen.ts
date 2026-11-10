import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], target: number): string[] => [arr(xs), String(target)];
const BIG = 1_000_000_000;

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(0, 10), -4, 4), r.int(-6, 6)),
  groups: {
    basic: [t([1, 2, 3], 3), t([1, -1, 1, -1], 0), t([0, 0, 0], 0), (r) => t(r.ints(12, -5, 5), r.int(-5, 5))],
    edge: [t([], 0), t([5], 5), t([5], 4), t([-7], -7), t([1000, 1000], BIG), t([-1000, -1000], -BIG), t([2, 2, 2, 2], 4), t([0], 0), t([3, -3, 3, -3, 3], 3)],
    adversarial: [
      (r) => t(r.ints(300, -3, 3), r.int(-3, 3)),
      t(Array(300).fill(0), 0),
      (r) => t(r.ints(300, 1, 5), 20),
      () => t(Array.from({ length: 300 }, (_, i) => (i % 2 === 0 ? 7 : -7)), 7),
    ],
    perf: [
      t(Array(100000).fill(0), 0),
      (r) => t(r.ints(100000, -1000, 1000), 0),
      (r) => t(r.ints(100000, -2, 2), 1),
      t(Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 1 : -1)), 0),
    ],
  },
};
