import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const L = (a: number[]) => `[${a.join(",")}]`;
const t = (a: number[]): string[] => [L(a)];

export const gen: GenModule = {
  small: (r) => t(r.ints(r.int(0, 8), -9, 9)),
  groups: {
    basic: [t([1, 2, 3]), t([7]), t([0, 0]), t([]), (r) => t(r.ints(9, -20, 20))],
    edge: [t([-1000]), t([1000, -1000]), t([5, 5, 5, 5]), t([0])],
    adversarial: [(r) => t(r.ints(100, -1000, 1000)), t(Array.from({ length: 64 }, (_, i) => i)), t(Array.from({ length: 33 }, (_, i) => 33 - i))],
    perf: [(r) => t(r.ints(100000, -1000, 1000)), t(Array(100000).fill(0)), t(Array.from({ length: 100000 }, (_, i) => (i % 2001) - 1000))],
  },
};
