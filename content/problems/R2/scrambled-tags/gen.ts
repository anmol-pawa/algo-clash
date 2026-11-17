import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const letters = (r: Rng, n: number, alphabet: number) => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alphabet - 1))).join("");
const shuffled = (r: Rng, s: string) => {
  const a = s.split("");
  for (let i = a.length - 1; i > 0; --i) { const j = r.int(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a.join("");
};
/** A string that is a rearrangement of `s`, or (when `tweak`) differs by one letter. */
const pair = (r: Rng, n: number, alphabet: number, tweak: boolean): string[] => {
  const s = letters(r, n, alphabet);
  let t = shuffled(r, s);
  if (tweak && n > 0) { const i = r.int(0, n - 1); t = t.slice(0, i) + (t[i] === "a" ? "b" : "a") + t.slice(i + 1); }
  return [q(s), q(t)];
};

export const gen: GenModule = {
  small: (r) => pair(r, r.int(0, 8), r.int(1, 4), r.int(0, 1) === 1),
  groups: {
    basic: [[q("listen"), q("silent")], [q("rat"), q("car")], [q("aab"), q("abb")], [q("anagram"), q("nagaram")], (r) => pair(r, 12, 5, false)],
    edge: [[q(""), q("")], [q("a"), q("a")], [q("a"), q("")], [q(""), q("a")], [q("ab"), q("abc")], [q("abc"), q("ab")], [q("zz"), q("zy")]],
    adversarial: [
      (r) => pair(r, 400, 26, false),
      (r) => pair(r, 400, 26, true),
      (r) => pair(r, 400, 2, true),
      [q("a".repeat(300) + "b"), q("a".repeat(299) + "bb")],
    ],
    perf: [
      (r) => pair(r, 100000, 26, false),
      (r) => pair(r, 100000, 26, true),
      [q("a".repeat(100000)), q("a".repeat(100000))],
      [q("a".repeat(99999) + "b"), q("b" + "a".repeat(99999))],
    ],
  },
};
