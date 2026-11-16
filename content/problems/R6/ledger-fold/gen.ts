import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (s: string) => `"${s}"`;
const LIMIT = 2147483647;

type Node = { k: "n"; v: number } | { k: "neg"; c: Node } | { k: "bin"; op: "+" | "-" | "*" | "/"; l: Node; r: Node };

/** Value of the tree with truncating division, or null when a value leaves the int range or divides by zero. */
function evalNode(n: Node): number | null {
  if (n.k === "n") return n.v;
  if (n.k === "neg") {
    const c = evalNode(n.c);
    return c === null ? null : -c;
  }
  const a = evalNode(n.l);
  const b = evalNode(n.r);
  if (a === null || b === null) return null;
  let v: number;
  if (n.op === "+") v = a + b;
  else if (n.op === "-") v = a - b;
  else if (n.op === "*") v = a * b;
  else {
    if (b === 0) return null;
    v = Math.trunc(a / b);
  }
  return Math.abs(v) > LIMIT ? null : v;
}

const prec = (n: Node) => (n.k !== "bin" ? 9 : n.op === "*" || n.op === "/" ? 2 : 1);

function print(r: Rng, n: Node, extra: number, spaced: boolean): string {
  if (n.k === "n") return String(n.v);
  if (n.k === "neg") {
    const c = n.c;
    return c.k === "n" ? `-${c.v}` : `-(${print(r, c, extra, spaced)})`;
  }
  const p = prec(n);
  const sub = (c: Node, strict: boolean) => {
    const s = print(r, c, extra, spaced);
    const need = c.k === "bin" && (strict ? prec(c) <= p : prec(c) < p);
    return need || (c.k === "bin" && r.next() < extra) ? `(${s})` : s;
  };
  const op = spaced ? ` ${n.op} ` : n.op;
  return sub(n.l, false) + op + sub(n.r, true);
}

function tree(r: Rng, depth: number, maxLit: number): Node {
  if (depth === 0 || r.next() < 0.2) return { k: "n", v: r.int(0, maxLit) };
  if (r.next() < 0.12) return { k: "neg", c: tree(r, depth - 1, maxLit) };
  const op = r.pick(["+", "-", "*", "/", "+", "-", "*"] as const);
  return { k: "bin", op, l: tree(r, depth - 1, maxLit), r: tree(r, depth - 1, maxLit) };
}

/** A valid line whose every intermediate value fits in an int. */
function expr(r: Rng, depth: number, maxLit: number, extra = 0.15, spaced = r.next() < 0.5): string {
  for (let tries = 0; tries < 200; tries++) {
    const t = tree(r, depth, maxLit);
    if (evalNode(t) !== null) return q(print(r, t, extra, spaced));
  }
  return q(String(r.int(0, maxLit)));
}
const rep = (t: string, n: number) => t.repeat(n);

export const gen: GenModule = {
  small: (r) => [expr(r, r.int(0, 3), r.pick([3, 9, 20]))],
  groups: {
    basic: [
      [q("2 + 3 * 4")],
      [q("(2 + 3) * 4")],
      [q("8 - 3 - 2")],
      [q("2 * -(3 + 4)")],
      [q("-7 / 2")],
      [q("10 - (4 - (1 - 2))")],
      (r) => [expr(r, 3, 12)],
    ],
    edge: [
      [q("0")],
      [q("2147483647")],
      [q("-2147483647")],
      [q("(((7)))")],
      [q("2*-3")],
      [q("5 / -2")],
      [q("-(-(-4))")],
      [q("  12   -  5  ")],
      [q("7 - -3")],
      [q("1000000 * 2000 + 147")],
      [q("-6 / 4 * 4")],
      [q("(-3)*(-3)-(-3)")],
    ],
    adversarial: [
      [q(rep("(", 1000) + "1" + rep(")", 1000))],
      [q(rep("-(", 500) + "5" + rep(")", 500))],
      [q(rep("1-(", 400) + "1" + rep(")", 400))],
      (r) => [expr(r, 5, 9, 0.3)],
      (r) => [expr(r, 6, 40, 0.1, false)],
      (r) => [expr(r, 6, 1000, 0.1, true)],
      (r) => [q(Array.from({ length: 300 }, () => r.int(1, 9)).join("-"))],
      [q(rep("2/", 30) + "1")],
    ],
    perf: [
      [q(rep("(", 90000) + "1" + rep(")", 90000))],
      [q(rep("(1+", 45000) + "1" + rep(")", 45000))],
      [q(rep("-(", 60000) + "3" + rep(")", 60000))],
      [q("1" + rep(" + 1", 49999))],
      [q("1" + rep(" - 1 * 1", 22000))],
      (r) => [q(Array.from({ length: 90000 }, () => r.int(0, 9)).join("+"))],
      [q(rep("(1-", 49000) + "0" + rep(")", 49000))],
    ],
  },
};
