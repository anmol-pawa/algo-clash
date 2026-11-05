import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "grid-turn",
  region: "R0",
  title: "Grid Turn",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "build a 2D vector of a given shape", "rows and columns swap on a non-square grid"],
  prerequisites: [],
  parSeconds: 360,
  complexity: { time: "O(rows * cols)", space: "O(rows * cols)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Transpose Matrix", lcNumber: 867 }],
  spec: { kind: "function", name: "transposeGrid", returns: "vector<vector<int>>", params: [{ type: "const vector<vector<int>>&", name: "grid" }] },
};
