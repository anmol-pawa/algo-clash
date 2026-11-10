import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], need: number): string[] => [arr(xs), String(need)];

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(0, 10), 1, 6), r.int(1, 25)),
  groups: {
    basic: [t([2, 3, 1, 2, 4, 3], 7), t([1, 1, 1], 10), t([8], 8), (r) => t(r.ints(15, 1, 9), r.int(5, 40))],
    edge: [t([], 1), t([1], 1), t([1], 2), t([1000, 1000], 2000), t([1000, 1000], 2001), t([5, 1, 1, 1, 1, 1], 5), t([1, 1, 1, 1, 9], 9)],
    adversarial: [
      (r) => t(r.ints(300, 1, 5), r.int(1, 700)),
      (r) => t(r.ints(300, 1, 1000), r.int(1, 100000)),
      () => t(Array(300).fill(1), 150),
      (r) => t(r.ints(300, 1, 3), 100000),
    ],
    perf: [
      t(Array(100000).fill(1), 1_000_000_000),
      (r) => t(r.ints(100000, 1, 1000), 50_000_000),
      t(Array(100000).fill(1), 99999),
      (r) => t(r.ints(100000, 1, 10), 400000),
    ],
  },
};
