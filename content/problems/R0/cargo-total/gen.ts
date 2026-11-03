import type { GenModule } from "../../../../lib/content/native";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const BIG = 2000000000;

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 8), 0, r.int(0, 1) === 0 ? 20 : BIG))],
  groups: {
    basic: [[arr([3, 5, 2])], [arr([2000000000, 2000000000])], [arr([])], [arr([7])], (r) => [arr(r.ints(10, 0, 100))]],
    edge: [[arr([0])], [arr([0, 0, 0])], [arr([BIG])], [arr([2147483647 - 147483647, 1])], [arr([BIG, BIG, BIG])], [arr([1, BIG])]],
    adversarial: [
      (r) => [arr(r.ints(5, BIG - 5, BIG))],
      (r) => [arr(r.ints(100, 0, BIG))],
      [arr(Array(3).fill(1500000000))],
      [arr([BIG, 0, BIG, 0, BIG])],
    ],
    perf: [
      [arr(Array(100000).fill(BIG))],
      (r) => [arr(r.ints(100000, 0, BIG))],
      (r) => [arr(r.ints(100000, 0, 10))],
      (r) => [arr(r.ints(99999, BIG - 100, BIG))],
    ],
  },
};
