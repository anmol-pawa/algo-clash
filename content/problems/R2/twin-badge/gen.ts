import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;
/** n distinct values (a shuffled range), so the answer is false. */
const distinct = (n: number, off: number) => Array.from({ length: n }, (_, i) => i * 7 + off - 500000000);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 8), 0, r.pick([3, 8, 30])))],
  groups: {
    basic: [[arr([4, 8, 15, 8])], [arr([1, 2, 3, 4])], [arr([])], [arr([9, 9])], (r) => [arr(r.ints(10, 0, 40))]],
    edge: [[arr([7])], [arr([-1000000000, 1000000000])], [arr([-1000000000, 5, -1000000000])], [arr([0, 0, 0])], [arr([1, 2, 1])], [arr([2, 1, 2, 1])]],
    adversarial: [
      [arr([...distinct(500, 0), distinct(500, 0)[0]])],
      [arr(distinct(500, 3))],
      (r) => { const a = distinct(500, 1); a[r.int(0, 499)] = a[r.int(0, 499)]; return [arr(a)]; },
      (r) => [arr(r.ints(500, -1000000000, 1000000000))],
    ],
    perf: [
      [arr(distinct(100000, 0))],
      [arr([...distinct(99999, 0), distinct(99999, 0)[0]])],
      (r) => [arr(r.ints(100000, -1000000000, 1000000000))],
      [arr(Array.from({ length: 100000 }, (_, i) => i % 50000))],
    ],
  },
};
