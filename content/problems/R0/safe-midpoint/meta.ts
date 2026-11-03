import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "safe-midpoint",
  region: "R0",
  title: "Safe Midpoint",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "average of two ints", "values near the int limit"],
  prerequisites: [],
  parSeconds: 240,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.4, adversarial: 0.4, perf: 0 },
  similar: [{ name: "Binary Search", lcNumber: 704 }],
  spec: { kind: "function", name: "midSlot", returns: "int", params: [{ type: "int", name: "lo" }, { type: "int", name: "hi" }] },
};
