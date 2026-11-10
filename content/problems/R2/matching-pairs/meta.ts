import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "matching-pairs",
  region: "R2",
  title: "Matching Pairs",
  difficulty: "E",
  patterns: ["hash-lookup"],
  signals: ["pair summing to a target", "seen before", "count frequency"],
  prerequisites: [],
  parSeconds: 480,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Two Sum", lcNumber: 1 }],
  spec: { kind: "function", name: "countMatches", returns: "long long", params: [{ type: "vector<int>", name: "nums" }, { type: "int", name: "target" }] },
};
