import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const BIG = 1000000000;
const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (deck: number[], target: number): string[] => [arr(deck), String(target)];
// Deck values come from a small alphabet so the target actually matches.
const deck = (r: Rng, n: number, k: number, target: number, matchPct: number) => t(Array.from({ length: n }, () => (r.int(1, 100) <= matchPct ? target : r.int(-k, k))), target);

export const gen: GenModule = {
  small: (r) => deck(r, r.int(0, 10), 3, r.int(-3, 3), 40),
  groups: {
    basic: [t([3, 1, 3, 3, 2], 3), t([5, 6], 9), t([4, 4, 4], 4), t([], 1), (r) => deck(r, 15, 5, 2, 30)],
    edge: [t([7], 7), t([7], 8), t([-BIG, BIG, -BIG], -BIG), t([0, 0, 1, 0], 0), t([1, 2, 3], BIG)],
    adversarial: [(r) => deck(r, 200, 3, 1, 50), (r) => deck(r, 300, BIG, 5, 10), t(Array(300).fill(2), 2), (r) => deck(r, 300, 2, 0, 80)],
    perf: [t(Array(200000).fill(1), 1), (r) => deck(r, 200000, 5, 3, 50), (r) => deck(r, 200000, BIG, 7, 1), t(Array.from({ length: 200000 }, (_, i) => (i % 2 === 0 ? 9 : i)), 9)],
  },
};
