import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const sorted = (r: Rng, n: number, lo: number, hi: number) => r.ints(n, lo, hi).sort((x, y) => x - y);
const range = (n: number, start: number, step: number) => Array.from({ length: n }, (_, i) => start + i * step);

export const gen: GenModule = {
  small: (r) => {
    const span = r.pick([3, 8, 20]);
    return [arr(sorted(r, r.int(0, 7), -span, span)), arr(sorted(r, r.int(0, 7), -span, span))];
  },
  groups: {
    basic: [
      [arr([1, 3, 5]), arr([2, 4, 6])],
      [arr([1, 1]), arr([1])],
      [arr([2, 5, 9]), arr([1, 3, 4, 8, 10])],
      [arr([1, 2, 3]), arr([4, 5, 6])],
      (r) => [arr(sorted(r, 6, -20, 20)), arr(sorted(r, 7, -20, 20))],
    ],
    edge: [
      [arr([]), arr([])],
      [arr([]), arr([9])],
      [arr([9]), arr([])],
      [arr([-BIG, BIG]), arr([-BIG, 0, BIG])],
      [arr([4, 4, 4]), arr([4, 4])],
      [arr([5]), arr([1, 2, 3, 4])],
    ],
    adversarial: [
      [arr(range(500, 0, 2)), arr(range(500, 1, 2))],
      [arr(range(500, 0, 1)), arr(range(500, 500, 1))],
      [arr(range(500, 500, 1)), arr(range(500, 0, 1))],
      (r) => [arr(sorted(r, 700, 0, 5)), arr(sorted(r, 300, 0, 5))],
      (r) => [arr(sorted(r, 1, -BIG, BIG)), arr(sorted(r, 900, -BIG, BIG))],
    ],
    perf: [
      [arr(range(100000, 0, 2)), arr(range(100000, 1, 2))],
      (r) => [arr(sorted(r, 100000, -BIG, BIG)), arr(sorted(r, 100000, -BIG, BIG))],
      [arr(new Array<number>(100000).fill(1)), arr(new Array<number>(100000).fill(1))],
      [arr(range(100000, 0, 1)), arr([])],
    ],
  },
};
