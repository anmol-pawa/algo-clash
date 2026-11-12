import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "convoy-count",
  region: "R6",
  title: "Convoy Count",
  difficulty: "M",
  patterns: ["monotonic-stack", "sorting"],
  signals: ["objects that merge and then move together", "the one in front limits the one behind", "sort by position, then compare arrival times"],
  prerequisites: ["heat-wave"],
  parSeconds: 720,
  complexity: { time: "O(n log n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Car Fleet", lcNumber: 853 }],
  spec: {
    kind: "function",
    name: "convoyCount",
    returns: "int",
    params: [
      { type: "int", name: "target" },
      { type: "vector<int>&", name: "position" },
      { type: "vector<int>&", name: "speed" },
    ],
  },
};
