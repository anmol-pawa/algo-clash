import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (s: string): string[] => [q(s)];
const CH = "abcxyz019 ";
// Fields are short random words (often empty) joined by commas.
function line(r: Rng, fields: number, maxLen: number): string {
  return Array.from({ length: fields }, () => Array.from({ length: r.int(0, maxLen) }, () => CH[r.int(0, CH.length - 1)]).join("")).join(",");
}

export const gen: GenModule = {
  small: (r) => t(line(r, r.int(1, 5), 3)),
  groups: {
    basic: [t("crab,reef,seal"), t("a,,b"), t("x,"), t(""), (r) => t(line(r, 6, 4))],
    edge: [t(","), t(",,"), t(",a"), t("solo"), t(" a , b "), t("a,,,,b")],
    adversarial: [(r) => t(line(r, 60, 3)), (r) => t(line(r, 40, 0)), t("," .repeat(300))],
    perf: [t(",".repeat(200000)), (r) => t(line(r, 40000, 8).slice(0, 200000)), t("ab".repeat(100000)), t("a,".repeat(100000))],
  },
};
