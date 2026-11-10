import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "triple-tally",
  region: "R2",
  title: "Triple Tally",
  difficulty: "M",
  patterns: ["two-pointers"],
  signals: ["triples that sum to a target", "count distinct combinations", "sort first"],
  prerequisites: ["mirror-check"],
  parSeconds: 1200,
  complexity: { time: "O(n^2)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "3Sum", lcNumber: 15 }],
  spec: { kind: "function", name: "countTriples", returns: "int", params: [{ type: "vector<int>", name: "nums" }] },
};
