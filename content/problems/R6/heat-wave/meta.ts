import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "heat-wave",
  region: "R6",
  title: "Heat Wave",
  difficulty: "M",
  patterns: ["monotonic-stack"],
  signals: ["next greater element", "how many steps until something bigger", "unresolved items wait on a stack"],
  prerequisites: ["crate-brackets"],
  parSeconds: 600,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Daily Temperatures", lcNumber: 739 }],
  spec: { kind: "function", name: "waitDays", returns: "vector<int>", params: [{ type: "vector<int>&", name: "temps" }] },
};
