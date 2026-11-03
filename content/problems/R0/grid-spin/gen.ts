import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const BIG = 1000000000;
const fmt = (g: number[][]) => `[${g.map((row) => `[${row.join(",")}]`).join(",")}]`;
const grid = (r: Rng, rows: number, cols: number, lo: number, hi: number): string[] => [fmt(Array.from({ length: rows }, () => r.ints(cols, lo, hi)))];

export const gen: GenModule = {
  small: (r) => (r.int(0, 9) === 0 ? ["[]"] : grid(r, r.int(1, 5), r.int(1, 5), -9, 9)),
  groups: {
    basic: [["[[1,2,3],[4,5,6]]"], ["[[7]]"], ["[[1],[2],[3]]"], ["[]"], (r) => grid(r, 3, 3, 0, 20)],
    edge: [["[[1,2,3,4,5]]"], ["[[-1000000000,1000000000],[0,0]]"], (r) => grid(r, 1, 1, -BIG, BIG), (r) => grid(r, 2, 7, -5, 5), (r) => grid(r, 7, 2, -5, 5)],
    adversarial: [(r) => grid(r, 20, 20, -BIG, BIG), (r) => grid(r, 3, 40, -9, 9), (r) => grid(r, 40, 3, -9, 9), (r) => grid(r, 13, 29, -BIG, BIG)],
    perf: [(r) => grid(r, 500, 500, -BIG, BIG), (r) => grid(r, 1, 250000, 0, 9), (r) => grid(r, 250000, 1, 0, 9), (r) => grid(r, 250, 1000, -BIG, BIG)],
  },
};
