import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;
const flat = (n: number, v: number) => new Array<number>(n).fill(v);
const down = (n: number) => Array.from({ length: n }, (_, i) => 1000000000 - i);
const up = (n: number) => Array.from({ length: n }, (_, i) => 1 + i);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 10), 1, r.pick([2, 4, 12])))],
  groups: {
    basic: [[arr([3, 1, 2, 4])], [arr([5])], [arr([2, 2])], [arr([11, 81, 94, 43, 3])], (r) => [arr(r.ints(12, 1, 30))]],
    edge: [[arr([])], [arr([1000000000])], [arr([1000000000, 1000000000, 1000000000])], [arr([1, 1, 1, 1])], [arr([2, 1, 2])], [arr([3, 3, 4, 3, 3])]],
    adversarial: [
      [arr(down(1000))],
      [arr(up(1000))],
      [arr(flat(1000, 1000000000))],
      (r) => [arr(r.ints(500, 1, 1000000000))],
      (r) => [arr(r.ints(500, 1, 3))],
    ],
    perf: [
      [arr(flat(100000, 1000000000))],
      [arr(down(100000))],
      [arr(up(100000))],
      (r) => [arr(r.ints(100000, 1, 1000000000))],
      (r) => [arr(r.ints(100000, 1, 3))],
    ],
  },
};
