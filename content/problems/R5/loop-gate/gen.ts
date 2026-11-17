import type { GenModule } from "../../../../lib/content/native";

// A list is written [values]@pos: the last node links back to index pos (-1 means it ends in null).
const lit = (a: number[], pos: number) => `[${a.join(",")}]@${pos}`;
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(0, 12);
    return [lit(r.ints(n, -3, 3), n === 0 || r.int(0, 3) === 0 ? -1 : r.int(0, n - 1))];
  },
  groups: {
    basic: [
      [lit([3, 2, 0, -4], 1)],
      [lit([1, 2], 0)],
      [lit([4, 5, 6], -1)],
      [lit([1, 2, 3, 4, 5, 6], 3)],
      (r) => [lit(r.ints(9, -30, 30), r.int(0, 8))],
    ],
    edge: [
      [lit([], -1)],
      [lit([7], 0)],
      [lit([7], -1)],
      [lit([5, 5, 5, 5, 5], 2)],
      [lit([BIG, -BIG, BIG], 2)],
      [lit([1, 2, 3, 4], 0)],
    ],
    adversarial: [
      // Equal values everywhere: only the node identity tells the entry apart.
      [lit([2, 2, 2, 2, 2, 2, 2, 2], 4)],
      // Cycle length 1, 2 and 3 with long tails (the runners meet at different offsets).
      [lit(seq(999), 998)],
      [lit(seq(1000), 998)],
      [lit(seq(1001), 998)],
      // Entry at the very end of a long tail, and at the head of a long cycle.
      [lit(seq(1000), 999)],
      [lit(seq(1000), 0)],
      (r) => [lit(r.ints(1002, 0, 1), r.int(0, 1001))],
    ],
    perf: [
      [lit(seq(100000), 0)],
      [lit(seq(100000), 99999)],
      [lit(seq(100000), 50000)],
      [lit(seq(100000), -1)],
      (r) => [lit(r.ints(100000, -BIG, BIG), r.int(0, 99999))],
    ],
  },
};
