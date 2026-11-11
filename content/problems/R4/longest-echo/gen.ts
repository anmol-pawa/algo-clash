import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const lit = (s: string): string[] => [`"${s}"`];
const rnd = (r: Rng, n: number, alpha: number): string => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alpha - 1))).join("");
/** Random letters with one block planted at two random places. */
const planted = (r: Rng, n: number, len: number, alpha: number): string => {
  const cs = [...rnd(r, n, alpha)];
  const block = rnd(r, len, alpha);
  const a = r.int(0, n - len);
  const b = r.int(0, n - len);
  for (let j = 0; j < len; ++j) { cs[a + j] = block[j]; cs[b + j] = block[j]; }
  return cs.join("");
};
/** Thue-Morse word over {a, b}: the classic input that breaks mod-2^64 hashes. */
const thueMorse = (n: number): string => {
  let out = "";
  for (let i = 0; i < n; ++i) {
    let bits = 0;
    for (let x = i; x > 0; x >>= 1) bits += x & 1;
    out += bits % 2 === 0 ? "a" : "b";
  }
  return out;
};

export const gen: GenModule = {
  small: (r) => lit(rnd(r, r.int(0, 14), r.int(1, 3))),
  groups: {
    basic: [lit("banana"), lit("abcd"), lit("xyabcabcz"), lit("aabaab"), lit("ababcdcd"), lit("abcdcdab"), (r) => lit(rnd(r, 20, 2))],
    edge: [lit(""), lit("a"), lit("aa"), lit("aaa"), lit("aaaa"), lit("ab"), lit("abcabc"), lit("zzzzzzzzzz"), lit("abcdefghijklmnopqrstuvwxyz"), lit("aabbaabb")],
    adversarial: [
      (r) => lit(rnd(r, 300, 26)),
      (r) => lit(rnd(r, 300, 2)),
      (r) => lit(planted(r, 300, 40, 26)),
      (r) => lit(planted(r, 400, 150, 3)),
      () => lit("a".repeat(300)),
      () => lit("ab".repeat(150)),
      // Thue-Morse: a mod-2^64 hash collides on blocks of length 1024, so unverified matches are wrong.
      () => lit(thueMorse(2048)),
      () => lit(thueMorse(4096)),
    ],
    perf: [
      (r) => lit(rnd(r, 100000, 26)),
      (r) => lit(rnd(r, 100000, 2)),
      () => lit("a".repeat(100000)),
      () => lit("ab".repeat(50000)),
      (r) => lit(planted(r, 100000, 30000, 26)),
      () => lit(thueMorse(65536)),
      () => lit(thueMorse(100000)),
    ],
  },
};
