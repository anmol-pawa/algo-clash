import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const enc = (g: number[][]) => `[${g.map((row) => `[${row.join(",")}]`).join(",")}]`;
const t = (g: number[][]): string[] => [enc(g)];
const BIG = 1000000000;
const grid = (r: Rng, rows: number, cols: number, lo: number, hi: number) => Array.from({ length: rows }, () => r.ints(cols, lo, hi));

export const gen: GenModule = {
  small: (r) => t(grid(r, r.int(1, 5), r.int(1, 5), -9, 9)),
  groups: {
    basic: [t([[1, 2, 3], [4, 5, 6]]), t([[7]]), t([[1], [2], [3]]), t([[1, 2], [3, 4]]), (r) => t(grid(r, 3, 4, -20, 20))],
    edge: [t([[0]]), t([[-BIG, BIG]]), t([[BIG], [-BIG]]), (r) => t(grid(r, 1, 9, -5, 5)), (r) => t(grid(r, 9, 1, -5, 5))],
    adversarial: [(r) => t(grid(r, 7, 3, -BIG, BIG)), (r) => t(grid(r, 3, 7, -BIG, BIG)), (r) => t(grid(r, 20, 20, -9, 9))],
    perf: [(r) => t(grid(r, 300, 330, -BIG, BIG)), (r) => t(grid(r, 1, 100000, -BIG, BIG)), (r) => t(grid(r, 100000, 1, -BIG, BIG)), (r) => t(grid(r, 500, 200, 0, 9))],
  },
};
