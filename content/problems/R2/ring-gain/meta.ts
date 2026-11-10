import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "ring-gain",
  region: "R2",
  title: "Ring Gain",
  difficulty: "M",
  patterns: ["kadane", "prefix-sum"],
  signals: ["best contiguous stretch on a circle", "may wrap around the end", "total minus the worst stretch"],
  prerequisites: ["hot-streak"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Maximum Sum Circular Subarray", lcNumber: 918 }],
  spec: { kind: "function", name: "bestRingStretch", returns: "long long", params: [{ type: "vector<int>", name: "gains" }] },
};
