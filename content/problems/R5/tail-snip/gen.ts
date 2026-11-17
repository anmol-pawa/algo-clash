import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const make = (a: number[], n: number) => [arr(a), String(n)];

export const gen: GenModule = {
  small: (r) => {
    const len = r.int(1, 9);
    return make(r.ints(len, -4, 4), r.int(1, len));
  },
  groups: {
    basic: [
      make([1, 2, 3, 4, 5], 2),
      make([1, 2, 3], 3),
      make([8], 1),
      make([4, 6], 1),
      (r) => make(r.ints(8, -20, 20), r.int(1, 8)),
    ],
    edge: [
      make([-BIG], 1),
      make([BIG, -BIG], 2),
      make([BIG, -BIG], 1),
      make([5, 5, 5, 5], 2),
      make([1, 2, 3, 4], 4),
      make([1, 2, 3, 4], 1),
    ],
    adversarial: [
      // Equal values everywhere: only the position decides which node goes.
      make(new Array<number>(900).fill(7), 450),
      make(seq(1000), 1000),
      make(seq(1000), 1),
      make(seq(1000), 2),
      make(seq(1000), 999),
      (r: Rng) => make(r.ints(1000, -BIG, BIG), r.int(1, 1000)),
    ],
    perf: [
      make(seq(100000), 100000),
      make(seq(100000), 1),
      make(seq(100000), 50000),
      (r: Rng) => make(r.ints(100000, -BIG, BIG), r.int(1, 100000)),
    ],
  },
};
