import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "exact-stretches",
  region: "R2",
  title: "Exact Stretches",
  difficulty: "M",
  patterns: ["prefix-sum", "hash-lookup"],
  signals: ["count subarrays with a given sum", "negatives allowed so no sliding window", "earlier prefix equals current minus target"],
  prerequisites: ["range-ledger", "matching-pairs"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Subarray Sum Equals K", lcNumber: 560 }],
  spec: { kind: "function", name: "countStretches", returns: "long long", params: [{ type: "vector<int>", name: "nums" }, { type: "long long", name: "target" }] },
};
