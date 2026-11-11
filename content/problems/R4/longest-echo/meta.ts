import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "longest-echo",
  region: "R4",
  title: "Longest Echo",
  difficulty: "H",
  patterns: ["hash-design", "binary-search"],
  signals: ["longest block that occurs twice", "if length L repeats then L-1 repeats (monotone)", "check one length in O(n) with a rolling hash"],
  prerequisites: ["echo-strand"],
  parSeconds: 1800,
  complexity: { time: "O(n log n)", space: "O(n)" },
  timeLimitMs: 1500,
  testWeights: { basic: 0.15, edge: 0.15, adversarial: 0.3, perf: 0.4 },
  similar: [{ name: "Longest Duplicate Substring", lcNumber: 1044 }],
  spec: { kind: "function", name: "longestEcho", returns: "string", params: [{ type: "string", name: "strand" }] },
};
