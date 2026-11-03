import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const L = (a: number[]) => `[${a.join(",")}]`;
const t = (a: number[]): string[] => [L(a)];
const vals = (r: Rng, n: number, lo = -9, hi = 9) => r.ints(n, lo, hi);

export const gen: GenModule = {
  small: (r) => t(vals(r, r.int(0, 8))),
  groups: {
    basic: [t([3, -1, 4]), t([-5, -2, 7]), t([-1, -2]), t([]), (r) => t(vals(r, 10))],
    edge: [t([0]), t([-1]), t([1]), t([0, -1, 0, -1, 0]), t([-1, -1, -1, 5, -1, -1])],
    adversarial: [(r) => t(vals(r, 200, -1000, 1000)), t(Array.from({ length: 100 }, (_, i) => (i % 2 ? -1 : 1))), t([...Array(50).fill(-3), 8, ...Array(50).fill(-3)])],
    perf: [(r) => t(vals(r, 100000, -1000, 1000)), t(Array(100000).fill(-1)), t(Array(100000).fill(1))],
  },
};
