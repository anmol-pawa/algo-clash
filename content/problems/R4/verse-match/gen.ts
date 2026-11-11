import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const LET = "abcdefghijklmnopqrstuvwxyz";
const encPat = (p: string) => `"${p}"`;
const encWords = (w: string[]) => `[${w.map((x) => `"${x}"`).join(",")}]`;
const t = (p: string, w: string[]): string[] => [encPat(p), encWords(w)];
/** n distinct short words (1-3 letters over a tiny alphabet, so repeats of text are easy to avoid or force). */
const vocab = (r: Rng, k: number): string[] => {
  const seen = new Set<string>();
  while (seen.size < k) seen.add(Array.from({ length: r.int(1, 3) }, () => LET[r.int(0, 3)]).join("") + LET[4 + (seen.size % 7)]);
  return [...seen];
};
/** A consistent poem for `p`, then optionally broken at a random line. */
const poem = (r: Rng, p: string, breakMode: number): string[] => {
  const letters = [...new Set(p)];
  const words = vocab(r, Math.max(letters.length, 1) + 2);
  const pick = r.shuffle(words);
  const m = new Map(letters.map((c, i) => [c, pick[i]]));
  const out = [...p].map((c) => m.get(c)!);
  if (out.length > 0 && breakMode > 0) {
    const i = r.int(0, out.length - 1);
    // 1: break the forward direction (same letter, new word); 2: collapse two letters onto one word.
    out[i] = breakMode === 1 ? pick[letters.length] : out[r.int(0, out.length - 1)];
  }
  return out;
};
const pat = (r: Rng, n: number, k: number) => Array.from({ length: n }, () => LET[r.int(0, k - 1)]).join("");

export const gen: GenModule = {
  small: (r) => {
    const p = pat(r, r.int(0, 8), r.int(1, 4));
    const w = poem(r, p, r.int(0, 2));
    // Occasionally make the lengths differ.
    if (r.int(0, 3) === 0 && w.length > 0) w.pop();
    else if (r.int(0, 5) === 0) w.push("zz");
    return t(p, w);
  },
  groups: {
    basic: [t("abba", ["sun", "moon", "moon", "sun"]), t("abba", ["sun", "moon", "moon", "star"]), t("abc", ["x", "x"]), t("", ["a"]), (r) => t("abcabc", poem(r, "abcabc", 0))],
    edge: [t("", []), t("a", []), t("a", ["q"]), t("aa", ["q", "r"]), t("ab", ["q", "q"]), t("aaaa", ["q", "q", "q"]), t("ab", ["q", "r", "s", "t"]), t("abab", ["q", "r", "q", "q"])],
    adversarial: [
      (r) => { const p = pat(r, 300, 26); return t(p, poem(r, p, 1)); },
      (r) => { const p = pat(r, 300, 26); return t(p, poem(r, p, 2)); },
      (r) => { const p = pat(r, 300, 3); return t(p, poem(r, p, 0)); },
      t("a".repeat(100), Array(99).fill("w").concat(["v"])),
    ],
    perf: [
      (r) => { const p = pat(r, 100000, 26); return t(p, poem(r, p, 0)); },
      (r) => { const p = pat(r, 100000, 26); const w = poem(r, p, 0); w[99999] = "zzzz"; return t(p, w); },
      (r) => { const p = "a".repeat(100000); return t(p, Array(100000).fill("abcdefghij")); },
      (r) => { const p = pat(r, 100000, 2); return t(p, poem(r, p, 0).slice(0, 99998)); },
    ],
  },
};
