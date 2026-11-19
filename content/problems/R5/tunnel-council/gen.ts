import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const BIG = 1000000000;
const lists = (ls: number[][]) => `[${ls.map((l) => `[${l.join(",")}]`).join(",")}]`;
const sorted = (r: Rng, n: number, lo: number, hi: number) => r.ints(n, lo, hi).sort((x, y) => x - y);
const range = (n: number, start: number, step: number) => Array.from({ length: n }, (_, i) => start + i * step);
const many = (r: Rng, k: number, maxLen: number, lo: number, hi: number) =>
  Array.from({ length: k }, () => sorted(r, r.int(0, maxLen), lo, hi));

export const gen: GenModule = {
  small: (r) => {
    const span = r.pick([3, 8, 20]);
    return [lists(many(r, r.int(0, 5), 6, -span, span))];
  },
  groups: {
    basic: [
      [lists([[1, 4, 5], [1, 3, 4], [2, 6]])],
      [lists([[], [7]])],
      [lists([[1, 2], [3, 4]])],
      [lists([[5], [4], [3], [2], [1]])],
      (r) => [lists(many(r, 4, 6, -20, 20))],
    ],
    edge: [
      [lists([])],
      [lists([[], []])],
      [lists([[], [], []])],
      [lists([[-BIG, BIG], [-BIG, 0, BIG], [BIG]])],
      [lists([[4, 4, 4], [4, 4], [4]])],
      [lists([[1, 2, 3, 4, 5, 6, 7]])],
      [lists([[], [], [3, 5], []])],
    ],
    adversarial: [
      [lists(Array.from({ length: 7 }, (_, i) => range(100, i, 7)))],
      [lists(Array.from({ length: 9 }, (_, i) => range(60, i * 60, 1)))],
      [lists(Array.from({ length: 9 }, (_, i) => range(60, (8 - i) * 60, 1)))],
      (r) => [lists(many(r, 40, 30, 0, 5))],
      (r) => [lists([sorted(r, 800, -BIG, BIG), ...many(r, 20, 3, -BIG, BIG)])],
      (r) => [lists(many(r, 101, 8, -BIG, BIG))],
    ],
    perf: [
      // 50000 tunnels of two nodes: sequential accumulation does about k^2 = 2.5e9 node visits.
      (r) => [lists(Array.from({ length: 50000 }, () => sorted(r, 2, -BIG, BIG)))],
      [lists(Array.from({ length: 1000 }, (_, i) => range(100, i, 1000)))],
      (r) => [lists([sorted(r, 99990, -BIG, BIG), ...many(r, 10, 1, -BIG, BIG)])],
      [lists(Array.from({ length: 50000 }, () => [1, 1]))],
    ],
  },
};
