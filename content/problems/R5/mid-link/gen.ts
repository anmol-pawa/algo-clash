import type { GenModule } from "../../../../lib/content/native";

const arr = (a: number[]) => `[${a.join(",")}]`;
const BIG = 1000000000;
const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const gen: GenModule = {
  small: (r) => [arr(r.ints(r.int(0, 10), -9, 9))],
  groups: {
    basic: [[arr([1, 2, 3, 4, 5])], [arr([1, 2, 3, 4])], [arr([8])], [arr([1, 2])], (r) => [arr(r.ints(9, -30, 30))]],
    edge: [[arr([])], [arr([-BIG])], [arr([BIG, -BIG])], [arr([4, 4, 4, 4])], [arr([1, 2, 3])]],
    adversarial: [[arr(seq(999))], [arr(seq(1000))], (r) => [arr(r.ints(1001, -BIG, BIG))], (r) => [arr(r.ints(1002, 0, 1))]],
    perf: [[arr(seq(100000))], [arr(seq(99999))], (r) => [arr(r.ints(100000, -BIG, BIG))]],
  },
};
