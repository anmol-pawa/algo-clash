import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (shelves: number[], queries: number[]): string[] => [arr(shelves), arr(queries)];
const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);
const BIG = 1000000000;

// Queries are a mix of values taken from the shelves (ties), values between them and out-of-range values.
function mixedQueries(r: Rng, shelves: number[], m: number, lo: number, hi: number): number[] {
  return Array.from({ length: m }, () => (shelves.length > 0 && r.int(0, 2) === 0 ? r.pick(shelves) : r.int(lo, hi)));
}

export const gen: GenModule = {
  small: (r) => {
    const shelves = sorted(r.ints(r.int(0, 8), -6, 6));
    return t(shelves, mixedQueries(r, shelves, r.int(0, 8), -8, 8));
  },
  groups: {
    basic: [t([1, 3, 3, 8], [3, 9, 0]), t([], [5]), t([2, 2, 2], [2, 3]), t([5], [4, 5, 6]), (r) => { const s = sorted(r.ints(12, 0, 30)); return t(s, mixedQueries(r, s, 8, 0, 30)); }],
    edge: [t([], []), t([1, 2], []), t([-BIG, BIG], [-BIG, BIG, 0, -BIG - 0]), t([7, 7, 7, 7], [7, 6, 8]), t([0], [0])],
    adversarial: [
      (r) => { const s = sorted(r.ints(200, -BIG, BIG)); return t(s, mixedQueries(r, s, 200, -BIG, BIG)); },
      (r) => { const s = sorted(r.ints(300, 0, 5)); return t(s, mixedQueries(r, s, 300, -1, 6)); },
      t(Array(1000).fill(-BIG), [-BIG, -BIG + 1, BIG]),
    ],
    perf: [
      (r) => { const s = sorted(r.ints(100000, -BIG, BIG)); return t(s, r.ints(100000, -BIG, BIG)); },
      (r) => { const s = sorted(r.ints(100000, 0, 50)); return t(s, mixedQueries(r, s, 100000, -1, 51)); },
      (r) => t(Array(100000).fill(BIG), r.ints(100000, BIG - 1, BIG)),
    ],
  },
};
