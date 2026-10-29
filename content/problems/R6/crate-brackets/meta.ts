import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "crate-brackets",
  region: "R6",
  title: "Crate Brackets",
  difficulty: "E",
  patterns: ["stack"],
  signals: ["matching or nesting", "each closer must match the latest opener"],
  prerequisites: [],
  parSeconds: 420,
  timeLimitMs: 1000,
  testWeights: { basic: 0.3, edge: 0.25, adversarial: 0.2, perf: 0.25 },
  similar: [{ name: "Valid Parentheses", lcNumber: 20 }],
  spec: { kind: "function", name: "isBalanced", returns: "bool", params: [{ type: "string", name: "s" }] },
};
