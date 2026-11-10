import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const ABC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
/** n letters drawn from the first `alphabet` symbols of a mixed-case alphabet (a, A, b, B, ...). */
const mixed = (alphabet: number) => Array.from({ length: alphabet }, (_, i) => (i % 2 === 0 ? ABC[i / 2] : ABC[26 + (i - 1) / 2]));
const letters = (r: Rng, n: number, alphabet: number) => {
  const pool = mixed(alphabet);
  return Array.from({ length: n }, () => pool[r.int(0, pool.length - 1)]).join("");
};

export const gen: GenModule = {
  small: (r) => {
    const alphabet = r.int(1, 4);
    return [q(letters(r, r.int(0, 12), alphabet)), q(letters(r, r.int(1, 4), alphabet))];
  },
  groups: {
    basic: [
      [q("xaybzacb"), q("abc")],
      [q("aab"), q("ab")],
      [q("abca"), q("aa")],
      [q("xyz"), q("w")],
      (r) => [q(letters(r, 24, 4)), q(letters(r, 3, 4))],
    ],
    edge: [
      [q(""), q("a")],
      [q("a"), q("a")],
      [q("a"), q("b")],
      [q("a"), q("aa")],
      [q("aA"), q("Aa")],
      [q("aAaA"), q("AA")],
      [q("abab"), q("ba")],
      [q("zzzz"), q("zzzz")],
      [q("zzzz"), q("zzzzz")],
    ],
    adversarial: [
      (r) => [q(letters(r, 300, 3)), q(letters(r, 6, 3))],
      (r) => [q(letters(r, 300, 10)), q(letters(r, 12, 10))],
      (r) => [q(letters(r, 300, 52)), q(letters(r, 3, 52))],
      [q("ab".repeat(150)), q("bbbaaa")],
      // two equally short covers: the leftmost must win
      [q("abxxbaxx".repeat(30)), q("ab")],
    ],
    perf: [
      // the last letter needed appears only at the very end: every start scans to the end
      [q("a".repeat(99999) + "b"), q("ab")],
      (r) => [q(letters(r, 100000, 2)), q(letters(r, 30000, 2))],
      (r) => [q(letters(r, 100000, 52)), q(letters(r, 6, 52))],
      [q("a".repeat(100000)), q("a".repeat(100000))],
      (r) => [q(letters(r, 100000, 26)), q(letters(r, 100000, 26))],
    ],
  },
};
