import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 10), -5, 5))],
  groups: {
    basic: [
      [arr([1, 2, 3, 4])],
      [arr([1, 2, 3, 4, 5])],
      [arr([6])],
      [arr([1, 2])],
      (r: Rng) => [arr(r.ints(9, -20, 20))],
    ],
    edge: [
      [arr([])],
      [arr([-BIG])],
      [arr([BIG, -BIG])],
      [arr([1, 2, 3])],
      [arr([4, 4, 4, 4, 4, 4])],
      [arr(seq(6))],
    ],
    adversarial: [
      // Even and odd lengths of the same size class, with distinct values so a wrong order shows.
      [arr(seq(998))],
      [arr(seq(999))],
      [arr(seq(1000))],
      [arr(seq(1001))],
      (r: Rng) => [arr(r.ints(1000, -BIG, BIG))],
      [arr(new Array<number>(777).fill(3))],
    ],
    perf: [
      [arr(seq(100000))],
      [arr(seq(99999))],
      (r: Rng) => [arr(r.ints(100000, -BIG, BIG))],
      (r: Rng) => [arr(r.ints(99998, -BIG, BIG))],
    ],
  },
};
