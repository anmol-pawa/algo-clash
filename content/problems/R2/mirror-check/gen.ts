import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (s: string): string[] => [q(s)];
const ALNUM = "abcXYZ019";
const FILL = " ,.:";
const rand = (r: Rng, n: number, alpha: string) => Array.from({ length: n }, () => alpha[r.int(0, alpha.length - 1)]).join("");
/** A palindrome over letters, digits and punctuation with random case and filler. */
const mirror = (r: Rng, half: number): string => {
  const core = rand(r, half, "abcdXYZ019");
  const mid = r.int(0, 1) ? rand(r, 1, "abc") : "";
  const pad = (s: string) => s.split("").map((c) => (r.int(0, 3) === 0 ? FILL[r.int(0, 3)] + c : c)).join("");
  const up = (s: string) => s.split("").map((c) => (r.int(0, 1) ? c.toUpperCase() : c.toLowerCase())).join("");
  const rev = core.split("").reverse().join("");
  return pad(up(core)) + mid + pad(up(rev));
};
/** Flip one letter so the line is almost a mirror. */
const nearMiss = (s: string, at: number): string => {
  const i = Math.min(at, s.length - 1);
  return s.slice(0, i) + (s[i] === "q" ? "w" : "q") + s.slice(i + 1);
};

export const gen: GenModule = {
  small: (r: Rng) => (r.int(0, 1) ? t(mirror(r, r.int(0, 4))) : t(rand(r, r.int(0, 8), "aAbB1 ,"))),
  groups: {
    basic: [t("A man a plan a canal Panama"), t("race a car"), t("Was it a car or a cat I saw"), t("abBA"), (r) => t(mirror(r, 8))],
    edge: [t(""), t("a"), t(" ,. "), t("0P"), t("ab,,ba"), t("aa  b"), t("..a.."), t("Zz")],
    adversarial: [
      (r) => t(nearMiss(mirror(r, 60), 100)),
      (r) => t(mirror(r, 200) + "  ,,.."),
      (r) => t(".,  " + mirror(r, 200)),
      (r) => t(rand(r, 300, ALNUM + FILL)),
      (r) => t("a" + FILL.repeat(50) + "b" + FILL.repeat(50) + "a"),
    ],
    perf: [
      (r) => t(mirror(r, 38000)),
      (r) => t(nearMiss(mirror(r, 38000), 50000)),
      t(" ".repeat(100000)),
      t("a".repeat(99999) + "b"),
      (r) => t(rand(r, 100000, "a ")),
    ],
  },
};
