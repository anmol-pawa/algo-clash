import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "hot-streak",
  region: "R2",
  title: "Hot Streak",
  difficulty: "M",
  patterns: ["kadane"],
  signals: ["best contiguous stretch", "maximum sum ending here", "negatives allowed, must pick at least one"],
  prerequisites: ["range-ledger"],
  parSeconds: 600,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Maximum Subarray", lcNumber: 53 }],
  spec: { kind: "function", name: "bestStretch", returns: "long long", params: [{ type: "vector<int>", name: "gains" }] },
};
