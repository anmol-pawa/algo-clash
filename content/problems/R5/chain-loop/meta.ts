import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "chain-loop",
  region: "R5",
  title: "Chain Loop",
  difficulty: "E",
  patterns: ["linked-list"],
  signals: ["does a linked list loop back on itself", "no extra memory allowed", "one runner twice as fast as the other"],
  prerequisites: ["mid-link"],
  parSeconds: 300,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Linked List Cycle", lcNumber: 141 }],
  spec: { kind: "function", name: "chainLoop", returns: "bool", params: [{ type: "ListNode*", name: "head" }] },
};
