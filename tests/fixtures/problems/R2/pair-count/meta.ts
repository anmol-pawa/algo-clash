import type { ProblemMeta } from "../../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "pair-count",
  region: "R2",
  title: "Matching Pairs (fixture)",
  difficulty: "E",
  patterns: ["hash-lookup"],
  signals: ["pair summing to", "count frequency"],
  prerequisites: [],
  parSeconds: 300,
  timeLimitMs: 1000,
  testWeights: { basic: 0.3, edge: 0.2, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Two Sum", lcNumber: 1 }],
  spec: { kind: "function", name: "countPairs", returns: "long long", params: [{ type: "vector<int>&", name: "nums" }, { type: "int", name: "target" }] },
};
