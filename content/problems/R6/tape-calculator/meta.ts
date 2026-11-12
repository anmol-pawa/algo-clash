import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tape-calculator",
  region: "R6",
  title: "Tape Calculator",
  difficulty: "M",
  patterns: ["stack"],
  signals: ["operators come after their operands", "expression evaluation", "latest two values are combined"],
  prerequisites: ["crate-brackets"],
  parSeconds: 600,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Evaluate Reverse Polish Notation", lcNumber: 150 }],
  spec: { kind: "function", name: "runTape", returns: "int", params: [{ type: "vector<string>&", name: "tape" }] },
};
