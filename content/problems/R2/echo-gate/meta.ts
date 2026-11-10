import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "echo-gate",
  region: "R2",
  title: "Echo Gate",
  difficulty: "E",
  patterns: ["hash-lookup"],
  signals: ["seen before", "same value again", "within distance k"],
  prerequisites: [],
  parSeconds: 480,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Contains Duplicate II", lcNumber: 219 }],
  spec: { kind: "function", name: "hasEcho", returns: "bool", params: [{ type: "vector<int>", name: "pings" }, { type: "int", name: "k" }] },
};
