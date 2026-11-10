import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];
const BIG = 1_000_000_000;

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(1, 9), -9, 9)),
  groups: {
    basic: [t([2, -5, 3, 4, -1, 6, -8]), t([-4, -2, -9]), t([5]), (r) => t(r.ints(12, -10, 10))],
    edge: [t([0]), t([-BIG]), t([BIG, BIG, BIG]), t([-1, -1, -1]), t([-3, 0, -2]), t([BIG, -BIG, BIG]), t([-BIG, -BIG, -BIG, 1, -BIG])],
    adversarial: [
      (r) => t(r.ints(300, -1000, 1000)),
      (r) => t(r.ints(300, -BIG, -1)),
      () => t(Array.from({ length: 300 }, (_, i) => (i % 2 === 0 ? BIG : -BIG + 1))),
      (r) => t([...r.ints(100, -50, -1), ...r.ints(100, 1, 50), ...r.ints(100, -50, -1)]),
    ],
    perf: [
      (r) => t(r.ints(100000, -BIG, BIG)),
      t(Array(100000).fill(BIG)),
      t(Array(100000).fill(-BIG)),
      (r) => t(r.ints(100000, -100, 100)),
    ],
  },
};
