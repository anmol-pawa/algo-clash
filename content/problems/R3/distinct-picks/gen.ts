import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], k: number): string[] => [arr(xs), String(k)];
/** n beads with colour codes drawn from 1..colours (spread over the full 1..100000 range). */
const beads = (r: Rng, n: number, colours: number) => {
  const step = Math.max(1, Math.floor(100000 / colours));
  return Array.from({ length: n }, () => r.int(1, colours) * step - (step - 1));
};

export const gen: GenModule = {
  small: (r) => t(beads(r, r.int(0, 12), r.int(1, 4)), r.int(1, 4)),
  groups: {
    basic: [t([3, 1, 3, 2, 2], 2), t([4, 4, 4], 1), t([1, 2, 3], 4), (r) => t(beads(r, 20, 4), 2), (r) => t(beads(r, 20, 5), 3)],
    edge: [t([], 1), t([7], 1), t([7], 2), t([1, 2], 2), t([1, 2], 1), t([5, 5, 5, 5], 1), t([5, 5, 5, 5], 2), t([1, 2, 1, 2, 1], 2), t([100000, 1, 100000], 2), t([100000], 100000)],
    adversarial: [
      (r) => t(beads(r, 300, 2), 1),
      (r) => t(beads(r, 300, 3), 2),
      (r) => t(beads(r, 300, 10), 4),
      (r) => t(beads(r, 300, 300), 50),
      t(Array.from({ length: 300 }, (_, i) => (i % 5) + 1), 5),
    ],
    perf: [
      // few colours and k above the colour count: every start extends to the end
      (r) => t(beads(r, 100000, 3), 3),
      t(Array(100000).fill(9), 1),
      (r) => t(beads(r, 100000, 100000), 1000),
      (r) => t(beads(r, 100000, 50), 25),
      // k = 1 on a few long runs: huge exact counts
      t(Array.from({ length: 100000 }, (_, i) => (i < 50000 ? 1 : 2)), 1),
    ],
  },
};
