import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (s: string): string[] => [q(s)];
// Printable ASCII without quote and backslash so the input stays simple to encode.
const PRINTABLE = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).filter((c) => c !== '"' && c !== "\\").join("");
const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NEIGHBOURS = "@[`{AZaz";
const pickFrom = (r: Rng, alphabet: string, n: number) => Array.from({ length: n }, () => alphabet[r.int(0, alphabet.length - 1)]).join("");

export const gen: GenModule = {
  small: (r) => t(pickFrom(r, PRINTABLE, r.int(0, 12))),
  groups: {
    basic: [t("Abba"), t("zZ!"), t("42 [@]"), t("The quick brown fox jumps over the lazy dog"), (r) => t(pickFrom(r, LETTERS + " ", 20))],
    edge: [t(""), t(" "), t("@[`{"), t("AZaz"), t("zzzzZZZZ"), t("~!#$%&'()*+,-./0123456789:;<=>?")],
    adversarial: [(r) => t(pickFrom(r, NEIGHBOURS, 100)), (r) => t(pickFrom(r, PRINTABLE, 300)), t(LETTERS.repeat(5))],
    perf: [t("z".repeat(200000)), (r) => t(pickFrom(r, PRINTABLE, 200000)), (r) => t(pickFrom(r, LETTERS, 200000)), t("Zz[`".repeat(50000))],
  },
};
