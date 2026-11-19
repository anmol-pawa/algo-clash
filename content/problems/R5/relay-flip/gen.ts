import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const range = (n: number, start: number, step: number) => Array.from({ length: n }, (_, i) => start + i * step);
const rand = (r: Rng, n: number) => r.ints(n, -BIG, BIG);

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(0, 12);
    return [arr(r.ints(n, -9, 9)), String(r.int(1, 6))];
  },
  groups: {
    basic: [
      [arr([1, 2, 3, 4, 5]), "2"],
      [arr([1, 2, 3, 4, 5]), "3"],
      [arr([1, 2, 3, 4, 5, 6]), "3"],
      [arr([7, 8]), "1"],
      (r) => [arr(r.ints(9, -20, 20)), "4"],
    ],
    edge: [
      [arr([]), "1"],
      [arr([]), "5"],
      [arr([5]), "1"],
      [arr([5]), "2"],
      [arr([1, 2, 3]), "3"],
      [arr([1, 2, 3]), "100000"],
      [arr([-BIG, BIG, -BIG, BIG]), "2"],
      [arr([4, 4, 4, 4, 4]), "2"],
    ],
    adversarial: [
      [arr(range(500, 0, 1)), "2"],
      [arr(range(500, 0, 1)), "499"],
      [arr(range(500, 0, 1)), "500"],
      [arr(range(500, 0, 1)), "250"],
      [arr(range(501, 0, 1)), "7"],
      (r) => [arr(rand(r, 700)), "1"],
      (r) => [arr(r.ints(300, 0, 3)), "3"],
    ],
    perf: [
      [arr(range(100000, 0, 1)), "2"],
      (r) => [arr(rand(r, 100000)), "3"],
      (r) => [arr(rand(r, 100000)), "100000"],
      (r) => [arr(rand(r, 99999)), "50000"],
    ],
  },
};
