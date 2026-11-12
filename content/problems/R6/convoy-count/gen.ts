import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;

/** n distinct positions in [0, target-1] spaced by `step`, then shuffled into input order. */
function spaced(r: Rng, n: number, step: number): number[] {
  return r.shuffle(Array.from({ length: n }, (_, i) => i * step));
}

/** Build a case where truck order along the road is `ordered` (front to back) with the given speeds. */
function build(r: Rng, target: number, n: number, speedAt: (rank: number, n: number) => number): string[] {
  const step = Math.floor((target - 1) / n);
  // rank 0 = front truck (largest position)
  const pos = Array.from({ length: n }, (_, k) => (n - 1 - k) * step);
  const spd = Array.from({ length: n }, (_, k) => speedAt(k, n));
  const idx = r.shuffle(Array.from({ length: n }, (_, i) => i));
  return [String(target), arr(idx.map((i) => pos[i])), arr(idx.map((i) => spd[i]))];
}

export const gen: GenModule = {
  small: (r) => {
    const target = r.int(2, 14);
    const n = r.int(0, Math.min(target, 7));
    const pos = r.shuffle(Array.from({ length: target }, (_, i) => i)).slice(0, n);
    return [String(target), arr(pos), arr(r.ints(n, 1, 4))];
  },
  groups: {
    basic: [
      ["30", arr([4, 10, 16, 22]), arr([5, 3, 2, 1])],
      ["30", arr([4, 10, 16]), arr([1, 2, 3])],
      ["10", arr([5, 0]), arr([1, 2])],
      ["20", arr([6, 2, 10]), arr([2, 2, 2])],
      ["50", arr([40, 10, 30, 0, 20]), arr([1, 8, 3, 9, 2])],
      (r) => {
        const target = 60;
        const pos = r.shuffle(Array.from({ length: 59 }, (_, i) => i)).slice(0, 9);
        return [String(target), arr(pos), arr(r.ints(9, 1, 9))];
      },
    ],
    edge: [
      ["5", arr([]), arr([])],
      ["1", arr([0]), arr([1])],
      ["1000000000", arr([0]), arr([1000000000])],
      ["1000000000", arr([0, 999999999]), arr([1000000000, 1])],
      ["1000000000", arr([999999999, 0]), arr([1, 1000000000])],
      ["1000000000", arr([1, 0]), arr([1000000000, 999999999])],
      ["7", arr([0, 1, 2, 3, 4, 5, 6]), arr([7, 6, 5, 4, 3, 2, 1])],
    ],
    adversarial: [
      (r) => build(r, 1000000000, 1000, () => 1),
      (r) => build(r, 1000000000, 1000, (k, n) => n - k),
      (r) => build(r, 1000000000, 1000, (k) => 1000000000 - k),
      (r) => build(r, 1000000000, 1000, (k) => 1 + 999999 * k),
      (r) => {
        // random, big values: catches int overflow in the cross-multiplication
        const n = 800;
        return ["1000000000", arr(spaced(r, n, 1000000)), arr(r.ints(n, 1, 1000000000))];
      },
      (r) => {
        // lots of exact ties at the depot: speed proportional to remaining distance
        const n = 500;
        const target = 1000000;
        const pos = spaced(r, n, 1000);
        return [String(target), arr(pos), arr(pos.map((p) => (target - p) / 1000))];
      },
    ],
    perf: [
      (r) => build(r, 1000000000, 100000, () => 1), // nobody merges: every pair is compared by the quadratic scan
      (r) => build(r, 1000000000, 100000, (k, n) => n - k), // slower trucks further back: everyone is a separate convoy
      (r) => ["1000000000", arr(spaced(r, 100000, 9000)), arr(r.ints(100000, 1, 1000000000))],
      (r) => ["1000000000", arr(spaced(r, 100000, 9000)), arr(r.ints(100000, 1, 5))],
      (r) => build(r, 1000000000, 100000, (k) => 1 + k),
    ],
  },
};
