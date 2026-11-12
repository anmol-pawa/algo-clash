import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "rail-fleet",
  region: "R6",
  title: "Rail Fleet",
  difficulty: "M",
  patterns: ["monotonic-stack"],
  signals: ["no overtaking", "a faster item behind is held up by a slower one ahead", "sort by position, then compare arrival times"],
  prerequisites: ["crate-brackets"],
  parSeconds: 900,
  complexity: { time: "O(n log n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.3, perf: 0.3 },
  similar: [{ name: "Car Fleet", lcNumber: 853 }],
  spec: {
    kind: "function",
    name: "countConvoys",
    returns: "int",
    params: [
      { type: "int", name: "depot" },
      { type: "vector<int>&", name: "start" },
      { type: "vector<int>&", name: "speed" },
    ],
  },
};
