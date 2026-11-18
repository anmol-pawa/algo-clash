import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const one = (a: number[]) => [arr(a)];

/** n + 1 readings in 1..n: `copies` (>= 2) copies of one value plus distinct others, shuffled. */
function build(r: Rng, n: number, copies: number, dupValue?: number): number[] {
  const dup = dupValue ?? r.int(1, n);
  const others: number[] = [];
  for (let v = 1; v <= n; v++) if (v !== dup) others.push(v);
  const picked = r.shuffle(others).slice(0, n + 1 - copies);
  return r.shuffle([...picked, ...new Array<number>(copies).fill(dup)]);
}

/** Duplicate placed at the two last positions: the pairwise scan has to run to the end. */
function dupAtEnd(r: Rng, n: number): number[] {
  const dup = r.int(1, n);
  const others: number[] = [];
  for (let v = 1; v <= n; v++) if (v !== dup) others.push(v);
  return [...r.shuffle(others), dup, dup];
}

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(1, 8);
    return one(build(r, n, r.int(2, Math.min(n + 1, 4))));
  },
  groups: {
    basic: [
      one([1, 3, 4, 2, 2]),
      one([3, 1, 3, 4, 2]),
      one([2, 2, 2, 2, 2]),
      one([1, 1]),
      (r) => one(build(r, 9, 2)),
    ],
    edge: [
      one([2, 1, 2]),
      one([1, 2, 2]),
      one([1, 1, 1]),
      // Every reading equal.
      one(new Array<number>(8).fill(5).concat([5])),
      (r: Rng) => one(build(r, 7, 8)),
    ],
    adversarial: [
      // Sum formula breaks: many copies of the duplicate.
      (r: Rng) => one(build(r, 1000, 3)),
      (r: Rng) => one(build(r, 1000, 500)),
      (r: Rng) => one(build(r, 1000, 1001)),
      (r: Rng) => one(build(r, 1000, 2, 1000)),
      (r: Rng) => one(build(r, 1000, 2, 1)),
      (r: Rng) => one(dupAtEnd(r, 1000)),
    ],
    perf: [
      (r: Rng) => one(dupAtEnd(r, 100000)),
      (r: Rng) => one(build(r, 100000, 2)),
      (r: Rng) => one(build(r, 100000, 3)),
      (r: Rng) => one(build(r, 100000, 50000)),
    ],
  },
};
