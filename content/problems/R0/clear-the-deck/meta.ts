import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "clear-the-deck",
  region: "R0",
  title: "Clear the Deck",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "remove every element equal to a value", "keep the order"],
  prerequisites: [],
  parSeconds: 360,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Remove Element", lcNumber: 27 }],
  spec: { kind: "function", name: "dropAll", returns: "vector<int>", params: [{ type: "vector<int>", name: "deck" }, { type: "int", name: "target" }] },
};
