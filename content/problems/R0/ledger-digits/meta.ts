import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "ledger-digits",
  region: "R0",
  title: "Ledger Digits",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "digits of a number", "values beyond 32 bits"],
  prerequisites: [],
  parSeconds: 240,
  complexity: { time: "O(d)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.3, edge: 0.4, adversarial: 0.3, perf: 0 },
  similar: [{ name: "Add Digits", lcNumber: 258 }],
  spec: { kind: "function", name: "digitSum", returns: "int", params: [{ type: "long long", name: "n" }] },
};
