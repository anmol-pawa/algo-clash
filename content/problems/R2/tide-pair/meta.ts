import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tide-pair",
  region: "R2",
  title: "Tide Pair",
  difficulty: "E",
  patterns: ["hash-lookup"],
  signals: ["pair summing to a target", "seen before", "indices of two readings"],
  prerequisites: [],
  parSeconds: 420,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Two Sum", lcNumber: 1 }],
  spec: { kind: "function", name: "tidePair", returns: "vector<int>", params: [{ type: "vector<int>&", name: "readings" }, { type: "int", name: "target" }] },
};
