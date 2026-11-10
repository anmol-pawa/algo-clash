import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "scramble-check",
  region: "R2",
  title: "Scramble Check",
  difficulty: "E",
  patterns: ["hash-lookup"],
  signals: ["count frequency", "same letters rearranged"],
  prerequisites: [],
  parSeconds: 360,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Valid Anagram", lcNumber: 242 }],
  spec: { kind: "function", name: "isScramble", returns: "bool", params: [{ type: "string", name: "a" }, { type: "string", name: "b" }] },
};
