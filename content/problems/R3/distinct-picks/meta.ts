import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "distinct-picks",
  region: "R3",
  title: "Distinct Picks",
  difficulty: "H",
  patterns: ["sliding-window", "hash-lookup"],
  signals: ["count stretches with exactly k different values", "at most k kinds minus at most k-1 kinds", "count can exceed int"],
  prerequisites: ["odd-picks", "flip-budget"],
  parSeconds: 1500,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Subarrays with K Different Integers", lcNumber: 992 }],
  spec: { kind: "function", name: "countKindStretches", returns: "long long", params: [{ type: "vector<int>", name: "beads" }, { type: "int", name: "k" }] },
};
