import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "mid-link",
  region: "R5",
  title: "Mid Link",
  difficulty: "E",
  patterns: ["linked-list"],
  signals: ["middle of a linked list in one pass", "length is unknown", "one runner twice as fast as the other"],
  prerequisites: ["flip-chain"],
  parSeconds: 300,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Middle of the Linked List", lcNumber: 876 }],
  spec: { kind: "function", name: "midLink", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
