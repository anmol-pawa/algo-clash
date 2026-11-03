import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];
const list = (r: Rng, n: number, lo: number, hi: number) => Array.from({ length: n }, () => r.int(lo, hi));
const BIG = 1000000000;

export const gen: GenModule = {
  small: (r) => t(list(r, r.int(0, 8), -5, 5)),
  groups: {
    basic: [t([1, 2, 3, 4]), t([7, 8]), t([5]), t([1, 2, 3]), (r) => t(list(r, 10, -9, 9))],
    edge: [t([]), t([-BIG, BIG]), t([0, 0, 0]), t([BIG])],
    adversarial: [(r) => t(list(r, 301, -BIG, BIG)), t(Array.from({ length: 200 }, (_, i) => i)), t(new Array(150).fill(3))],
    perf: [(r) => t(list(r, 100000, -BIG, BIG)), t(Array.from({ length: 100000 }, (_, i) => i)), t(new Array(100000).fill(1))],
  },
};
