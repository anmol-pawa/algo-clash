import type { GenModule } from "../../../../../lib/content/native";

const nums = (a: number[]) => `[${a.join(",")}]`;

export const gen: GenModule = {
  small: (r) => [nums(r.ints(r.int(0, 8), -4, 4)), String(r.int(-6, 6))],
  groups: {
    basic: [[nums([1, 2, 3, 4]), "5"], [nums([2, 2, 2]), "4"], (r) => [nums(r.ints(10, -9, 9)), String(r.int(-9, 9))]],
    edge: [[nums([]), "0"], [nums([7]), "14"], [nums([0, 0]), "0"], [nums([-5, 5, 0, 0]), "0"]],
    adversarial: [(r) => [nums(r.ints(300, -3, 3)), "0"], (r) => [nums(r.ints(300, 0, 1)), "1"]],
    perf: [[nums(new Array<number>(100000).fill(0)), "0"], (r) => [nums(r.ints(100000, -5, 5)), "0"]],
  },
};
