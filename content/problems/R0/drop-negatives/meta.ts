import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "drop-negatives",
  region: "R0",
  title: "Drop Negatives",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "ListNode", "the head itself may be removed", "nullptr marks the end"],
  prerequisites: [],
  parSeconds: 420,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Remove Linked List Elements", lcNumber: 203 }],
  spec: { kind: "function", name: "dropNegatives", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
