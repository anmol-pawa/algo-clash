import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "ferry-pairs",
  region: "R2",
  title: "Ferry Pairs",
  difficulty: "M",
  patterns: ["two-pointers"],
  signals: ["at most two per group", "weight limit", "pair the heaviest with the lightest"],
  prerequisites: ["mirror-check"],
  parSeconds: 900,
  complexity: { time: "O(n log n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Boats to Save People", lcNumber: 881 }],
  spec: { kind: "function", name: "minFerries", returns: "int", params: [{ type: "vector<int>", name: "weights" }, { type: "int", name: "limit" }] },
};
