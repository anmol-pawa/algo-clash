import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const jobsStr = (js: number[][]) => `[${js.map((j) => `[${j.join(",")}]`).join(",")}]`;
const t = (lanes: number, js: number[][]): string[] => [String(lanes), jobsStr(js)];
const BIG = 1_000_000_000;

const randomJobs = (r: Rng, lanes: number, m: number, lo: number, hi: number): number[][] =>
  Array.from({ length: m }, () => {
    const a = r.int(0, lanes - 1);
    const b = r.int(0, lanes - 1);
    return [Math.min(a, b), Math.max(a, b), r.int(lo, hi)];
  });

export const gen: GenModule = {
  small: (r: Rng) => {
    const lanes = r.int(1, 8);
    return t(lanes, randomJobs(r, lanes, r.int(0, 6), -9, 9));
  },
  groups: {
    basic: [t(5, [[1, 3, 2], [2, 4, 3]]), t(3, [[0, 2, 7], [1, 1, -7]]), t(4, []), (r) => t(10, randomJobs(r, 10, 6, -5, 5))],
    edge: [t(1, [[0, 0, 5]]), t(1, [[0, 0, -BIG], [0, 0, -BIG]]), t(2, [[1, 1, 3]]), t(3, [[0, 2, BIG], [0, 2, BIG]]), t(6, [[0, 5, 1], [0, 5, -1]]), t(4, [[3, 3, 9], [0, 0, 9]])],
    adversarial: [
      (r) => t(200, randomJobs(r, 200, 200, -1000, 1000)),
      (r) => t(300, randomJobs(r, 300, 300, BIG, BIG)),
      (r) => t(300, randomJobs(r, 300, 300, -BIG, BIG)),
    ],
    perf: [
      (r) => t(100000, randomJobs(r, 100000, 100000, -BIG, BIG)),
      t(100000, Array.from({ length: 100000 }, () => [0, 99999, BIG])),
      (r) => t(100000, Array.from({ length: 100000 }, () => [r.int(0, 5), r.int(99990, 99999), BIG])),
    ],
  },
};
