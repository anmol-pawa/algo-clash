import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

/** A decimal literal with exactly `len` digits (no leading zero) and a random sign. */
function digits(r: Rng, len: number, signed = true): string {
  let s = String(r.int(1, 9));
  for (let i = 1; i < len; i++) s += r.int(0, 9);
  return (signed && r.int(0, 1) === 0 ? "-" : "") + s;
}

export const gen: GenModule = {
  small: (r) => [r.int(0, 4) === 0 ? "0" : digits(r, r.int(1, 18))],
  groups: {
    basic: [["1234"], ["-407"], ["0"], ["9"], ["100200300"], (r) => [digits(r, 6)]],
    edge: [["-9"], ["10"], ["-10"], ["9223372036854775807"], ["-9223372036854775807"], ["999999999999999999"], ["2147483648"], ["-2147483649"]],
    adversarial: [["4294967296"], ["-4294967297"], ["5000000000"], (r) => [digits(r, 18)], (r) => [digits(r, 12)], (r) => [digits(r, 10)]],
    perf: [],
  },
};
