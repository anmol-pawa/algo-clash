import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (ws: string[]): string[] => [`[${ws.map(q).join(",")}]`];
const word = (r: Rng, n: number, alphabet: number) => Array.from({ length: n }, () => String.fromCharCode(97 + r.int(0, alphabet - 1))).join("");
/** `n` words drawn as scrambles of a few base words so clans are non-trivial. */
const clans = (r: Rng, n: number, bases: number, len: number, alphabet: number): string[] => {
  const pool = Array.from({ length: bases }, () => word(r, r.int(1, len), alphabet));
  return Array.from({ length: n }, () => r.shuffle(r.pick(pool).split("")).join(""));
};

export const gen: GenModule = {
  small: (r) => t(Array.from({ length: r.int(0, 8) }, () => word(r, r.int(1, 4), 3))),
  groups: {
    basic: [t(["tea", "eat", "tan", "ate", "nat", "bat"]), t(["abc", "abd", "abe"]), t(["aa", "aa", "aa"]), t(["ad", "bc"]), (r) => t(clans(r, 15, 4, 5, 6))],
    edge: [t([]), t(["a"]), t(["a", "b"]), t(["ab", "ba", "ab"]), t(["a", "aa", "aaa"]), t(["abcdefghijklmnopqrst", "tsrqponmlkjihgfedcba"])],
    adversarial: [(r) => t(clans(r, 300, 5, 6, 4)), (r) => t(clans(r, 300, 40, 8, 26)), (r) => t(Array.from({ length: 300 }, () => word(r, r.int(1, 3), 2)))],
    perf: [
      (r) => t(clans(r, 20000, 50, 20, 26)),
      (r) => t(clans(r, 20000, 3000, 20, 26)),
      (r) => t(Array.from({ length: 20000 }, () => word(r, 20, 26))),
      t(Array.from({ length: 20000 }, () => "abcdefghijklmnopqrst")),
    ],
  },
};
