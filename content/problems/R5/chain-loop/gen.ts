import type { GenModule } from "../../../../lib/content/native";

// A list is written [values]@pos: the last node links back to index pos (-1 means it ends in null).
const lit = (a: number[], pos: number) => `[${a.join(",")}]@${pos}`;
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(0, 10);
    return [lit(r.ints(n, -3, 3), n === 0 || r.int(0, 1) === 0 ? -1 : r.int(0, n - 1))];
  },
  groups: {
    basic: [
      [lit([3, 2, 0, -4], 1)],
      [lit([1, 2], 0)],
      [lit([1], -1)],
      [lit([5, 6, 7, 8, 9], -1)],
      (r) => [lit(r.ints(8, -30, 30), r.int(0, 7))],
    ],
    edge: [
      [lit([], -1)],
      [lit([7], 0)],
      [lit([1, 1, 1, 1], -1)],
      [lit([1, 1, 1, 1], 3)],
      [lit([BIG, -BIG], 1)],
    ],
    adversarial: [
      // Equal values everywhere: a value-based "seen before" check says yes, but there is no loop.
      [lit([2, 2, 2, 2, 2, 2, 2], -1)],
      [lit(seq(999), 0)],
      [lit(seq(1000), 998)],
      [lit(seq(1001), -1)],
      (r) => [lit(r.ints(1002, 0, 1), -1)],
    ],
    perf: [
      [lit(seq(100000), -1)],
      [lit(seq(100000), 0)],
      [lit(seq(100000), 99999)],
      (r) => [lit(r.ints(100000, -BIG, BIG), r.int(0, 99999))],
    ],
  },
};
