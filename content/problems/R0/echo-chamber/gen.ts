import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const t = (base: number | string, bounces: number | string): string[] => [String(base), String(bounces)];
const BIG = 1000000000;
const MAX_BOUNCES = "1000000000000000000";

// A uniform-ish exponent up to 10^18, built from two 9-digit halves so no double precision is lost.
const hugeExp = (r: Rng): string => (BigInt(r.int(0, BIG)) * BigInt(BIG) + BigInt(r.int(0, BIG))).toString();

export const gen: GenModule = {
  small: (r) => t(r.int(0, 12), r.int(0, 40)),
  groups: {
    basic: [t(2, 10), t(3, 0), t(2, 100), t(5, 1), (r) => t(r.int(0, 20), r.int(0, 30))],
    edge: [t(0, 0), t(0, 1), t(0, 5), t(1, MAX_BOUNCES), t(BIG, 0), t(BIG, 1), t(1000000007 - 1, 3), t(2, 1), t(7, 2)],
    adversarial: [
      t(BIG, 1000000006),
      t(BIG, 1000000007),
      t(999999999, MAX_BOUNCES),
      t(2, "999999999999999999"),
      (r) => t(r.int(0, BIG), r.int(0, 1000)),
      (r) => t(r.int(0, BIG), hugeExp(r)),
      t(1000000006, "576460752303423487"),
    ],
    perf: [t(2, MAX_BOUNCES), t(BIG, MAX_BOUNCES), t(3, "999999999999999999"), (r) => t(r.int(2, BIG), hugeExp(r)), (r) => t(r.int(2, BIG), hugeExp(r))],
  },
};
