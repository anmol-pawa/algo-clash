import type { GenModule } from "../../../../lib/content/native";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const BIG = 2000000000;

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 8), 0, r.int(0, 1) === 0 ? 10 : BIG)), String(r.int(0, r.int(0, 1) === 0 ? 10 : BIG))],
  groups: {
    basic: [
      [arr([5, 1, 7, 3]), "4"],
      [arr([BIG, BIG]), "1"],
      [arr([1, 2, 3]), "10"],
      [arr([]), "0"],
      (r) => [arr(r.ints(10, 0, 100)), String(r.int(0, 100))],
    ],
    edge: [
      [arr([0]), "0"],
      [arr([0, 0, 0]), "1"],
      [arr([4, 4, 4]), "4"],
      [arr([BIG]), String(BIG)],
      [arr([BIG, BIG, BIG]), "0"],
      [arr([3, 9, 3, 9]), "9"],
      [arr([7]), "8"],
    ],
    adversarial: [
      (r) => [arr(r.ints(5, BIG - 5, BIG)), String(BIG - 3)],
      (r) => [arr(r.ints(100, 0, BIG)), String(r.int(0, BIG))],
      [arr(Array(3).fill(1500000000)), "1500000000"],
      [arr([BIG, 0, BIG, 0, BIG]), "1"],
      [arr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), "10"],
    ],
    perf: [
      [arr(Array(100000).fill(BIG)), String(BIG)],
      (r) => [arr(r.ints(100000, 0, BIG)), String(r.int(0, BIG))],
      (r) => [arr(r.ints(100000, 0, 10)), "5"],
      (r) => [arr(r.ints(99999, BIG - 100, BIG)), String(BIG - 50)],
    ],
  },
};
