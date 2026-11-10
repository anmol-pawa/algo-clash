import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];
const range = (lo: number, n: number) => Array.from({ length: n }, (_, i) => lo + i);

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(0, 10), -6, 6)),
  groups: {
    basic: [t([100, 4, 200, 1, 3, 2]), t([5, 5, 5]), t([9, 1, 8, 2, 7]), t([0, -1, 1]), (r) => t(r.ints(20, -15, 15))],
    edge: [t([]), t([42]), t([-1000000000, 1000000000]), t([-1000000000, -999999999, 999999999, 1000000000]), t([1, 2, 2, 3, 3, 4]), t([2, 1, 1, 2])],
    adversarial: [
      (r) => t(r.shuffle([...range(10, 50), ...range(100, 30), ...range(-40, 20)])),
      (r) => t(r.ints(400, -100, 100)),
      (r) => t(r.shuffle([...range(1, 100), ...range(1, 100)])),
    ],
    perf: [
      (r) => t(r.shuffle(range(-50000, 100000))),
      (r) => t(r.ints(100000, -1000000000, 1000000000)),
      (r) => t(r.shuffle([...range(0, 50000), ...range(60000, 50000)])),
      t(range(1, 100000)),
    ],
  },
};
