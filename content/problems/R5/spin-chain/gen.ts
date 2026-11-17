import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const KMAX = 2000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const make = (a: number[], k: number) => [arr(a), String(k)];

export const gen: GenModule = {
  small: (r) => {
    const len = r.int(0, 8);
    return make(r.ints(len, -4, 4), r.int(0, 20));
  },
  groups: {
    basic: [
      make([1, 2, 3, 4, 5], 2),
      make([10, 20, 30], 4),
      make([7, 8], 0),
      make([], 5),
      make([1, 2, 3, 4, 5, 6], 3),
      (r: Rng) => make(r.ints(8, -20, 20), r.int(1, 7)),
    ],
    edge: [
      make([5], 1000000),
      make([1, 2, 3], 3),
      make([1, 2, 3], 6),
      make([1, 2, 3], 5),
      make([1, 2, 3, 4], 1),
      make([1, 2, 3, 4], 3),
      make([BIG, -BIG], KMAX),
    ],
    adversarial: [
      // k just around a multiple of the length: clamping instead of reducing fails here.
      make(seq(7), 8),
      make(seq(7), 14),
      make(seq(7), 15),
      make(seq(10), 11),
      (r: Rng) => make(r.ints(1000, -BIG, BIG), 1000 * r.int(1, 1000) + r.int(0, 999)),
      (r: Rng) => make(r.ints(999, -BIG, BIG), KMAX),
    ],
    perf: [
      // Many spins left after the modulo, so one-spin-at-a-time loops cost O(n^2).
      make(seq(100000), 50000),
      make(seq(100000), 99999),
      (r: Rng) => make(r.ints(100000, -BIG, BIG), KMAX),
      (r: Rng) => make(r.ints(99999, -BIG, BIG), 49999),
    ],
  },
};
