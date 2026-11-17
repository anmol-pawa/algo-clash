import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

// A mirror built from a random first half; `middle` is the centre bead of an odd length.
const mirror = (half: number[], middle?: number): number[] => [...half, ...(middle === undefined ? [] : [middle]), ...[...half].reverse()];
// Swap two beads inside the first half: the half-sums stay equal but the order is no longer mirrored.
const swapInFront = (a: number[]): number[] => {
  const b = [...a];
  const i = 0;
  const j = Math.max(1, Math.floor(b.length / 2) - 1);
  [b[i], b[j]] = [b[j], b[i]];
  return b;
};
const bigHalf = (r: Rng, n: number) => r.ints(n, -BIG, BIG);

export const gen: GenModule = {
  small: (r) => {
    const half = r.ints(r.int(0, 4), -2, 2);
    const base = r.int(0, 1) === 1 ? mirror(half) : mirror(half, r.int(-2, 2));
    // Half of the small cases get one bead nudged so they usually stop being mirrors.
    if (base.length > 0 && r.int(0, 1) === 1) base[r.int(0, base.length - 1)] += 1;
    return [arr(base)];
  },
  groups: {
    basic: [
      [arr([1, 2, 2, 1])],
      [arr([1, 2, 3, 2, 1])],
      [arr([1, 2, 3, 1])],
      [arr([5])],
      [arr([1, 2])],
      (r: Rng) => [arr(mirror(r.ints(5, -9, 9), 0))],
    ],
    edge: [
      [arr([])],
      [arr([BIG, -BIG])],
      [arr([BIG, BIG])],
      [arr([7, 7, 7, 7, 7, 7, 7])],
      [arr([1, 1, 2])],
      [arr([-BIG, 0, -BIG])],
    ],
    adversarial: [
      // Same half-sums but wrong order, even and odd lengths.
      [arr(swapInFront(mirror([1, 2, 3, 4, 5, 6])))],
      [arr(swapInFront(mirror([1, 2, 3, 4, 5, 6], 9)))],
      // Differ only in the two beads next to the centre (a too-short half never looks there).
      [arr(mirror([1, 2, 3, 4, 5, 6, 7, 8]).map((v, i) => (i === 8 ? v + 1 : v)))],
      [arr([1, 2, 3, 3, 4, 1])],
      // Palindromic prefix, broken only at the very end.
      [arr(mirror([4, 4, 4, 4, 4, 4, 4, 4], 4).map((v, i, a) => (i === a.length - 1 ? 5 : v)))],
      (r: Rng) => [arr(mirror(bigHalf(r, 500), r.int(-BIG, BIG)))],
      (r: Rng) => [arr(mirror(bigHalf(r, 500)))],
    ],
    perf: [
      (r: Rng) => [arr(mirror(bigHalf(r, 50000)))],
      (r: Rng) => [arr(mirror(bigHalf(r, 49999), 3))],
      (r: Rng) => {
        const a = mirror(bigHalf(r, 50000));
        a[a.length - 2] += 1; // broken deep inside, so the whole list is scanned
        return [arr(a)];
      },
      [arr(seq(100000))],
    ],
  },
};
