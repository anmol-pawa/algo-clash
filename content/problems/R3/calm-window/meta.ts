import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "calm-window",
  region: "R3",
  title: "Calm Window",
  difficulty: "M",
  patterns: ["sliding-window"],
  signals: ["contiguous substring", "longest with a condition", "at most k distinct"],
  prerequisites: [],
  parSeconds: 900,
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.2, adversarial: 0.25, perf: 0.3 },
  similar: [{ name: "Longest Substring with At Most K Distinct Characters", lcNumber: 340 }],
  spec: { kind: "function", name: "longestCalm", returns: "int", params: [{ type: "string", name: "s" }, { type: "int", name: "k" }] },
};
