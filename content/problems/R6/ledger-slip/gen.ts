import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => JSON.stringify(s);

/** Random well-formed slip: `terms` terms per group, brackets down to `maxDepth`, numbers up to `maxNum`. */
function slip(r: Rng, terms: number, maxDepth: number, maxNum: number, spaces: boolean): string {
  const expr = (depth: number, n: number): string => {
    let out = "";
    for (let k = 0; k < n; k++) {
      const term = depth < maxDepth && r.int(0, 3) === 0 ? `(${expr(depth + 1, r.int(1, 3))})` : String(r.int(0, maxNum));
      if (k === 0) out += (r.int(0, 3) === 0 ? "-" : "") + term;
      else out += (r.int(0, 1) === 0 ? "+" : "-") + term;
    }
    return out;
  };
  const raw = expr(0, terms);
  if (!spaces) return raw;
  const tokens = raw.match(/\d+|[()+-]/g)!;
  return (r.int(0, 1) === 0 ? " " : "") + tokens.map((t) => t + (r.int(0, 2) === 0 ? " ".repeat(r.int(1, 2)) : "")).join("");
}

const nest = (depth: number, inner: string, open = "(") => open.repeat(depth) + inner + ")".repeat(depth);

export const gen: GenModule = {
  small: (r) => [q(slip(r, r.int(1, 4), r.pick([1, 2, 3]), r.pick([9, 99, 1000000000]), r.int(0, 1) === 0))],
  groups: {
    basic: [
      [q("1 + 1")],
      [q(" 12 - (3 + 4) ")],
      [q("-(2 + (3 - 10)) + 1")],
      [q("(7)-(0)-(-5)")],
      (r) => [q(slip(r, 5, 2, 20, true))],
    ],
    edge: [
      [q("0")],
      [q("1000000000")],
      [q("-1000000000")],
      [q("(1)")],
      [q("((((5))))")],
      [q("-(-(-(-(3))))")],
      [q("2-(3-(4-(5-6)))")],
      [q(" ( - 4 ) ")],
      [q("100-1-1-1-1-1")],
      [q("1000000000+1000000000+1000000000-(-1000000000)")],
    ],
    adversarial: [
      (r) => [q(slip(r, 40, 4, 1000000000, true))],
      (r) => [q(slip(r, 40, 6, 9, false))],
      [q(nest(300, "1000000000", "-("))],
      [q("1" + "-(1".repeat(400) + ")".repeat(400))],
      [q(Array.from({ length: 200 }, () => "1000000000").join("+") + "-(" + Array.from({ length: 100 }, () => "999999999").join("-") + ")")],
    ],
    perf: [
      [q(nest(49990, "7"))],
      [q(nest(33000, "5", "-("))],
      [q("1" + "-(1".repeat(24000) + ")".repeat(24000))],
      (r) => [q(slip(r, 10000, 3, 9, true))],
      (r) => [q(slip(r, 4000, 8, 1000000000, true))],
      [q(Array.from({ length: 9000 }, () => "1000000000").join("+"))],
    ],
  },
};
