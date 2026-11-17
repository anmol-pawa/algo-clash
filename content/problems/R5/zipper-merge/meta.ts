import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "zipper-merge",
  region: "R5",
  title: "Zipper Merge",
  difficulty: "E",
  patterns: ["linked-list", "two-pointers"],
  signals: ["two sorted linked lists", "splice nodes into one sorted list", "dummy head avoids special cases"],
  prerequisites: ["flip-chain"],
  parSeconds: 420,
  complexity: { time: "O(n + m)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Merge Two Sorted Lists", lcNumber: 21 }],
  spec: { kind: "function", name: "zipMerge", returns: "ListNode*", params: [{ type: "ListNode*", name: "a" }, { type: "ListNode*", name: "b" }] },
};
