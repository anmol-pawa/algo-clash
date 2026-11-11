import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (xs: string[]): string => `[${xs.map((x) => `"${x}"`).join(",")}]`;
const t = (text: string, words: string[]): string[] => [`"${text}"`, arr(words)];
const rnd = (r: Rng, n: number, alpha: number): string => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alpha - 1))).join("");
/** `k` random words of length `w` over a small alphabet (so duplicates are common). */
const wordsOf = (r: Rng, k: number, w: number, alpha: number): string[] => Array.from({ length: k }, () => rnd(r, w, alpha));
/** Text built by gluing shuffled chains of `words` at random offsets between random filler. */
const withChains = (r: Rng, n: number, words: string[], chains: number, alpha: number): string => {
  let out = "";
  for (let c = 0; c < chains && out.length < n; ++c) {
    out += rnd(r, r.int(0, 3), alpha) + r.shuffle(words).join("");
  }
  while (out.length < n) out += rnd(r, 1, alpha);
  return out.slice(0, n);
};

export const gen: GenModule = {
  small: (r) => {
    const w = r.int(1, 3);
    const words = wordsOf(r, r.int(1, 4), w, r.int(1, 2));
    return t(r.int(0, 1) ? withChains(r, r.int(0, 20), words, 3, 2) : rnd(r, r.int(1, 20), 2), words);
  },
  groups: {
    basic: [
      t("xabcdabcdy", ["ab", "cd"]),
      t("aaaaaa", ["aa", "aa"]),
      t("abbaab", ["ab", "ba"]),
      t("abc", ["abcd"]),
      t("barfoothefoobarman", ["foo", "bar"]),
      t("wordgoodgoodgoodbestword", ["word", "good", "best", "word"]),
    ],
    edge: [
      t("a", ["a"]),
      t("a", ["aa"]),
      t("ab", ["a", "b"]),
      t("aaa", ["a", "a", "a"]),
      t("aaa", ["a", "a", "a", "a"]),
      t("abab", ["ab", "ab"]),
      t("zzzzzzzzzz", ["zz", "zz", "zz", "zz", "zz"]),
      t("abcabc", ["abc", "abc"]),
      t("abcabcabc", ["abc", "bca", "cab"]),
    ],
    adversarial: [
      // Repeated words: a set instead of a multiset fails here.
      (r) => { const w = ["ab", "ab", "cd"]; return t(withChains(r, 300, w, 40, 4), w); },
      (r) => { const w = wordsOf(r, 5, 3, 2); return t(withChains(r, 300, w, 40, 2), w); },
      (r) => { const w = wordsOf(r, 6, 4, 2); return t(withChains(r, 400, w, 60, 2), w); },
      // Odd alignments: a chain that starts at a position not divisible by w.
      (r) => { const w = wordsOf(r, 4, 5, 3); return t("q" + withChains(r, 300, w, 40, 3), w); },
      (r) => t("a".repeat(300), ["a".repeat(7), "a".repeat(7), "a".repeat(7)]),
      (r) => { const w = wordsOf(r, 8, 2, 3); return t(rnd(r, 300, 3), w); },
      (r) => { const w = wordsOf(r, 10, 6, 2); return t(withChains(r, 500, w, 20, 2), w); },
    ],
    perf: [
      // Every start matches: rebuilding the window per start costs 1e9+ lookups.
      () => t("a".repeat(100000), Array.from({ length: 20000 }, () => "aa")),
      () => t("ab".repeat(50000), Array.from({ length: 10000 }, () => "ab")),
      (r) => { const w = wordsOf(r, 5000, 10, 2); return t(withChains(r, 100000, w, 3, 2), w); },
      (r) => t(rnd(r, 100000, 2), wordsOf(r, 4000, 8, 2)),
      (r) => { const w = wordsOf(r, 1000, 30, 3); return t(withChains(r, 100000, w, 3, 3), w); },
      () => t("abc".repeat(33333) + "a", Array.from({ length: 15000 }, (_, i) => (i % 2 ? "abc" : "bca"))),
    ],
  },
};
