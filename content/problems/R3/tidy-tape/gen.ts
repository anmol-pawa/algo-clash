import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const letters = (r: Rng, n: number, alphabet: number) => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alphabet - 1))).join("");

export const gen: GenModule = {
  small: (r) => [q(letters(r, r.int(0, 14), r.int(1, 4))), String(r.int(1, 4))],
  groups: {
    basic: [[q("abcabcbb"), "1"], [q("aabaabaa"), "2"], [q("zzzz"), "10"], [q("pwwkew"), "1"], (r) => [q(letters(r, 20, 3)), "2"]],
    edge: [[q(""), "1"], [q("a"), "1"], [q("aa"), "1"], [q("abcdefghijklmnopqrstuvwxyz"), "1"], [q("aaaaa"), "3"], [q("abab"), "2"], [q("abab"), "1"]],
    adversarial: [
      [q("aabbaabbaabb"), "2"],
      [q("abcabcabcabc"), "2"],
      (r) => [q(letters(r, 300, 26)), String(r.int(1, 4))],
      (r) => [q(letters(r, 300, 2)), String(r.int(1, 10))],
      (r) => [q(letters(r, 300, 5)), "3"],
    ],
    perf: [
      [q("a".repeat(100000)), "100000"],
      [q("a".repeat(100000)), "50000"],
      (r) => [q(letters(r, 100000, 26)), "1"],
      (r) => [q(letters(r, 100000, 2)), "30000"],
      (r) => [q(letters(r, 100000, 3)), "20000"],
    ],
  },
};
