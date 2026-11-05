import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "letter-tally",
  region: "R0",
  title: "Letter Tally",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "count letters with c - a", "case-insensitive counting into 26 buckets"],
  prerequisites: [],
  parSeconds: 360,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Ransom Note", lcNumber: 383 }],
  spec: { kind: "function", name: "letterTally", returns: "vector<int>", params: [{ type: "string", name: "s" }] },
};
