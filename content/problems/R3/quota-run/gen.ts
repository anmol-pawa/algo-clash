import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], quota: number): string[] => [arr(xs), String(quota)];
const vals = (r: Rng, n: number, lo: number, hi: number) => Array.from({ length: n }, () => r.int(lo, hi));

export const gen: GenModule = {
  small: (r) => t(vals(r, r.int(1, 12), -6, 6), r.int(1, 12)),
  groups: {
    basic: [t([2, -1, 2], 3), t([5], 5), t([1, 2], 4), t([84, -37, 32, 40, 95], 167), (r) => t(vals(r, 20, -10, 10), 15)],
    edge: [
      t([1], 1),
      t([-1], 1),
      t([0], 1),
      t([1, 1, 1, 1], 4),
      t([1, 1, 1, 1], 5),
      t([-5, 10], 5),
      // a long negative gap: dropping the front too early or too late changes the answer
      t([3, -10, 3, 3], 6),
      t([-2, -2, 5, -2, 5], 6),
      t([100000, 100000], 200000),
      t([100000], 1000000000),
    ],
    adversarial: [
      (r) => t(vals(r, 300, -5, 5), r.int(1, 20)),
      (r) => t(vals(r, 300, -100000, 100000), r.int(1, 300000)),
      // mostly negative with rare spikes
      (r) => t(Array.from({ length: 300 }, () => (r.int(0, 19) === 0 ? r.int(50, 100) : r.int(-10, -1))), r.int(20, 120)),
      (r) => t(vals(r, 300, -1, 1), 5),
    ],
    perf: [
      // nothing reaches the quota: a per-start scan runs to the end every time
      t(Array(100000).fill(-1), 1),
      // a quota beyond 32 bits over a row whose prefixes climb to 10^10: int prefix sums overflow
      t(Array(100000).fill(100000), 5000000000),
      (r) => t(vals(r, 100000, -100000, 100000), 1000000000),
      (r) => t(vals(r, 100000, -20000, 100000), 6000000000),
      (r) => t(vals(r, 100000, -3, 4), 20000),
      // mostly-negative row whose only good run is long
      t(Array.from({ length: 100000 }, (_, i) => (i % 2 === 0 ? 3 : -2)), 40000),
    ],
  },
};
