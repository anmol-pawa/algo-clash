import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "range-ledger",
  region: "R2",
  title: "Range Ledger",
  difficulty: "E",
  patterns: ["prefix-sum"],
  signals: ["many range-sum queries", "array never changes between queries", "sum of a stretch"],
  prerequisites: ["matching-pairs"],
  parSeconds: 420,
  complexity: { time: "O(n + q)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.2, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Range Sum Query - Immutable", lcNumber: 303 }],
  spec: { kind: "function", name: "stretchTotals", returns: "vector<long long>", params: [{ type: "vector<int>", name: "coins" }, { type: "vector<vector<int>>", name: "queries" }] },
};
