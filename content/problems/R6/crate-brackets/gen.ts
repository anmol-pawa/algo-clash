import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const OPEN = "([{";
const CLOSE = ")]}";

/** A random balanced label of exactly `pairs` pairs. */
function balanced(r: Rng, pairs: number): string {
  const open: number[] = [];
  let out = "";
  let left = pairs;
  while (left > 0 || open.length > 0) {
    if (left > 0 && (open.length === 0 || r.int(0, 1) === 0)) {
      const k = r.int(0, 2);
      out += OPEN[k];
      open.push(k);
      --left;
    } else {
      out += CLOSE[open.pop() as number];
    }
  }
  return out;
}

const noise = (r: Rng, n: number) => Array.from({ length: n }, () => "([{)]}"[r.int(0, 5)]).join("");
/** Balanced label with one character flipped to a different bracket. */
function corrupt(r: Rng, s: string): string {
  if (s.length === 0) return s;
  const i = r.int(0, s.length - 1);
  const c = "([{)]}"[r.int(0, 5)];
  return s.slice(0, i) + c + s.slice(i + 1);
}

export const gen: GenModule = {
  small: (r) => [q(r.int(0, 2) === 0 ? balanced(r, r.int(0, 4)) : r.int(0, 1) === 0 ? corrupt(r, balanced(r, r.int(1, 4))) : noise(r, r.int(0, 8)))],
  groups: {
    basic: [[q("([]{})")], [q("([)]")], [q("((")], [q("()[]{}")], (r) => [q(balanced(r, 6))]],
    edge: [[q("")], [q(")")], [q("(")], [q("}{")], [q("{[]}")], [q("(()")]],
    adversarial: [
      [q("([{".repeat(20) + "}])".repeat(20))],
      [q("([{".repeat(20) + "}])".repeat(19) + "}]}")],
      [q("(".repeat(500) + ")".repeat(499))],
      (r) => [q(corrupt(r, balanced(r, 100)))],
    ],
    perf: [
      (r) => [q(balanced(r, 50000))],
      [q("(".repeat(50000) + ")".repeat(50000))],
      [q("()".repeat(50000))],
      [q("(".repeat(100000))],
    ],
  },
};
