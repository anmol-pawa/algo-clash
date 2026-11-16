import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;
const flat = (n: number, v: number) => new Array<number>(n).fill(v);
/** A deep well: tall wall, long floor, tall wall. */
const well = (n: number, h: number) => [h, ...flat(n - 2, 0), h];

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 10), 0, r.pick([2, 4, 9])))],
  groups: {
    basic: [
      [arr([3, 0, 2, 0, 4])],
      [arr([2, 0, 2])],
      [arr([1, 2, 3, 4])],
      [arr([5, 2, 1, 2, 5])],
      (r) => [arr(r.ints(12, 0, 8))],
    ],
    edge: [
      [arr([])],
      [arr([7])],
      [arr([4, 9])],
      [arr([0, 0, 0, 0])],
      [arr([3, 3, 3, 3])],
      [arr([9, 4, 4, 9])],
      [arr([100000, 0, 100000])],
      [arr([4, 3, 2, 1])],
      [arr([2, 1, 2, 1, 2, 1, 2])],
    ],
    adversarial: [
      [arr(Array.from({ length: 1000 }, (_, i) => 1000 - i))],
      [arr(Array.from({ length: 1000 }, (_, i) => i))],
      [arr(Array.from({ length: 1000 }, (_, i) => (i % 2 ? 0 : 100000)))],
      [arr(Array.from({ length: 1000 }, (_, i) => Math.abs(500 - i)))],
      [arr(Array.from({ length: 1000 }, (_, i) => 500 - Math.abs(500 - i)))],
      (r) => [arr(r.ints(1000, 0, 100000))],
      (r) => [arr(r.ints(1000, 0, 3))],
    ],
    perf: [
      [arr(well(200000, 100000))],
      [arr(Array.from({ length: 200000 }, (_, i) => Math.abs(100000 - i)))],
      [arr(Array.from({ length: 200000 }, (_, i) => 200000 - i > 100000 ? 100000 : 200000 - i))],
      (r) => [arr(r.ints(200000, 0, 100000))],
      (r) => [arr(r.ints(200000, 0, 5))],
      [arr(Array.from({ length: 200000 }, (_, i) => (i % 2 ? 0 : 100000)))],
    ],
  },
};
