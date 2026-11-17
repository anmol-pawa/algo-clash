import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "ledger-slip",
  region: "R6",
  title: "Ledger Slip",
  difficulty: "H",
  patterns: ["stack"],
  signals: ["expression with parentheses", "a minus sign in front of a bracket flips everything inside", "evaluate without building a tree"],
  prerequisites: ["tape-calculator"],
  parSeconds: 1800,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Basic Calculator", lcNumber: 224 }],
  spec: { kind: "function", name: "ledgerTotal", returns: "long long", params: [{ type: "string", name: "slip" }] },
};
