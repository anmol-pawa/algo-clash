import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(0, 9), 0, 9)),
  groups: {
    basic: [t([1, 8, 6, 2, 5, 4, 8, 3, 7]), t([1, 1]), t([4, 3, 2, 1, 4]), t([1, 2, 1]), (r) => t(r.ints(15, 0, 20))],
    edge: [t([]), t([5]), t([0, 0]), t([0, 7]), t([100000, 100000]), t([3, 0, 0, 0, 3]), t([1, 2, 3, 4, 5]), t([5, 4, 3, 2, 1])],
    adversarial: [
      (r) => t(r.ints(300, 0, 1000)),
      (r) => t(Array.from({ length: 200 }, (_, i) => 1 + i)),
      (r) => t(Array.from({ length: 200 }, (_, i) => 200 - i)),
      (r) => t([...r.ints(5, 90, 100), ...r.ints(190, 0, 50), ...r.ints(5, 90, 100)]),
    ],
    perf: [
      (r) => t(r.ints(100000, 0, 100000)),
      t(Array(100000).fill(100000)),
      t(Array.from({ length: 100000 }, (_, i) => 100000 - i)),
      (r) => t([100000, ...r.ints(99998, 0, 1000), 100000]),
      t(Array.from({ length: 100000 }, (_, i) => i + 1)),
    ],
  },
};
