import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "grid-spin",
  region: "R0",
  title: "Grid Spin",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "build a 2D vector", "rows and columns swap places"],
  prerequisites: [],
  parSeconds: 420,
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Rotate Image", lcNumber: 48 }, { name: "Transpose Matrix", lcNumber: 867 }],
  spec: { kind: "function", name: "spinClockwise", returns: "vector<vector<int>>", params: [{ type: "const vector<vector<int>>&", name: "grid" }] },
};
