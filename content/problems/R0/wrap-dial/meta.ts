import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "wrap-dial",
  region: "R0",
  title: "Wrap Dial",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "wrap around a circle", "negative modulo"],
  prerequisites: [],
  parSeconds: 240,
  complexity: { time: "O(1)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.45, adversarial: 0.3, perf: 0 },
  similar: [{ name: "Circular Array Loop", lcNumber: 457 }],
  spec: { kind: "function", name: "wrapSlot", returns: "int", params: [{ type: "int", name: "pos" }, { type: "int", name: "m" }] },
};
