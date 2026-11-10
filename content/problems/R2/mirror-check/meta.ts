import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "mirror-check",
  region: "R2",
  title: "Mirror Check",
  difficulty: "E",
  patterns: ["two-pointers"],
  signals: ["read from both ends", "palindrome", "skip characters that do not count"],
  prerequisites: ["scramble-check"],
  parSeconds: 420,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Valid Palindrome", lcNumber: 125 }],
  spec: { kind: "function", name: "isMirror", returns: "bool", params: [{ type: "string", name: "line" }] },
};
