import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 9), -6, 6)), String(r.int(-8, 8))],
  groups: {
    basic: [[arr([2, 7, 11, 15]), "9"], [arr([3, 3, 3]), "6"], [arr([1, 4, 3, 6]), "7"], [arr([5]), "10"], (r) => [arr(r.ints(12, -20, 20)), String(r.int(-30, 30))]],
    edge: [
      [arr([]), "0"],
      [arr([0, 0]), "0"],
      [arr([-1000000000, 1000000000]), "0"],
      [arr([1000000000, 1000000000]), "1000000000"],
      [arr([-1000000000, -1000000000]), "-1000000000"],
      [arr([4, 2, 4]), "8"],
    ],
    adversarial: [
      [arr(new Array<number>(500).fill(7)), "14"],
      [arr(Array.from({ length: 500 }, (_, i) => i)), "997"],
      (r) => [arr(r.ints(500, -1000000000, 1000000000)), String(r.int(-1000000000, 1000000000))],
      (r) => [arr(r.ints(500, -3, 3)), "5"],
    ],
    perf: [
      (r) => [arr(r.ints(100000, -1000000000, 1000000000)), "1000000000"],
      [arr(Array.from({ length: 100000 }, (_, i) => i * 2)), "1"],
      [arr([...Array.from({ length: 99998 }, (_, i) => i * 2), 3, 5]), "8"],
      [arr(new Array<number>(100000).fill(1)), "3"],
    ],
  },
};
