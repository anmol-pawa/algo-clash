import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "charge-meter",
  region: "R0",
  title: "Charge Meter",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "stop at the first time a total reaches a target", "skip bad readings"],
  prerequisites: ["cargo-total"],
  parSeconds: 300,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.3, adversarial: 0.25, perf: 0.25 },
  similar: [{ name: "Minimum Value to Get Positive Step by Step Sum", lcNumber: 1413 }],
  spec: { kind: "function", name: "triggerIndex", returns: "int", params: [{ type: "vector<int>", name: "readings" }, { type: "long long", name: "limit" }] },
};
