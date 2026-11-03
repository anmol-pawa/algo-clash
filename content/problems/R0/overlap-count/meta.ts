import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "overlap-count",
  region: "R0",
  title: "Overlap Count",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "find with a start position", "substr copies, so do not slice a suffix per step"],
  prerequisites: [],
  parSeconds: 360,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Find the Index of the First Occurrence in a String", lcNumber: 28 }],
  spec: { kind: "function", name: "countOverlaps", returns: "int", params: [{ type: "string", name: "text" }, { type: "const string&", name: "pat" }] },
};
