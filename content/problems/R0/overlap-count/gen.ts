import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (text: string, pat: string): string[] => [q(text), q(pat)];
const word = (r: Rng, n: number, alphabet: string) => Array.from({ length: n }, () => alphabet[r.int(0, alphabet.length - 1)]).join("");

export const gen: GenModule = {
  small: (r) => t(word(r, r.int(0, 12), "ab"), word(r, r.int(1, 3), "ab")),
  groups: {
    basic: [t("aaaa", "aa"), t("abcabc", "bc"), t("abc", "d"), t("ab", "abc"), (r) => t(word(r, 30, "abc"), word(r, 2, "abc"))],
    edge: [t("", "a"), t("a", "a"), t("abab", "abab"), t("abab", "ab"), t("aaa", "aaaa"), t("xyzxyz", "z")],
    adversarial: [(r) => t(word(r, 300, "ab"), word(r, 3, "ab")), t("ab".repeat(100), "aba"), t("a".repeat(200) + "b", "a".repeat(5) + "b")],
    perf: [t("a".repeat(200000), "a"), t("a".repeat(200000), "a".repeat(50)), t("ab".repeat(100000), "aba"), (r) => t(word(r, 200000, "ab"), "abba")],
  },
};
