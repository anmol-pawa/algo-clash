import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const input = (depot: number, start: number[], speed: number[]): string[] => [String(depot), arr(start), arr(speed)];

/** n distinct starts in [0, depot - 1]. */
const starts = (r: Rng, n: number, depot: number): number[] => {
  if (depot <= 4 * n) return r.shuffle(Array.from({ length: depot }, (_, i) => i)).slice(0, n);
  const seen = new Set<number>();
  while (seen.size < n) seen.add(r.int(0, depot - 1));
  return r.shuffle([...seen]);
};
const random = (r: Rng, n: number, depot: number, maxSpeed: number): string[] =>
  input(depot, starts(r, n, depot), r.ints(n, 1, maxSpeed));
/** Trains whose empty-track times are all within about 10^-9 of each other, so float rounding and ties matter. */
const nearTies = (r: Rng, n: number): string[] => {
  const depot = 1000000000;
  const speed = Array.from({ length: n }, (_, i) => 999999 - i);
  const dist = speed.map((v) => 1000 * v + r.int(-1, 1));
  return input(depot, dist.map((d) => depot - d), speed);
};
/** Exactly equal arrival times: dist = t * speed. */
const exactTies = (r: Rng, n: number): string[] => {
  const depot = 1000000;
  const speed = r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
  const t = 840;
  return input(depot, speed.map((v) => depot - t * v), speed);
};

export const gen: GenModule = {
  small: (r) => {
    const depot = r.int(1, 14);
    const n = r.int(0, Math.min(depot, 7));
    return random(r, n, depot, r.pick([2, 4, 9]));
  },
  groups: {
    basic: [
      input(20, [0, 4, 9, 13, 16], [5, 2, 3, 1, 4]),
      input(10, [2, 6], [4, 1]),
      input(12, [6, 0], [1, 2]),
      input(100, [50], [3]),
      (r) => random(r, 12, 60, 6),
    ],
    edge: [
      input(5, [], []),
      input(1, [0], [1]),
      input(10, [0, 1, 2, 3], [4, 3, 2, 1]),
      input(10, [3, 2, 1, 0], [1, 2, 3, 4]),
      input(10, [9, 0], [1000000, 1000000]),
      input(1000000000, [0, 999999999], [1000000, 1]),
      (r) => exactTies(r, 8),
    ],
    adversarial: [
      (r) => nearTies(r, 400),
      (r) => exactTies(r, 400),
      (r) => random(r, 500, 1000000000, 1000000),
      (r) => random(r, 500, 2000, 3),
      () => input(1000000000, Array.from({ length: 300 }, (_, i) => i), Array.from({ length: 300 }, (_, i) => 1000000 - i)),
    ],
    perf: [
      (r) => nearTies(r, 1000),
      (r) => random(r, 100000, 1000000000, 1000000),
      (r) => random(r, 100000, 200000, 5),
      () => input(1000000000, Array.from({ length: 100000 }, (_, i) => i), Array.from({ length: 100000 }, (_, i) => 100000 - i)),
      () => input(1000000000, Array.from({ length: 100000 }, (_, i) => i), Array.from({ length: 100000 }, (_, i) => i + 1)),
    ],
  },
};
