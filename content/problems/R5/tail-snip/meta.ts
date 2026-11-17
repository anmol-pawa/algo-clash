import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tail-snip",
  region: "R5",
  title: "Tail Snip",
  difficulty: "M",
  patterns: ["linked-list", "two-pointers"],
  signals: ["remove the k-th node counted from the end", "single pass over a singly linked list", "dummy head covers removing the first node"],
  prerequisites: ["mid-link"],
  parSeconds: 600,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Remove Nth Node From End of List", lcNumber: 19 }],
  spec: { kind: "function", name: "snipFromEnd", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }, { type: "int", name: "n" }] },
};
