import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;
const flat = (n: number, v: number) => new Array<number>(n).fill(v);
const down = (n: number) => Array.from({ length: n }, (_, i) => 1000000000 - i);
const up = (n: number) => Array.from({ length: n }, (_, i) => -1000000000 + i);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 10), -3, r.pick([3, 6, 12])))],
  groups: {
    basic: [[arr([30, 40, 35, 50, 45])], [arr([60, 60, 60])], [arr([9, 8, 7, 10])], [arr([1, 2, 3, 4])], (r) => [arr(r.ints(12, 30, 100))]],
    edge: [[arr([])], [arr([5])], [arr([-1000000000, 1000000000])], [arr([1000000000, -1000000000])], [arr([2, 1, 2])], [arr([3, 3, 4, 3, 3])]],
    adversarial: [
      [arr(down(1000))],
      [arr(up(1000))],
      [arr([...down(500), 1000000000 + 0])],
      (r) => [arr(r.ints(500, -1000000000, 1000000000))],
      (r) => [arr(r.ints(500, 0, 3))],
    ],
    perf: [
      [arr(down(100000))],
      [arr(flat(100000, 7))],
      [arr(up(100000))],
      (r) => [arr(r.ints(100000, -1000000000, 1000000000))],
      (r) => [arr([...down(99999), 1000000000])],
    ],
  },
};
