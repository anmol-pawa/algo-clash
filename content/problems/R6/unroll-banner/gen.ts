import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const letters = (r: Rng, n: number, alpha = 26) => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alpha - 1))).join("");

/** Random banner; returns [text, expandedLength]. Stops growing when the expansion would exceed `cap`. */
function build(r: Rng, depth: number, budget: number, maxCount: number, cap: number): { s: string; len: number } {
  let s = "";
  let len = 0;
  const parts = r.int(1, 3);
  for (let p = 0; p < parts; p++) {
    if (r.next() < 0.45 || depth === 0) {
      const t = letters(r, r.int(1, 3));
      s += t;
      len += t.length;
    } else {
      const k = r.int(1, maxCount);
      const inner = build(r, depth - 1, budget, maxCount, cap);
      if (len + k * inner.len > cap || inner.len === 0) continue;
      s += `${k}[${inner.s}]`;
      len += k * inner.len;
    }
  }
  return { s, len };
}
const rand = (r: Rng, depth: number, maxCount: number, cap = 100000) => q(build(r, depth, 0, maxCount, cap).s);
const rep = (t: string, n: number) => t.repeat(n);

export const gen: GenModule = {
  small: (r) => [rand(r, r.int(0, 3), r.pick([3, 12]), 60)],
  groups: {
    basic: [
      [q("2[ab]c")],
      [q("3[x2[y]]")],
      [q("ab12[z]")],
      [q("2[]x")],
      (r) => [rand(r, 3, 4, 300)],
      [q("2[a2[b2[c]]]d")],
    ],
    edge: [
      [q("")],
      [q("abc")],
      [q("1[a]")],
      [q("300[z]")],
      [q("1[1[1[1[a]]]]")],
      [q("10[]")],
      [q("2[a]2[b]2[c]")],
      [q("100[2[3[ab]]]")],
    ],
    adversarial: [
      [q(rep("1[", 300) + "q" + rep("]", 300))],
      [q(rep("2[a]", 1000))],
      [q(rep("1[ab]", 2000))],
      (r) => [rand(r, 6, 5, 20000)],
      (r) => [rand(r, 8, 3, 20000)],
      [q("a" + rep("1[", 20000) + "b" + rep("]", 20000))],
    ],
    perf: [
      [q(rep("2[a]", 25000))],
      [q(rep("1[ab]", 20000))],
      [q(rep("1[", 16000) + rep("x", 50000) + rep("]", 16000))],
      [q("300[" + rep("a", 300) + "]")],
      [q("30[10[10[xyz]]]")],
      [q(rep("1[a2[b]]", 12000))],
    ],
  },
};
