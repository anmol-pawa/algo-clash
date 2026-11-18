import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "chain-sort",
  region: "R5",
  title: "Chain Sort",
  difficulty: "M",
  patterns: ["linked-list", "recursion"],
  signals: ["sort a singly linked list", "O(n log n) time with no random access", "split at the middle, sort halves, merge"],
  prerequisites: ["zipper-merge", "mid-link"],
  parSeconds: 900,
  complexity: { time: "O(n log n)", space: "O(log n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Sort List", lcNumber: 148 }],
  spec: { kind: "function", name: "sortChain", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
