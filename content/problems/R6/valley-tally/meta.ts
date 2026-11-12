import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "valley-tally",
  region: "R6",
  title: "Valley Tally",
  difficulty: "M",
  patterns: ["monotonic-stack"],
  signals: ["sum over all subarrays of their minimum", "count how many windows an element is the smallest of", "previous smaller and next smaller"],
  prerequisites: ["heat-wave"],
  parSeconds: 1080,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Sum of Subarray Minimums", lcNumber: 907 }],
  spec: { kind: "function", name: "valleyTally", returns: "int", params: [{ type: "vector<int>&", name: "depths" }] },
};
