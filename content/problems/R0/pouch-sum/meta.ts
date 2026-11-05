import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "pouch-sum",
  region: "R0",
  title: "Pouch Sum",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["add up only the values that qualify", "total may exceed 32 bits", "one pass with an accumulator"],
  prerequisites: ["cargo-total"],
  parSeconds: 180,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.3, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Sum of All Odd Length Subarrays", lcNumber: 1588 }],
  spec: {
    kind: "function",
    name: "pouchSum",
    returns: "long long",
    params: [{ type: "vector<int>", name: "coins" }, { type: "int", name: "minValue" }],
  },
};
