import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const t = (xs: number[], k: number): string[] => [`[${xs.join(",")}]`, String(k)];

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(0, 12), -3, 3), r.int(0, 4)),
  groups: {
    basic: [t([1, 2, 1, 3, 3, 2], 2), t([7, 7, 7], 1), t([4, 5], 0), (r) => t(r.ints(15, 1, 4), 2)],
    edge: [t([], 0), t([], 3), t([5], 1), t([5], 0), t([1, 2, 3], 5), t([1, 2, 3], 3), t([1, 2, 3], 1), t([-1000000000, 1000000000, -1000000000], 2), t([0, 0, 0, 0], 1)],
    adversarial: [
      (r) => t(r.ints(300, 0, 5), 3),
      (r) => t(r.ints(300, -1000000000, 1000000000), 2),
      () => t(Array.from({ length: 300 }, (_, i) => i % 7), 4),
      (r) => t([...r.ints(100, 1, 2), ...r.ints(100, 3, 4), ...r.ints(100, 1, 2)], 2),
    ],
    perf: [
      (r) => t(r.ints(100000, 0, 10), 5),
      (r) => t(Array.from({ length: 100000 }, (_, i) => i), 50000),
      t(Array(100000).fill(9), 1),
      (r) => t(r.ints(100000, -1000000000, 1000000000), 1000),
      (r) => t(Array.from({ length: 100000 }, (_, i) => i % 1000), 999),
    ],
  },
};
