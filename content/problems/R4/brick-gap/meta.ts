import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "brick-gap",
  region: "R4",
  title: "Brick Gap",
  difficulty: "M",
  patterns: ["hash-design"],
  signals: ["count how many rows share a boundary", "prefix sums as keys", "maximise a shared coordinate"],
  prerequisites: ["twin-scripts"],
  parSeconds: 900,
  complexity: { time: "O(B)", space: "O(B)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Brick Wall", lcNumber: 554 }],
  spec: { kind: "function", name: "fewestCrossed", returns: "int", params: [{ type: "vector<vector<int>>", name: "rows" }] },
};
