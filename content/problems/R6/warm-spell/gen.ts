import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;
const flat = (n: number, v: number) => new Array<number>(n).fill(v);
const down = (n: number, top: number) => Array.from({ length: n }, (_, i) => top - i);
const up = (n: number, base: number) => Array.from({ length: n }, (_, i) => base + i);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 10), -3, r.pick([2, 5, 20])))],
  groups: {
    basic: [[arr([20, 18, 25, 19, 21, 17])], [arr([5, 5, 5])], [arr([1, 2, 3, 4])], [arr([9, 8, 7])], (r) => [arr(r.ints(15, 0, 30))]],
    edge: [[arr([])], [arr([7])], [arr([3, 4])], [arr([4, 3])], [arr([-1000000000, 1000000000, -1000000000])], [arr([2, 2, 3, 3, 1, 2])]],
    adversarial: [
      [arr(down(500, 1000000000))],
      [arr(up(500, -1000000000))],
      [arr(flat(500, -5))],
      (r) => [arr(r.ints(500, -1000000000, 1000000000))],
      (r) => [arr(r.ints(500, 0, 3))],
      [arr([...down(250, 500), ...up(250, 0)])],
    ],
    perf: [
      [arr(down(100000, 1000000000))],
      [arr(up(100000, -1000000000))],
      [arr(flat(100000, 0))],
      (r) => [arr(r.ints(100000, -1000000000, 1000000000))],
      (r) => [arr([...down(50000, 100000), ...r.ints(50000, 0, 100000)])],
    ],
  },
};
