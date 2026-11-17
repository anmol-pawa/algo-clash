import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "stepping-stones",
  region: "R2",
  title: "Stepping Stones",
  difficulty: "M",
  patterns: ["hash-lookup"],
  signals: ["longest run of consecutive integers", "unsorted input", "O(n) required"],
  prerequisites: ["twin-badge"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Longest Consecutive Sequence", lcNumber: 128 }],
  spec: { kind: "function", name: "longestPath", returns: "int", params: [{ type: "vector<int>&", name: "stones" }] },
};
