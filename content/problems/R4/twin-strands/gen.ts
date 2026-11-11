import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const t = (s: string, len: number): string[] => [q(s), String(len)];
const dna = (r: Rng, n: number, k = 4) => Array.from({ length: n }, () => "ACGT"[r.int(0, k - 1)]).join("");
/** A string built from a few repeated chunks, so long strands really repeat. */
const chunky = (r: Rng, n: number, chunk: number, pool: number): string => {
  const chunks = Array.from({ length: pool }, () => dna(r, chunk));
  let s = "";
  while (s.length < n) s += chunks[r.int(0, pool - 1)];
  return s.slice(0, n);
};

export const gen: GenModule = {
  small: (r) => t(dna(r, r.int(0, 14), r.int(1, 4)), r.int(1, 6)),
  groups: {
    basic: [t("ACGTACGTAC", 4), t("AAAAAA", 2), t("ACGT", 5), (r) => t(dna(r, 20, 2), 3)],
    edge: [t("", 1), t("A", 1), t("AA", 1), t("AA", 2), t("AAA", 2), t("ACGT", 4), t("ACGTACGT", 4), t("A".repeat(40), 31), t("ACGT".repeat(10), 31), t("A".repeat(31), 31)],
    adversarial: [(r) => t(chunky(r, 300, 40, 3), 31), (r) => t(chunky(r, 300, 20, 2), 17), (r) => t(dna(r, 300, 4), 5), (r) => t(chunky(r, 300, 33, 2), 16)],
    perf: [
      (r) => t(dna(r, 200000, 4), 10),
      (r) => t(chunky(r, 200000, 50, 4), 31),
      (r) => t(chunky(r, 200000, 40, 3), 20),
      () => t("A".repeat(200000), 31),
      (r) => t(dna(r, 200000, 2), 17),
    ],
  },
};
