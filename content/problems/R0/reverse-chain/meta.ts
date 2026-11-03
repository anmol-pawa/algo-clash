import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "reverse-chain",
  region: "R0",
  title: "Reverse Chain",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["singly linked list", "ListNode*", "rewire next pointers in place"],
  prerequisites: [],
  parSeconds: 480,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Reverse Linked List", lcNumber: 206 }],
  spec: { kind: "function", name: "reverseChain", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
