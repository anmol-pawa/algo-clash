import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "crate-order",
  region: "R0",
  title: "Crate Order",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "struct with a constructor", "operator< decides sort order"],
  prerequisites: [],
  parSeconds: 480,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Relative Ranks", lcNumber: 506 }],
  spec: { kind: "function", name: "rankCrates", returns: "vector<int>", params: [{ type: "vector<int>&", name: "weights" }] },
};
