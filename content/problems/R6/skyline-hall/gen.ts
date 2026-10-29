import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const flat = (n: number, v: number) => new Array<number>(n).fill(v);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 9), 0, r.pick([3, 6, 12])))],
  groups: {
    basic: [[arr([2, 1, 5, 6, 2, 3])], [arr([4, 4, 4])], [arr([7])], [arr([1, 2, 3, 4, 5])], (r) => [arr(r.ints(12, 0, 9))]],
    edge: [[arr([])], [arr([0])], [arr([0, 0, 0])], [arr([5, 0, 5])], [arr([1000000000, 1000000000])], [arr([3, 1, 3, 2, 2])]],
    adversarial: [
      [arr(flat(1000, 1000000000))],
      [arr(Array.from({ length: 400 }, (_, i) => 400 - i))],
      [arr(Array.from({ length: 400 }, (_, i) => i + 1))],
      (r) => [arr(r.ints(500, 0, 1000000000))],
      (r) => [arr(r.ints(500, 1, 4))],
    ],
    perf: [
      [arr(flat(100000, 1000000000))],
      [arr(Array.from({ length: 100000 }, (_, i) => 100000 - i))],
      (r) => [arr(r.ints(100000, 0, 1000000000))],
      (r) => [arr(r.ints(100000, 1000000000 - 3, 1000000000))],
    ],
  },
};
