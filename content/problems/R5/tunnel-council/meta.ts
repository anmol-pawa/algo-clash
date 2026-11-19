import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tunnel-council",
  region: "R5",
  title: "Tunnel Council",
  difficulty: "H",
  patterns: ["linked-list", "heap"],
  signals: ["k sorted sequences must become one", "only the k front elements can be next", "min-heap of fronts, or merge pairs in rounds"],
  prerequisites: ["zipper-merge"],
  parSeconds: 1200,
  complexity: { time: "O(N log k)", space: "O(k)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Merge k Sorted Lists", lcNumber: 23 }],
  spec: { kind: "function", name: "mergeTunnels", returns: "ListNode*", params: [{ type: "vector<ListNode*>", name: "tunnels" }] },
};
