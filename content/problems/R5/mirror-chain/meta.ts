import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "mirror-chain",
  region: "R5",
  title: "Mirror Chain",
  difficulty: "M",
  patterns: ["linked-list", "two-pointers"],
  signals: ["does it read the same in both directions", "singly linked list, O(1) extra memory", "find the middle, reverse a half, compare"],
  prerequisites: ["mid-link", "flip-chain"],
  parSeconds: 840,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Palindrome Linked List", lcNumber: 234 }],
  spec: { kind: "function", name: "isMirror", returns: "bool", params: [{ type: "ListNode*", name: "head" }] },
};
