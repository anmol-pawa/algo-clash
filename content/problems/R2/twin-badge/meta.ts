import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "twin-badge",
  region: "R2",
  title: "Twin Badge",
  difficulty: "E",
  patterns: ["hash-lookup"],
  signals: ["does any value repeat", "seen before", "all distinct"],
  prerequisites: [],
  parSeconds: 300,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Contains Duplicate", lcNumber: 217 }],
  spec: { kind: "function", name: "hasTwin", returns: "bool", params: [{ type: "vector<int>&", name: "badges" }] },
};
