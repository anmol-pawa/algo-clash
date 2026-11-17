import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 10), -5, 5))],
  groups: {
    basic: [
      [arr([1, 2, 3, 4, 5])],
      [arr([2, 1, 3, 5, 6, 4, 7])],
      [arr([8, 8])],
      [arr([1, 2, 3, 4])],
      (r: Rng) => [arr(r.ints(9, -20, 20))],
    ],
    edge: [
      [arr([])],
      [arr([BIG])],
      [arr([BIG, -BIG])],
      [arr([1, 2, 3])],
      [arr([4, 4, 4, 4, 4, 4])],
      [arr(seq(6))],
    ],
    adversarial: [
      // Values whose parity disagrees with their position, so grouping by value shows.
      [arr([2, 1, 4, 3, 6, 5, 8, 7])],
      [arr([2, 4, 6, 1, 3, 5, 7])],
      [arr(seq(998))],
      [arr(seq(999))],
      (r: Rng) => [arr(r.ints(1001, -BIG, BIG))],
      (r: Rng) => [arr(r.ints(1000, -BIG, BIG))],
    ],
    perf: [
      [arr(seq(100000))],
      [arr(seq(99999))],
      (r: Rng) => [arr(r.ints(100000, -BIG, BIG))],
      (r: Rng) => [arr(r.ints(99997, -BIG, BIG))],
    ],
  },
};
