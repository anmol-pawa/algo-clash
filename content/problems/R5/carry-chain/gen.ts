import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
// Digits are least significant first, so the LAST digit is the leading one and must be non-zero (unless the number is 0).
const digits = (r: Rng, n: number): number[] => {
  const d = r.ints(n, 0, 9);
  if (n > 1 && d[n - 1] === 0) d[n - 1] = r.int(1, 9);
  return d;
};
const nines = (n: number) => new Array<number>(n).fill(9);
const pair = (a: number[], b: number[]) => [arr(a), arr(b)];

export const gen: GenModule = {
  small: (r) => [arr(digits(r, r.int(1, 7))), arr(digits(r, r.int(1, 7)))],
  groups: {
    basic: [
      pair([2, 4, 3], [5, 6, 4]),
      pair([9, 9, 9], [1]),
      pair([0], [0]),
      pair([5], [7, 1]),
      (r) => pair(digits(r, 6), digits(r, 6)),
    ],
    edge: [
      pair([0], [1]),
      pair([9], [9]),
      pair([5], [5]),
      pair([1, 0, 0, 1], [9, 9, 8]),
      pair([9, 9], [9, 9]),
      pair([0], [3, 2, 1]),
    ],
    adversarial: [
      // A carry that ripples through every digit and adds a new leading digit.
      pair(nines(500), [1]),
      pair([1], nines(500)),
      pair(nines(500), nines(500)),
      // Past 18 digits a 64-bit integer overflows.
      (r) => pair(digits(r, 30), digits(r, 25)),
      (r) => pair(digits(r, 40), digits(r, 40)),
      // Different lengths where the carry dies out halfway through the longer one.
      pair([5, 9, 9, 9, 3, 1], [5, 0, 0, 0, 0]),
    ],
    perf: [
      pair(nines(100000), [1]),
      pair(nines(100000), nines(100000)),
      (r) => pair(digits(r, 100000), digits(r, 100000)),
      (r) => pair(digits(r, 100000), digits(r, 1)),
    ],
  },
};
