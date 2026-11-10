import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: number[]) => `[${xs.join(",")}]`;
const t = (xs: number[], k: number): string[] => [arr(xs), String(k)];
/** Cards where each is odd with probability pOdd percent. */
const cards = (r: Rng, n: number, pOdd: number) => Array.from({ length: n }, () => {
  const v = r.int(1, 500000000) * 2;
  return r.int(0, 99) < pOdd ? v - 1 : v;
});

export const gen: GenModule = {
  small: (r) => t(cards(r, r.int(0, 12), r.int(10, 90)), r.int(1, 4)),
  groups: {
    basic: [t([1, 1, 2, 1, 1], 3), t([2, 4, 6], 1), t([2, 1, 2], 1), (r) => t(cards(r, 20, 40), 2)],
    edge: [t([], 1), t([1], 1), t([2], 1), t([1], 2), t([1, 1, 1, 1], 1), t([1, 1, 1, 1], 4), t([2, 2, 2, 2], 1), t([2, 1, 2, 1, 2], 2), t([1000000000, 999999999], 1)],
    adversarial: [
      (r) => t(cards(r, 300, 50), r.int(1, 10)),
      (r) => t(cards(r, 300, 10), 2),
      (r) => t(cards(r, 300, 90), 20),
      t(Array.from({ length: 300 }, (_, i) => i + 1), 40),
    ],
    perf: [
      t(Array(100000).fill(2), 1),
      (r) => t(cards(r, 100000, 1), 1),
      (r) => t(cards(r, 100000, 50), 100000),
      (r) => t(cards(r, 100000, 30), 2000),
      // k = 1 over a row that is almost all even: ~10^9 answers would not fit in int
      t(Array.from({ length: 100000 }, (_, i) => (i === 50000 ? 1 : 2)), 1),
    ],
  },
};
