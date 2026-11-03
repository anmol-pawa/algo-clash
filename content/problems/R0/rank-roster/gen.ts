import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const enc = (rows: number[][]) => `[${rows.map(([a, b]) => `[${a},${b}]`).join(",")}]`;
const t = (rows: number[][]): string[] => [enc(rows)];
const roster = (r: Rng, n: number, lo: number, hi: number, idMax: number) => {
  const ids = new Set<number>();
  while (ids.size < n) ids.add(r.int(0, idMax));
  return r.shuffle([...ids]).map((id) => [id, r.int(lo, hi)]);
};

export const gen: GenModule = {
  small: (r) => t(roster(r, r.int(0, 8), -3, 3, 20)),
  groups: {
    basic: [t([[7, 50], [3, 90], [5, 50]]), t([[1, 10], [2, 10], [0, 10]]), t([[4, -5]]), (r) => t(roster(r, 8, 0, 100, 50))],
    edge: [t([]), t([[0, 0]]), t([[1000000000, 1000000000], [0, 1000000000], [5, -1000000000]]), (r) => t(roster(r, 40, 0, 2, 100))],
    adversarial: [(r) => t(roster(r, 500, 5, 5, 100000)), (r) => t(roster(r, 500, -1000000000, 1000000000, 1000000000)), t(Array.from({ length: 300 }, (_, i) => [299 - i, i]))],
    perf: [(r) => t(roster(r, 100000, -1000000000, 1000000000, 1000000000)), (r) => t(roster(r, 100000, 0, 3, 1000000000)), t(Array.from({ length: 100000 }, (_, i) => [i, 7]))],
  },
};
