import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "middle-link",
  region: "R0",
  title: "Middle Link",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "ListNode", "count first, then walk", "return a node, not a value"],
  prerequisites: [],
  parSeconds: 420,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Middle of the Linked List", lcNumber: 876 }],
  spec: { kind: "function", name: "middleLink", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
