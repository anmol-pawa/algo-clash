import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "parity-rails",
  region: "R5",
  title: "Parity Rails",
  difficulty: "M",
  patterns: ["linked-list", "two-pointers"],
  signals: ["group by position, not by value", "stable order inside each group", "rewire next pointers in one pass with two tails"],
  prerequisites: ["zipper-merge", "flip-chain"],
  parSeconds: 720,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Odd Even Linked List", lcNumber: 328 }],
  spec: { kind: "function", name: "parityRails", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
