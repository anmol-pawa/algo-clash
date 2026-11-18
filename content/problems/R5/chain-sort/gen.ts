import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const one = (a: number[]) => [arr(a)];

export const gen: GenModule = {
  small: (r) => one(r.ints(r.int(0, 9), -4, 4)),
  groups: {
    basic: [
      one([4, 2, 1, 3]),
      one([-1, 5, 3, 4, 0]),
      one([7, 7, 7]),
      one([]),
      one([2, 1]),
      (r) => one(r.ints(10, -20, 20)),
    ],
    edge: [
      one([5]),
      one([BIG, -BIG]),
      one([-BIG, BIG]),
      // Extremes mixed with ties and zeros.
      one([BIG, -BIG, BIG, -BIG, 0, BIG, -BIG]),
      one([3, 2, 1]),
      one([1, 2, 3]),
      one([0, 0, 0, 0]),
    ],
    adversarial: [
      one(seq(1000).reverse()),
      one(seq(1000)),
      (r: Rng) => one(r.ints(1000, 0, 3)),
      (r: Rng) => one(r.ints(1001, -BIG, BIG)),
      // Organ pipe: ascending then descending.
      one([...seq(500), ...seq(500).reverse()]),
    ],
    perf: [
      (r: Rng) => one(r.ints(100000, -BIG, BIG)),
      one(seq(100000)),
      one(seq(100000).reverse()),
      (r: Rng) => one(r.ints(100000, 0, 5)),
    ],
  },
};
