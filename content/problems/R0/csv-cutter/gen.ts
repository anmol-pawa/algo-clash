import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const text = (r: Rng, n: number, alphabet: string) => Array.from({ length: n }, () => alphabet[r.int(0, alphabet.length - 1)]).join("");
const MIXED = "abcxyz019  ,,,";

export const gen: GenModule = {
  small: (r) => [q(text(r, r.int(0, 10), "ab ,,"))],
  groups: {
    basic: [[q("ant,bee,cat")], [q("a,,b,")], [q("")], [q(",")], (r) => [q(text(r, 20, MIXED))]],
    edge: [[q(",,,")], [q("solo")], [q(" , ")], [q(",x")], [q("x,")], [q("12,034,,5")]],
    adversarial: [[q(",".repeat(300))], (r) => [q(text(r, 300, MIXED))], [q("a,".repeat(200))], (r) => [q(text(r, 400, "a,"))]],
    perf: [[q(",".repeat(200000))], [q("ab,".repeat(66666))], (r) => [q(text(r, 200000, MIXED))], [q("z".repeat(200000))]],
  },
};
