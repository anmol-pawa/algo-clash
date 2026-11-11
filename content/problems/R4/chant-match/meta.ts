import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "chant-match",
  region: "R4",
  title: "Chant Match",
  difficulty: "M",
  patterns: ["hash-design"],
  signals: ["pattern letters vs words", "one-to-one mapping both ways", "two maps (forward and reverse)"],
  prerequisites: ["twin-scripts"],
  parSeconds: 720,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Word Pattern", lcNumber: 290 }],
  spec: { kind: "function", name: "chantMatches", returns: "bool", params: [{ type: "string", name: "pattern" }, { type: "string", name: "sentence" }] },
};
