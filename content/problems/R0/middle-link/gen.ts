import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const L = (a: number[]) => `[${a.join(",")}]`;
const t = (a: number[]): string[] => [L(a)];

export const gen: GenModule = {
  small: (r) => t(r.ints(r.int(0, 9), -9, 9)),
  groups: {
    basic: [t([1, 2, 3, 4, 5]), t([1, 2, 3, 4]), t([9]), t([]), (r) => t(r.ints(11, -50, 50))],
    edge: [t([1, 2]), t([1, 2, 3]), t([0, 0]), t([-1000, 1000])],
    adversarial: [(r) => t(r.ints(100, -1000, 1000)), (r) => t(r.ints(101, -1000, 1000)), t(Array.from({ length: 64 }, (_, i) => i))],
    perf: [(r) => t(r.ints(100000, -1000, 1000)), (r) => t(r.ints(99999, -1000, 1000)), t(Array(100000).fill(7))],
  },
};
