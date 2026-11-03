import type { GenModule } from "../../../../lib/content/native";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], limit: number | string): string[] => [arr(xs), String(limit)];
const BIG = 1000000000;

export const gen: GenModule = {
  small: (r) => t(r.ints(r.int(0, 8), -5, 10), r.int(1, 30)),
  groups: {
    basic: [t([4, -3, 5, 2], 9), t([1, 1], 5), t([7], 7), t([], 1), (r) => t(r.ints(10, -10, 20), r.int(1, 60))],
    edge: [
      t([0], 1),
      t([0, 0, 5], 5),
      t([-1, -1, -1], 1),
      t([5, -100, 5], 10),
      t([-5, 3], 3),
      t([BIG], BIG),
      t([BIG], BIG + 1),
      t([BIG, BIG, BIG], 3 * BIG),
      t([BIG, BIG, BIG], 3 * BIG + 1),
    ],
    adversarial: [
      t([BIG, BIG, BIG], 2147483648),
      t([BIG, -BIG, BIG, BIG], 2 * BIG),
      t([2000, 2000, 2000].map((x) => x * 1000000), 6000000000),
      (r) => t(r.ints(50, -BIG, BIG), r.int(1, 10 * BIG)),
      (r) => t(r.ints(50, 0, BIG), r.int(1, 25 * BIG)),
      (r) => t(r.ints(20, -3, 3), r.int(1, 8)),
    ],
    perf: [
      t(Array(100000).fill(BIG), 100000000000000),
      t(Array(100000).fill(BIG), 99999999999999),
      t(Array(100000).fill(-BIG), 1),
      (r) => t(r.ints(100000, -BIG, BIG), 40000000000000),
    ],
  },
};
