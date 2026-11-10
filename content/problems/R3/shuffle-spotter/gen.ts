import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const letters = (r: Rng, n: number, alphabet: number) => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alphabet - 1))).join("");
/** Banner built from shuffled copies of the word glued to noise, so real matches exist. */
const planted = (r: Rng, word: string, pieces: number, alphabet: number) => {
  let s = "";
  for (let i = 0; i < pieces; ++i) {
    s += r.int(0, 2) === 0 ? letters(r, r.int(0, 3), alphabet) : r.shuffle(word.split("")).join("");
  }
  return s;
};

export const gen: GenModule = {
  small: (r) => {
    const word = letters(r, r.int(1, 4), r.int(1, 3));
    return [q(planted(r, word, r.int(0, 5), 3)), q(word)];
  },
  groups: {
    basic: [[q("cbaebabacd"), q("abc")], [q("aaaa"), q("aa")], [q("xyz"), q("abcd")], (r) => [q(letters(r, 24, 3)), q("abca")]],
    edge: [[q(""), q("a")], [q("a"), q("a")], [q("a"), q("b")], [q("ab"), q("ba")], [q("abab"), q("ab")], [q("aab"), q("aab")], [q("abc"), q("abcd")], [q("zzzz"), q("z")]],
    adversarial: [
      (r) => [q(letters(r, 300, 2)), q(letters(r, 6, 2))],
      (r) => {
        const word = letters(r, 9, 3);
        return [q(planted(r, word, 40, 3)), q(word)];
      },
      [q("ab".repeat(150)), q("aabb")],
      [q("ab".repeat(150)), q("ba")],
      (r) => [q(letters(r, 300, 26)), q(letters(r, 2, 26))],
    ],
    perf: [
      [q("a".repeat(100000)), q("a".repeat(50000))],
      (r) => [q(letters(r, 100000, 2)), q(letters(r, 40000, 2))],
      (r) => {
        const word = letters(r, 20000, 4);
        return [q(planted(r, word, 5, 4).padEnd(100000, "a").slice(0, 100000)), q(word)];
      },
      (r) => [q(letters(r, 100000, 26)), q(letters(r, 3, 26))],
    ],
  },
};
