import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "skyline-hall",
  region: "R6",
  title: "Skyline Hall",
  difficulty: "H",
  patterns: ["monotonic-stack"],
  signals: ["histogram area", "previous smaller and next smaller", "widest span where a bar is the minimum"],
  prerequisites: ["crate-brackets"],
  parSeconds: 1500,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.3, perf: 0.3 },
  similar: [{ name: "Largest Rectangle in Histogram", lcNumber: 84 }],
  spec: { kind: "function", name: "largestHall", returns: "long long", params: [{ type: "vector<int>&", name: "heights" }] },
};
