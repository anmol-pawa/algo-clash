import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "run-squash",
  region: "R0",
  title: "Run Squash",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "delete elements from a vector", "erase inside a loop costs O(n) each time"],
  prerequisites: [],
  parSeconds: 360,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Remove Duplicates from Sorted Array", lcNumber: 26 }],
  spec: { kind: "function", name: "squashRuns", returns: "vector<int>", params: [{ type: "vector<int>", name: "nums" }] },
};
