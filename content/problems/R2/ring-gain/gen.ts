import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];
const BIG = 1_000_000_000;

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(1, 9), -9, 9)),
  groups: {
    basic: [t([5, -3, 5]), t([1, -2, 3, -2]), t([-3, -2, -3]), (r) => t(r.ints(12, -10, 10))],
    edge: [t([0]), t([-BIG]), t([BIG]), t([BIG, BIG, BIG]), t([-1, -1, -1]), t([4, -9, 4]), t([-BIG, BIG, -BIG]), t([3, -1, 2, -1]), t([0, 0, 0])],
    adversarial: [
      (r) => t(r.ints(300, -1000, 1000)),
      (r) => t(r.ints(300, -BIG, -1)),
      (r) => t([...r.ints(100, 1, 50), ...r.ints(100, -50, -1), ...r.ints(100, 1, 50)]),
      () => t(Array.from({ length: 300 }, (_, i) => (i % 2 === 0 ? BIG : -BIG))),
    ],
    perf: [
      (r) => t(r.ints(100000, -BIG, BIG)),
      t(Array(100000).fill(BIG)),
      t(Array(100000).fill(-BIG)),
      (r) => t([...r.ints(40000, 1, 1000), ...r.ints(20000, -1000, -1), ...r.ints(40000, 1, 1000)]),
    ],
  },
};
