import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], k: number): string[] => [arr(xs), String(k)];
const distinct = (n: number, base = 0) => Array.from({ length: n }, (_, i) => base + i);

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(0, 10), 0, 5), r.int(1, 6)),
  groups: {
    basic: [t([4, 9, 4], 2), t([4, 9, 4], 1), t([1, 2, 3], 5), t([1, 0, 1, 1], 1), (r) => t(r.ints(20, 0, 30), r.int(1, 5))],
    edge: [t([], 3), t([7], 1), t([7, 7], 1), t([-1000000000, 5, -1000000000], 2), t([1, 2, 1, 2], 2), t([1, 2, 1, 2], 1)],
    adversarial: [
      (r) => t(r.ints(300, 0, 400), r.int(1, 20)),
      t([...distinct(100), 0], 100),
      t([...distinct(100), 0], 99),
    ],
    perf: [
      t([...distinct(100000 - 1), 0], 100000),
      t([...distinct(100000 - 1), 0], 99997),
      (r) => t(r.ints(100000, -1000000000, 1000000000), 1000),
    ],
  },
};
