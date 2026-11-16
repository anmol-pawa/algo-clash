import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "ledger-fold",
  region: "R6",
  title: "Ledger Fold",
  difficulty: "H",
  patterns: ["stack"],
  signals: ["evaluate an infix expression with brackets", "operator precedence", "a minus sign that can be unary", "resolve the innermost group first"],
  prerequisites: ["tape-calculator", "crate-brackets"],
  parSeconds: 1800,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Basic Calculator II", lcNumber: 227 }, { name: "Basic Calculator III", lcNumber: 772 }],
  spec: { kind: "function", name: "foldLedger", returns: "int", params: [{ type: "string", name: "ledger" }] },
};
