import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "cargo-total",
  region: "R0",
  title: "Cargo Total",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "sum of many large values", "total may exceed 32 bits"],
  prerequisites: [],
  parSeconds: 240,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.3, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Running Sum of 1d Array", lcNumber: 1480 }],
  spec: { kind: "function", name: "totalWeight", returns: "long long", params: [{ type: "vector<int>", name: "w" }] },
};
