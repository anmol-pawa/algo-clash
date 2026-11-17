import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];
const list = (r: Rng, n: number, lo: number, hi: number) => Array.from({ length: n }, () => r.int(lo, hi));

export const gen: GenModule = {
  small: (r) => t(list(r, r.int(0, 10), 1, 4)),
  groups: {
    basic: [t([5, 9, 5, 1]), t([3, 3, 3]), t([7]), t([1, 2, 3, 4, 5]), (r) => t(list(r, 12, 1, 6))],
    edge: [t([]), t([1000000000, 1, 1000000000]), t([2, 2]), t([1, 1, 1, 1, 1, 1, 1])],
    adversarial: [(r) => t(list(r, 300, 1, 3)), t(Array.from({ length: 200 }, (_, i) => 200 - i)), t(Array.from({ length: 200 }, (_, i) => i + 1))],
    perf: [(r) => t(list(r, 100000, 1, 1000000000)), (r) => t(list(r, 100000, 1, 5)), t(new Array(100000).fill(42))],
  },
};
