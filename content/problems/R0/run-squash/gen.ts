import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];
const BIG = 1000000000;

// Builds a belt from runs of random length so adjacent repeats are common but not universal.
function runs(r: Rng, n: number, lo: number, hi: number, maxRun: number): number[] {
  const out: number[] = [];
  while (out.length < n) {
    const v = r.int(lo, hi);
    const len = r.int(1, maxRun);
    for (let k = 0; k < len && out.length < n; k++) out.push(v);
  }
  return out;
}

export const gen: GenModule = {
  small: (r) => t(runs(r, r.int(0, 10), -3, 3, 3)),
  groups: {
    basic: [t([4, 4, 7, 7, 7, 4]), t([1, 2, 3]), t([9, 9, 9, 9]), t([]), (r) => t(runs(r, 14, -4, 4, 3))],
    edge: [t([5]), t([-BIG, -BIG, BIG, BIG]), t([1, 2, 1, 2, 1, 2]), t([3, 3]), t([0, 0, 0, 1, 1, 0, 0])],
    adversarial: [(r) => t(runs(r, 200, -2, 2, 5)), (r) => t(runs(r, 300, -BIG, BIG, 2)), t(Array(100).fill(8))],
    perf: [t(Array(100000).fill(7)), (r) => t(runs(r, 100000, -BIG, BIG, 4)), (r) => t(runs(r, 100000, 0, 1, 60000))],
  },
};
