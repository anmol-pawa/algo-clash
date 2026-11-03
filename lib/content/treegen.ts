/** Level-order tree literals for problem generators (pure; seeded by the caller's Rng). */
import type { Rng } from "./rng";

interface N { val: number; left: N | null; right: N | null }

/** LeetCode level-order literal: `null` for missing children, trailing nulls trimmed. */
export function treeLiteral(root: N | null): string {
  if (!root) return "[]";
  const out: (number | null)[] = [];
  const q: (N | null)[] = [root];
  for (let i = 0; i < q.length; ++i) {
    const n = q[i];
    if (!n) { out.push(null); continue; }
    out.push(n.val);
    q.push(n.left, n.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return `[${out.map((v) => (v === null ? "null" : String(v))).join(",")}]`;
}

export type TreeShape = "random" | "left" | "right" | "zigzag" | "complete";

/** A tree with `n` nodes, values in [lo, hi], of the requested shape. */
export function makeTree(r: Rng, n: number, shape: TreeShape, lo: number, hi: number): N | null {
  if (n <= 0) return null;
  const nodes: N[] = [];
  const mk = (): N => ({ val: r.int(lo, hi), left: null, right: null });
  nodes.push(mk());
  const open: N[] = [nodes[0]];
  for (let i = 1; i < n; ++i) {
    const c = mk();
    const parent = shape === "complete" ? nodes[(i - 1) >> 1] : shape === "random" ? open[r.int(0, open.length - 1)] : nodes[i - 1];
    let side: "left" | "right";
    if (shape === "complete") side = i % 2 === 1 ? "left" : "right";
    else if (shape === "left") side = "left";
    else if (shape === "right") side = "right";
    else if (shape === "zigzag") side = i % 2 === 1 ? "left" : "right";
    else side = parent.left === null && (parent.right !== null || r.next() < 0.5) ? "left" : parent.right === null ? "right" : "left";
    parent[side] = c;
    nodes.push(c);
    open.push(c);
    if (parent.left && parent.right) open.splice(open.indexOf(parent), 1);
  }
  return nodes[0];
}
