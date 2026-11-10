import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], limit: number): string[] => [arr(xs), String(limit)];

export const gen: GenModule = {
  small: (r: Rng) => {
    const limit = r.int(1, 12);
    return t(r.ints(r.int(0, 8), 1, limit), limit);
  },
  groups: {
    basic: [t([1, 2], 3), t([3, 2, 2, 1], 3), t([3, 5, 3, 4], 5), t([5, 1, 4, 2], 6), (r) => t(r.ints(14, 1, 10), 10)],
    edge: [t([], 5), t([4], 4), t([4, 4], 4), t([1, 1], 2), t([2, 2, 2], 3), t([1000000000], 1000000000), t([500000000, 500000000], 1000000000), t([1, 1, 1, 1], 100)],
    adversarial: [
      (r) => t(r.ints(300, 1, 50), 50),
      (r) => t(r.ints(300, 26, 50), 50),
      (r) => t(r.ints(300, 1, 25), 50),
      (r) => t(r.ints(300, 1, 50), 100),
      (r) => t([...r.ints(100, 1, 10), ...r.ints(100, 40, 50)], 50),
    ],
    perf: [
      (r) => t(r.ints(100000, 1, 1000000000), 1000000000),
      (r) => t(r.ints(100000, 500000001, 1000000000), 1000000000),
      (r) => t(r.ints(100000, 1, 500000000), 1000000000),
      (r) => t(r.shuffle([...r.ints(50000, 1, 100), ...r.ints(50000, 999999900, 1000000000)]), 1000000000),
    ],
  },
};
