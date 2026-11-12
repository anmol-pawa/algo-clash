import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tidy-route",
  region: "R6",
  title: "Tidy Route",
  difficulty: "M",
  patterns: ["stack"],
  signals: ["a path where one token undoes the previous one", "split on a separator and process tokens in order", "undo the most recent name"],
  prerequisites: ["crate-brackets"],
  parSeconds: 600,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Simplify Path", lcNumber: 71 }],
  spec: { kind: "function", name: "tidyRoute", returns: "string", params: [{ type: "string", name: "route" }] },
};
