import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "twin-scripts",
  region: "R4",
  title: "Twin Scripts",
  difficulty: "M",
  patterns: ["hash-design"],
  signals: ["same shape, different symbols", "one-to-one mapping both ways", "canonical form as key"],
  prerequisites: ["scramble-check"],
  parSeconds: 600,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Isomorphic Strings", lcNumber: 205 }],
  spec: { kind: "function", name: "areTwins", returns: "bool", params: [{ type: "string", name: "a" }, { type: "string", name: "b" }] },
};
