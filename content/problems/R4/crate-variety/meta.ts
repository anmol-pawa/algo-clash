import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "crate-variety",
  region: "R4",
  title: "Crate Variety",
  difficulty: "M",
  patterns: ["hash-design", "sliding-window"],
  signals: ["longest stretch with at most K kinds", "hash map as window state", "shrink when too many distinct"],
  prerequisites: ["twin-scripts", "tidy-tape"],
  parSeconds: 780,
  complexity: { time: "O(n)", space: "O(k)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Longest Substring with At Most K Distinct Characters", lcNumber: 340 }],
  spec: { kind: "function", name: "longestVariety", returns: "int", params: [{ type: "vector<int>", name: "kinds" }, { type: "int", name: "k" }] },
};
