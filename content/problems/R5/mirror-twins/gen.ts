import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

// One line: [[val, shortcutIndex|null], ...]
const chain = (vals: number[], to: (number | null)[]) => [`[${vals.map((v, i) => `[${v},${to[i]}]`).join(",")}]`];
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const fill = <T,>(n: number, v: T) => Array.from({ length: n }, () => v);
const randomTargets = (r: Rng, n: number, pNull: number) =>
  Array.from({ length: n }, () => (r.int(0, 99) < pNull ? null : r.int(0, n - 1)));

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(0, 8);
    return chain(r.ints(n, -2, 2), randomTargets(r, n, 30));
  },
  groups: {
    basic: [
      chain([7, 13, 11, 10, 1], [null, 0, 4, 2, 0]),
      chain([1, 2], [1, 1]),
      chain([3, 3, 3], [null, null, null]),
      chain([5, 6, 7], [2, 0, 1]),
      (r) => chain(r.ints(8, -20, 20), randomTargets(r, 8, 25)),
    ],
    edge: [
      chain([], []),
      chain([9], [null]),
      chain([9], [0]),
      chain([-BIG, BIG], [0, 1]),
      chain([1, 2, 3], [null, null, 0]),
      chain([1, 2, 3], [2, null, null]),
    ],
    adversarial: [
      // Equal values everywhere: only node identity separates the lanterns.
      chain(fill(10, 7), [3, 0, 9, null, 5, 5, 1, 8, 2, 4]),
      (r) => chain(fill(40, 4), randomTargets(r, 40, 10)),
      // Every shortcut points at the first or at the last node.
      chain(seq(1000), seq(1000).map((_, i) => (i % 2 ? 0 : 999))),
      // Every node points at itself; every node points at its successor (the last at itself).
      chain(seq(500), seq(500).map((_, i) => i)),
      chain(seq(500), seq(500).map((_, i) => Math.min(i + 1, 499))),
      (r) => chain(r.ints(900, -50, 50), randomTargets(r, 900, 20)),
      (r) => chain(r.ints(900, 0, 1), randomTargets(r, 900, 0)),
    ],
    perf: [
      (r) => chain(r.ints(100000, -BIG, BIG), randomTargets(r, 100000, 10)),
      chain(seq(100000), seq(100000).map((_, i) => 99999 - i)),
      chain(fill(100000, 1), seq(100000).map((_, i) => (i === 0 ? null : 0))),
      (r) => chain(r.ints(100000, 0, 3), randomTargets(r, 100000, 0)),
    ],
  },
};
