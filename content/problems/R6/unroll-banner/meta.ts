import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "unroll-banner",
  region: "R6",
  title: "Unroll Banner",
  difficulty: "M",
  patterns: ["stack"],
  signals: ["nested brackets with a repeat count in front", "the innermost group resolves first", "remember where each open group starts"],
  prerequisites: ["crate-brackets"],
  parSeconds: 900,
  complexity: { time: "O(n + L)", space: "O(n + L)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Decode String", lcNumber: 394 }],
  spec: { kind: "function", name: "unroll", returns: "string", params: [{ type: "string", name: "banner" }] },
};
