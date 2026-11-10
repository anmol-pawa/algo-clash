import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;
const range = (n: number, from: number) => Array.from({ length: n }, (_, i) => from + i);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 10), -4, r.pick([4, 8, 14])))],
  groups: {
    basic: [[arr([100, 4, 200, 1, 3, 2])], [arr([9, 1, 4, 7, 3, 2, 8, 0, 6, 5])], [arr([5, 5, 5])], [arr([10, 30, 20])], (r) => [arr(r.ints(14, 0, 18))]],
    edge: [[arr([])], [arr([42])], [arr([-1000000000, 1000000000])], [arr([999999999, 1000000000])], [arr([-1000000000, -999999999, -999999998])], [arr([1, 2, 0, 1])]],
    adversarial: [
      [arr(range(600, 5).reverse())],
      [arr([...range(300, 0), ...range(300, 1000), ...range(299, 5000)])],
      (r) => [arr(r.ints(600, -50, 50))],
      [arr(range(600, 0).flatMap((x) => [x, x]))],
    ],
    perf: [
      [arr(range(100000, -50000))],
      [arr(range(100000, 0).reverse())],
      (r) => [arr(r.ints(100000, -1000000000, 1000000000))],
      (r) => [arr(r.ints(100000, 0, 150000))],
    ],
  },
};
