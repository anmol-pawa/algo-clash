import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "flip-chain",
  region: "R5",
  title: "Flip Chain",
  difficulty: "E",
  patterns: ["linked-list"],
  signals: ["reverse the order of a singly linked list", "in place, no new nodes", "each node must point backwards"],
  prerequisites: [],
  parSeconds: 300,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Reverse Linked List", lcNumber: 206 }],
  spec: { kind: "function", name: "flipChain", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
