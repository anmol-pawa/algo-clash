import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], budget: number): string[] => [arr(xs), String(budget)];
const bits = (r: Rng, n: number, pOne: number) => Array.from({ length: n }, () => (r.int(0, 99) < pOne ? 1 : 0));

export const gen: GenModule = {
  small: (r: Rng) => t(bits(r, r.int(0, 12), 50), r.int(0, 4)),
  groups: {
    basic: [t([1, 1, 0, 0, 1, 1, 1, 0, 1], 2), t([0, 0, 0], 0), t([1, 0, 1], 1), (r) => t(bits(r, 20, 60), 3)],
    edge: [t([], 0), t([], 5), t([0], 0), t([0], 1), t([1], 0), t([1, 1, 1], 0), t([0, 0, 0, 0], 2), t([0, 0, 0, 0], 9), t([1, 0, 0, 1, 0, 1], 1)],
    adversarial: [(r) => t(bits(r, 300, 50), r.int(0, 20)), (r) => t(bits(r, 300, 80), r.int(0, 5)), (r) => t(bits(r, 300, 20), r.int(0, 50)), () => t(Array.from({ length: 300 }, (_, i) => i % 2), 7)],
    perf: [
      t(Array(100000).fill(1), 100000),
      (r) => t(bits(r, 100000, 50), 100000),
      (r) => t(bits(r, 100000, 70), 5000),
      t(Array(100000).fill(0), 50000),
    ],
  },
};
