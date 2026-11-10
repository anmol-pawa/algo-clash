import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (a: string, b: string): string[] => [q(a), q(b)];
const word = (r: Rng, n: number, alphabet: number) => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alphabet - 1))).join("");
const scramble = (r: Rng, s: string) => r.shuffle(s.split("")).join("");
/** Same multiset, or the same multiset with one letter changed. */
const pair = (r: Rng, n: number, alphabet: number, match: boolean): string[] => {
  const a = word(r, n, alphabet);
  let b = scramble(r, a);
  if (!match && n > 0) {
    const i = r.int(0, n - 1);
    b = b.slice(0, i) + String.fromCharCode(97 + ((b.charCodeAt(i) - 97 + 1) % alphabet)) + b.slice(i + 1);
  }
  return t(a, b);
};

export const gen: GenModule = {
  small: (r) => (r.int(0, 1) === 0 ? pair(r, r.int(0, 8), 3, r.int(0, 1) === 0) : t(word(r, r.int(0, 6), 3), word(r, r.int(0, 6), 3))),
  groups: {
    basic: [t("listen", "silent"), t("aab", "abb"), t("abc", "cab"), t("rat", "car"), (r) => pair(r, 20, 5, true)],
    edge: [t("", ""), t("a", "a"), t("a", "b"), t("a", ""), t("ad", "bc"), t("aab", "ab"), t("ab", "aab")],
    adversarial: [(r) => pair(r, 300, 2, true), (r) => pair(r, 300, 2, false), (r) => pair(r, 300, 26, false), t("ab".repeat(100), "ba".repeat(100) + "a")],
    perf: [(r) => pair(r, 100000, 26, true), (r) => pair(r, 100000, 26, false), (r) => pair(r, 100000, 2, true), t("a".repeat(100000), "a".repeat(99999) + "b")],
  },
};
