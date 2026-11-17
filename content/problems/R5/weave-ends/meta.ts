import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "weave-ends",
  region: "R5",
  title: "Weave Ends",
  difficulty: "M",
  patterns: ["linked-list", "two-pointers"],
  signals: ["interleave the front with the reversed back", "in place on a singly linked list", "find the middle, reverse a half, merge"],
  prerequisites: ["mid-link", "flip-chain", "zipper-merge"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Reorder List", lcNumber: 143 }],
  spec: { kind: "function", name: "weaveEnds", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
