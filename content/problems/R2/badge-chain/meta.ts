import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "badge-chain",
  region: "R2",
  title: "Badge Chain",
  difficulty: "M",
  patterns: ["hash-lookup"],
  signals: ["longest run of consecutive values", "O(n) required", "order does not matter"],
  prerequisites: ["matching-pairs"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Longest Consecutive Sequence", lcNumber: 128 }],
  spec: { kind: "function", name: "longestChain", returns: "int", params: [{ type: "vector<int>", name: "badges" }] },
};
