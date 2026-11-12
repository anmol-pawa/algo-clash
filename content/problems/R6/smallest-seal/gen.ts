import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const digits = (r: Rng, n: number, alpha = 10) => Array.from({ length: n }, () => String(r.int(0, alpha - 1))).join("");
const rep = (t: string, n: number) => t.repeat(n);

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(0, 10);
    return [q(digits(r, n, r.pick([2, 3, 10]))), String(n === 0 ? 0 : r.int(0, n))];
  },
  groups: {
    basic: [
      [q("4132"), "1"],
      [q("10200"), "1"],
      [q("9"), "1"],
      [q("12345"), "2"],
      (r) => [q(digits(r, 10)), "3"],
      [q("1432219"), "3"],
    ],
    edge: [
      [q(""), "0"],
      [q("0"), "0"],
      [q("0"), "1"],
      [q("100"), "1"],
      [q("100"), "2"],
      [q("10"), "2"],
      [q("1000000"), "3"],
      [q("112"), "1"],
      [q("54321"), "0"],
      [q("54321"), "4"],
      [q("0000"), "2"],
    ],
    adversarial: [
      [q("1" + rep("0", 600) + "7"), "1"],
      [q(rep("9", 500) + rep("1", 500)), "500"],
      [q(rep("1", 400) + rep("2", 400)), "300"],
      (r) => [q(digits(r, 800, 2)), String(r.int(0, 800))],
      (r) => [q(digits(r, 800)), String(r.int(300, 800))],
      [q(rep("98", 400)), "401"],
    ],
    perf: [
      [q(rep("9", 50000) + rep("1", 50000)), "50000"],
      [q(rep("98", 50000)), "50000"],
      [q(rep("9", 99999) + "1"), "99999"],
      (r) => [q(digits(r, 100000)), "60000"],
      [q(Array.from({ length: 100000 }, (_, i) => String(9 - (Math.floor(i / 10000) % 10))).join("")), "70000"],
      (r) => [q("1" + digits(r, 99999, 3)), "40000"],
    ],
  },
};
