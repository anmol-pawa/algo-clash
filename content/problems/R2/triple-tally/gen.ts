import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[]): string[] => [arr(xs)];
/** Many triples: pairs (v, -v) around zeros plus noise. */
const rich = (r: Rng, n: number, span: number) => r.ints(n, -span, span);

export const gen: GenModule = {
  small: (r: Rng) => t(r.ints(r.int(0, 10), -4, 4)),
  groups: {
    basic: [t([-1, 0, 1, 2, -1, -4]), t([0, 1, 1]), t([0, 0, 0]), t([-2, 0, 1, 1, 2]), (r) => t(rich(r, 20, 6))],
    edge: [t([]), t([0]), t([0, 0]), t([0, 0, 0, 0, 0]), t([-100000, 0, 100000]), t([1, 2, 3]), t([-1, -2, -3]), t([-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6])],
    adversarial: [
      (r) => t(rich(r, 200, 3)),
      (r) => t(rich(r, 300, 40)),
      (r) => t([...Array(100).fill(0), ...r.ints(100, -5, 5)]),
      (r) => t(r.shuffle([...Array(60).fill(-2), ...Array(60).fill(1), ...Array(60).fill(1), ...Array(30).fill(0)])),
    ],
    perf: [
      (r) => t(rich(r, 3000, 100000)),
      (r) => t(rich(r, 3000, 60)),
      t(Array(3000).fill(0)),
      (r) => t(r.shuffle(Array.from({ length: 3000 }, (_, i) => i - 1500))),
    ],
  },
};
