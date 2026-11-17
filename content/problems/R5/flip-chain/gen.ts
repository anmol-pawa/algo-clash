import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 9), -5, 5))],
  groups: {
    basic: [[arr([1, 2, 3, 4])], [arr([1, 2, 3, 4, 5])], [arr([7])], [arr([10, 20])], (r) => [arr(r.ints(8, -50, 50))]],
    edge: [[arr([])], [arr([0])], [arr([-BIG, BIG])], [arr([5, 5, 5, 5])], [arr([BIG, -BIG, BIG])]],
    adversarial: [
      [arr(Array.from({ length: 1000 }, (_, i) => i))],
      [arr(Array.from({ length: 999 }, (_, i) => -i))],
      (r) => [arr(r.ints(500, -BIG, BIG))],
      (r) => [arr(r.ints(1000, 0, 2))],
    ],
    perf: [
      [arr(Array.from({ length: 100000 }, (_, i) => i))],
      (r) => [arr(r.ints(100000, -BIG, BIG))],
      [arr(new Array<number>(100000).fill(3))],
    ],
  },
};
