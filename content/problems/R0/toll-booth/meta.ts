import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "toll-booth",
  region: "R0",
  title: "Toll Booth",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "price depends on ranges", "if / else-if chain with boundaries"],
  prerequisites: [],
  parSeconds: 240,
  complexity: { time: "O(1)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.4, adversarial: 0.4, perf: 0 },
  similar: [{ name: "Fizz Buzz", lcNumber: 412 }],
  spec: { kind: "function", name: "tollFee", returns: "int", params: [{ type: "int", name: "hour" }, { type: "int", name: "axles" }] },
};
