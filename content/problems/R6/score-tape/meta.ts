import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "score-tape",
  region: "R6",
  title: "Score Tape",
  difficulty: "E",
  patterns: ["stack"],
  signals: ["commands that look at or undo the latest entries", "undo", "simulate with a stack"],
  prerequisites: ["crate-brackets"],
  parSeconds: 420,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.3, edge: 0.25, adversarial: 0.2, perf: 0.25 },
  similar: [{ name: "Baseball Game", lcNumber: 682 }],
  spec: { kind: "function", name: "totalScore", returns: "long long", params: [{ type: "vector<string>&", name: "commands" }] },
};
