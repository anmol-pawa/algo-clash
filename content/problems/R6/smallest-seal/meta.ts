import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "smallest-seal",
  region: "R6",
  title: "Smallest Seal",
  difficulty: "M",
  patterns: ["monotonic-stack", "greedy"],
  signals: ["delete exactly k items to make the smallest sequence", "a larger digit before a smaller one should go", "earlier positions matter most"],
  prerequisites: ["heat-wave"],
  parSeconds: 840,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Remove K Digits", lcNumber: 402 }],
  spec: { kind: "function", name: "smallestSeal", returns: "string", params: [{ type: "string", name: "code" }, { type: "int", name: "k" }] },
};
