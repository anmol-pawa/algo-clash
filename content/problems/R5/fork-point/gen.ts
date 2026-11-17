import type { GenModule } from "../../../../lib/content/native";

// First list: [values]. Second list: [own values]^i, whose tail links to index i of the first list
// (^-1: the lists never join; i must be -1 when the first list is empty).
const pair = (a: number[], b: number[], i: number) => [`[${a.join(",")}]`, `[${b.join(",")}]^${i}`];
const BIG = 1000000000;
const seq = (n: number, from = 1) => Array.from({ length: n }, (_, k) => k + from);
const fill = (n: number, v: number) => Array.from({ length: n }, () => v);

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(0, 8);
    const m = r.int(0, 6);
    const i = n === 0 || r.int(0, 3) === 0 ? -1 : r.int(0, n - 1);
    return pair(r.ints(n, -2, 2), r.ints(m, -2, 2), i);
  },
  groups: {
    basic: [
      [...pair([4, 1, 8, 4, 5], [5, 6, 1], 2)],
      [...pair([1, 2], [3], -1)],
      [...pair([7, 7, 7], [], 0)],
      [...pair([2, 6, 4], [1, 5], -1)],
      (r) => pair(r.ints(8, -20, 20), r.ints(4, -20, 20), r.int(0, 7)),
    ],
    edge: [
      [...pair([], [], -1)],
      [...pair([], [1, 2], -1)],
      [...pair([5], [], 0)],
      [...pair([5], [5], 0)],
      [...pair([5], [5], -1)],
      [...pair([1, 2, 3], [9], 2)],
      [...pair([BIG, -BIG], [-BIG, BIG], 1)],
      // Second chain owns many nodes and joins at the very head of the first.
      [...pair([3, 3], [3, 3, 3, 3], 0)],
    ],
    adversarial: [
      // Equal values everywhere: only node identity tells the fork apart.
      [...pair(fill(10, 7), fill(6, 7), 4)],
      [...pair(fill(10, 7), fill(6, 7), -1)],
      // Different prefix lengths in both directions, fork at different depths.
      [...pair(seq(1000), seq(3, 5000), 997)],
      [...pair(seq(3), seq(1000, 5000), 1)],
      [...pair(seq(1000), seq(1000, 5000), 500)],
      // Same prefix lengths: the walkers meet during the first pass.
      [...pair(seq(500), seq(500, 5000), 250)],
      // Joined at the last node, and disjoint with equal lengths.
      [...pair(seq(1000), seq(7, 9000), 999)],
      [...pair(seq(500), seq(500, 5000), -1)],
      (r) => pair(r.ints(900, 0, 1), r.ints(r.int(0, 900), 0, 1), r.int(0, 899)),
    ],
    perf: [
      [...pair(seq(100000), seq(1, 200000), 99999)],
      [...pair(seq(100000), [], 0)],
      [...pair(seq(100000), seq(99999, 200000), 50000)],
      [...pair(seq(100000), seq(100000, 200000), -1)],
      (r) => pair(r.ints(100000, -BIG, BIG), r.ints(30000, -BIG, BIG), r.int(0, 99999)),
    ],
  },
};
