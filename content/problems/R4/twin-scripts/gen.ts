import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (a: string, b: string): string[] => [q(a), q(b)];
const ALPHA = "abcdefghijklmnopqrstuvwxyz0123456789";
const word = (r: Rng, n: number, k: number) => Array.from({ length: n }, () => ALPHA[r.int(0, k - 1)]).join("");
/** A true twin of `s`: a random injective renaming. */
const twin = (r: Rng, s: string) => {
  const syms = [...new Set(s)];
  const targets = r.shuffle(ALPHA.split("")).slice(0, syms.length);
  const m = new Map(syms.map((c, i) => [c, targets[i]]));
  return [...s].map((c) => m.get(c)!).join("");
};
/** A near twin: a twin with one position changed. */
const near = (r: Rng, s: string) => {
  const b = twin(r, s);
  if (b.length === 0) return b;
  const i = r.int(0, b.length - 1);
  const c = ALPHA[r.int(0, 35)];
  return b.slice(0, i) + c + b.slice(i + 1);
};
const pair = (r: Rng, n: number, k: number, match: boolean): string[] => {
  const a = word(r, n, k);
  return t(a, match ? twin(r, a) : near(r, a));
};

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(0, 8);
    const k = r.int(1, 4);
    const m = r.int(0, 2);
    return m === 0 ? pair(r, n, k, true) : m === 1 ? pair(r, n, k, false) : t(word(r, n, k), word(r, n, k));
  },
  groups: {
    basic: [t("paper", "title"), t("foo", "bar"), t("ab", "cc"), t("egg", "add"), (r) => pair(r, 20, 6, true)],
    edge: [t("", ""), t("a", "a"), t("a", "b"), t("aa", "bb"), t("ab", "aa"), t("ab", "ba"), t("12", "ab"), t("abab", "cdcd"), t("abab", "cccc")],
    adversarial: [(r) => pair(r, 300, 2, true), (r) => pair(r, 300, 36, false), (r) => pair(r, 36, 36, true), t("ab".repeat(100), "xy".repeat(99) + "xx")],
    perf: [(r) => pair(r, 100000, 36, true), (r) => pair(r, 100000, 36, false), (r) => pair(r, 100000, 2, true), t("a".repeat(100000), "b".repeat(99999) + "c")],
  },
};
