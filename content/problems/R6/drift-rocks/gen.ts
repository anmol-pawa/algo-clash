import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const signed = (r: Rng, n: number, maxSize: number, pRight = 0.5) =>
  Array.from({ length: n }, () => (r.next() < pRight ? 1 : -1) * r.int(1, maxSize));
const range = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => f(i));

export const gen: GenModule = {
  small: (r) => [arr(signed(r, r.int(0, 9), r.pick([3, 6, 10]), r.pick([0.3, 0.5, 0.7])))],
  groups: {
    basic: [
      [arr([4, 7, -3])],
      [arr([5, -5, 2])],
      [arr([3, 2, -9, 6])],
      [arr([-2, -4, 8, 1])],
      (r) => [arr(signed(r, 12, 9))],
      [arr([10, 2, -5, 3, -20])],
    ],
    edge: [
      [arr([])],
      [arr([1])],
      [arr([-1])],
      [arr([1, -1])],
      [arr([-1, 1])],
      [arr([1000000000, -1000000000])],
      [arr([1, 1, 1, -1, -1, -1])],
      [arr([2, 2, -3, -3])],
    ],
    adversarial: [
      [arr([...range(500, (i) => i + 1), -1000, ...range(10, (i) => i + 1)])],
      [arr(range(1000, (i) => (i % 2 === 0 ? 1 : -1) * (i + 1)))],
      [arr(range(1000, (i) => (i < 500 ? 1000000000 - i : -(1000000000 - (999 - i)))))],
      (r) => [arr(signed(r, 600, 4, 0.6))],
      (r) => [arr(signed(r, 600, 1000000000, 0.5))],
      [arr([...range(300, () => 7), ...range(300, () => -7)])],
    ],
    perf: [
      [arr([...range(50000, (i) => i + 1), ...range(50000, (i) => -(i + 50001))])],
      [arr([...range(99999, (i) => 99999 - i), -100000])],
      [arr([...range(50000, () => -1), ...range(50000, () => 1)])],
      (r) => [arr(signed(r, 100000, 1000000000))],
      (r) => [arr(signed(r, 100000, 3, 0.55))],
      [arr(range(100000, (i) => (i % 2 === 0 ? 1 : -1) * 5))],
    ],
  },
};
