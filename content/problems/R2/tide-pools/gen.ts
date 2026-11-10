import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(0, 12), 0, 6)),
  groups: {
    basic: [t([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), t([4, 2, 0, 3, 2, 5]), t([3, 0, 2]), t([2, 0, 2]), (r) => t(r.ints(20, 0, 8))],
    edge: [t([]), t([5]), t([1, 2]), t([0, 0, 0]), t([3, 3, 3]), t([5, 4, 3, 2, 1]), t([1, 2, 3, 4, 5]), t([5, 0, 5]), t([100000, 0, 100000]), t([2, 0, 0, 0, 1])],
    adversarial: [
      (r) => t(r.ints(300, 0, 50)),
      (r) => t(Array.from({ length: 101 }, (_, i) => Math.abs(50 - i))),
      (r) => t([3, ...Array(200).fill(0), 2, ...Array(200).fill(0), 5, 1, 0, 1, 0, 1]),
      (r) => t([...r.ints(100, 0, 20), 30, ...r.ints(100, 0, 20)]),
      (r) => t(Array.from({ length: 200 }, (_, i) => (i % 2 === 0 ? 10 : 0))),
    ],
    perf: [
      (r) => t([100000, ...Array(99998).fill(0), 100000]),
      (r) => t(r.ints(100000, 0, 100000)),
      (r) => t([100000, ...r.ints(99998, 0, 10), 100000]),
      t(Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 100000 : 0))),
      (r) => t(Array.from({ length: 100000 }, (_, i) => Math.abs(50000 - i) + r.int(0, 3))),
    ],
  },
};
