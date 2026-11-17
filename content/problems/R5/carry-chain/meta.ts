import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "carry-chain",
  region: "R5",
  title: "Carry Chain",
  difficulty: "M",
  patterns: ["linked-list", "math"],
  signals: ["numbers stored as digit lists", "add with carry", "lists of different length", "dummy head builds the answer"],
  prerequisites: ["zipper-merge"],
  parSeconds: 600,
  complexity: { time: "O(max(n, m))", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Add Two Numbers", lcNumber: 2 }],
  spec: { kind: "function", name: "addDigits", returns: "ListNode*", params: [{ type: "ListNode*", name: "a" }, { type: "ListNode*", name: "b" }] },
};
