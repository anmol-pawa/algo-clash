import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

interface N { val: number; left: N | null; right: N | null }

/** Level-order literal with `null` holes and trailing nulls trimmed. */
function literal(root: N | null): string[] {
  if (!root) return ["[]"];
  const out: (number | null)[] = [];
  const q: (N | null)[] = [root];
  for (let i = 0; i < q.length; i++) {
    const n = q[i];
    out.push(n ? n.val : null);
    if (n) q.push(n.left, n.right);
  }
  while (out[out.length - 1] === null) out.pop();
  return [`[${out.map((v) => (v === null ? "null" : v)).join(",")}]`];
}

/** Random shape: each new node hangs off a random free child slot. `bias` > 0 favours deep (recent) parents. */
function random(r: Rng, n: number, bias = 0): string[] {
  if (n === 0) return ["[]"];
  const root: N = { val: r.int(-9, 9), left: null, right: null };
  const nodes: N[] = [root];
  const free: Array<[N, "left" | "right"]> = [[root, "left"], [root, "right"]];
  while (nodes.length < n) {
    const lo = bias > 0 ? Math.max(0, free.length - bias) : 0;
    const k = r.int(lo, free.length - 1);
    const [p, side] = free[k];
    free.splice(k, 1);
    const c: N = { val: r.int(-1000000000, 1000000000), left: null, right: null };
    p[side] = c;
    nodes.push(c);
    free.push([c, "left"], [c, "right"]);
  }
  return literal(root);
}

function chain(n: number, side: "left" | "right"): string[] {
  const root: N = { val: 0, left: null, right: null };
  let cur = root;
  for (let i = 1; i < n; i++) {
    const c: N = { val: i, left: null, right: null };
    cur[side] = c;
    cur = c;
  }
  return literal(root);
}

export const gen: GenModule = {
  small: (r) => random(r, r.int(0, 10)),
  groups: {
    basic: [["[3,9,20,null,null,15,7]"], ["[1,null,2]"], ["[5]"], ["[1,2,3,4,5]"], (r) => random(r, 12)],
    edge: [["[]"], chain(2, "left"), chain(2, "right"), ["[1,2,null,3,null,4]"]],
    adversarial: [(r) => random(r, 300, 3), chain(200, "left"), chain(200, "right"), ["[1,2,3,4,5,6,7]"]],
    perf: [chain(10000, "left"), chain(10000, "right"), (r) => random(r, 10000), (r) => random(r, 10000, 4)],
  },
};
