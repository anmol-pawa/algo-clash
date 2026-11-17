import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "fork-point",
  region: "R5",
  title: "Fork Point",
  difficulty: "M",
  patterns: ["linked-list", "two-pointers"],
  signals: ["two lists that may merge into one shared tail", "compare node identity, not values", "equalise the walk lengths without computing them"],
  prerequisites: ["mid-link", "flip-chain"],
  parSeconds: 600,
  complexity: { time: "O(n + m)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Intersection of Two Linked Lists", lcNumber: 160 }],
  spec: { kind: "function", name: "forkPoint", returns: "ListNode*", params: [{ type: "ListNode*", name: "a" }, { type: "ListNode*", name: "b" }] },
};
