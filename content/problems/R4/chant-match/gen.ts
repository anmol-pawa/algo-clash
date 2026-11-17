import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (p: string, s: string): string[] => [q(p), q(s)];
const LETTERS = "abcdefghijklmnopqrstuvwxyz";
/** `k` distinct words of 1..len letters (distinct so a perfect pairing exists). */
const vocab = (r: Rng, k: number, len: number): string[] => {
  const seen = new Set<string>();
  while (seen.size < k) seen.add(Array.from({ length: r.int(1, len) }, () => LETTERS[r.int(0, 3)]).join("") + seen.size.toString(36));
  return [...seen];
};
/** A matching pair: pattern over `k` letters, sentence from an injective letter -> word map. */
const good = (r: Rng, n: number, k: number, wlen = 3): [string, string[]] => {
  const letters = r.shuffle(LETTERS.split("")).slice(0, k);
  const words = vocab(r, k, wlen);
  const idx = Array.from({ length: n }, (_, i) => (i < k ? i : r.int(0, k - 1)));
  const order = r.shuffle(idx);
  return [order.map((i) => letters[i]).join(""), order.map((i) => words[i])];
};
/** Break a matching pair in one of three ways. */
const broken = (r: Rng, p: string, w: string[]): [string, string[]] => {
  const m = r.int(0, 2);
  const ws = [...w];
  const i = r.int(0, ws.length - 1);
  if (m === 0) ws[i] = ws[r.int(0, ws.length - 1)] === ws[i] ? ws[i] + "z" : ws[r.int(0, ws.length - 1)];
  else if (m === 1) ws.pop();
  else return [p + "a", ws];
  return [p, ws];
};
const pair = (r: Rng, n: number, k: number, ok: boolean): string[] => {
  const [p, w] = good(r, n, k);
  const [bp, bw] = ok ? [p, w] : broken(r, p, w);
  return t(bp, bw.join(" "));
};

export const gen: GenModule = {
  small: (r) => {
    const n = r.int(1, 7);
    return pair(r, n, r.int(1, Math.min(n, 4)), r.int(0, 1) === 0);
  },
  groups: {
    basic: [t("abba", "ox hen hen ox"), t("abba", "ox hen hen cat"), t("ab", "ox ox"), t("aaa", "ox ox"), (r) => pair(r, 12, 4, true)],
    edge: [t("a", "x"), t("a", "x y"), t("ab", "x"), t("ab", "x y"), t("aa", "x y"), t("ab", "x x"), t("abc", "x y x"), t("zzzz", "go go go go"), t("abab", "ox ox ox ox")],
    adversarial: [(r) => pair(r, 200, 26, true), (r) => pair(r, 200, 26, false), (r) => pair(r, 150, 2, true), t("ab".repeat(100), "up down ".repeat(99) + "up up")],
    perf: [(r) => pair(r, 45000, 26, true), (r) => pair(r, 45000, 26, true), (r) => pair(r, 45000, 3, true), () => t("a".repeat(50000), Array(50000).fill("w").join(" ")), (r) => pair(r, 45000, 26, false)],
  },
};
