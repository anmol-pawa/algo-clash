import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "shelf-rank",
  region: "R0",
  title: "Shelf Rank",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "answer many queries on a big read-only array", "pass large containers by const reference"],
  prerequisites: [],
  parSeconds: 300,
  complexity: { time: "O(m log n)", space: "O(m)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Search Insert Position", lcNumber: 35 }],
  spec: { kind: "function", name: "countBelow", returns: "vector<int>", params: [{ type: "const vector<int>&", name: "shelves" }, { type: "const vector<int>&", name: "queries" }] },
};
