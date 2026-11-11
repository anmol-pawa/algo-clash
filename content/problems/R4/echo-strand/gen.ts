import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const L = "ACGT";
const t = (s: string, k: number): string[] => [`"${s}"`, String(k)];
const rnd = (r: Rng, n: number, alpha = 4): string => Array.from({ length: n }, () => L[r.int(0, alpha - 1)]).join("");
/** A random strand with a planted block repeated at random places. */
const planted = (r: Rng, n: number, k: number, copies: number): string => {
  const block = rnd(r, k);
  const cs = [...rnd(r, n)];
  for (let c = 0; c < copies; ++c) {
    const at = r.int(0, Math.max(0, n - k));
    for (let j = 0; j < k && at + j < n; ++j) cs[at + j] = block[j];
  }
  return cs.join("");
};

export const gen: GenModule = {
  small: (r) => t(rnd(r, r.int(0, 14), r.int(1, 3)), r.int(1, 4)),
  groups: {
    basic: [t("ACGACGAC", 3), t("AAAAAA", 2), t("ACGT", 2), (r) => t(rnd(r, 20, 2), 3)],
    edge: [t("", 1), t("A", 1), t("AA", 1), t("AA", 2), t("AAA", 3), t("ACGT", 5), t("ACACACAC", 4), t("ACGTACGTACGT", 4), (r) => t(rnd(r, 40, 1), 5)],
    adversarial: [
      (r) => t(rnd(r, 300, 4), 3),
      (r) => t(rnd(r, 300, 2), 10),
      (r) => t(planted(r, 300, 20, 4), 20),
      (r) => t(planted(r, 300, 30, 3), 30),
      // k just above 16: a 32-bit key would collide.
      (r) => t(planted(r, 300, 17, 3), 17),
      (r) => t(rnd(r, 300, 4), 30),
    ],
    perf: [
      (r) => t(rnd(r, 100000, 4), 10),
      (r) => t(rnd(r, 100000, 2), 30),
      () => t("A".repeat(100000), 30),
      (r) => t(planted(r, 100000, 30, 5), 30),
      () => t("ACGT".repeat(25000), 17),
      (r) => t(rnd(r, 100000, 4), 8),
    ],
  },
};
