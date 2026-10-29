import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const letters = (r: Rng, n: number, alphabet: number) => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alphabet - 1))).join("");

export const gen: GenModule = {
  small: (r) => [q(letters(r, r.int(0, 12), r.int(1, 5))), String(r.int(1, 4))],
  groups: {
    basic: [[q("eceba"), "2"], [q("aaaa"), "1"], [q("abc"), "5"], [q("abaccc"), "2"], (r) => [q(letters(r, 20, 4)), "2"]],
    edge: [[q(""), "1"], [q("a"), "1"], [q("ab"), "1"], [q("abcdefghijklmnopqrstuvwxyz"), "26"], [q("abcdefghijklmnopqrstuvwxyz"), "25"], [q("aabbcc"), "3"]],
    adversarial: [
      [q("abcabcabcabc"), "2"],
      [q("aaaaabbbbbcccccdddd"), "2"],
      (r) => [q(letters(r, 300, 26)), String(r.int(1, 26))],
      (r) => [q(letters(r, 300, 3)), "2"],
    ],
    perf: [
      (r) => [q(letters(r, 100000, 26)), "26"],
      (r) => [q(letters(r, 100000, 26)), "13"],
      [q("a".repeat(100000)), "1"],
      (r) => [q(letters(r, 100000, 2)), "2"],
    ],
  },
};
