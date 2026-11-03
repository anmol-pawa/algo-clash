import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ  ";
const text = (r: Rng, n: number, alphabet = LETTERS) => Array.from({ length: n }, () => alphabet[r.int(0, alphabet.length - 1)]).join("");

export const gen: GenModule = {
  small: (r) => [q(text(r, r.int(0, 12)))],
  groups: {
    basic: [[q("Harbor")], [q("AEIOU sky")], [q("rhythm")], [q("a")], (r) => [q(text(r, 20))]],
    edge: [[q("")], [q(" ")], [q("U")], [q("y")], [q("Y y")], [q("bcdfg")], [q("aeiouAEIOU")], [q("  a  ")]],
    adversarial: [[q("AaEeIiOoUu".repeat(50))], [q("yY".repeat(100))], (r) => [q(text(r, 200, "aeiouAEIOUyY "))], (r) => [q(text(r, 300))]],
    perf: [[q("a".repeat(100000))], [q("Zz".repeat(50000))], (r) => [q(text(r, 100000))], [q("xyz ".repeat(25000))]],
  },
};
