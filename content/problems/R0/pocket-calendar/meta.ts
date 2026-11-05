import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "pocket-calendar",
  region: "R0",
  title: "Pocket Calendar",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "fixed lookup table", "leap year rule"],
  prerequisites: [],
  parSeconds: 300,
  complexity: { time: "O(1)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.4, adversarial: 0.4, perf: 0 },
  similar: [{ name: "Day of the Year", lcNumber: 1154 }],
  spec: { kind: "function", name: "dayOfYear", returns: "int", params: [{ type: "int", name: "year" }, { type: "int", name: "month" }, { type: "int", name: "day" }] },
};
