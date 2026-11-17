import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "spin-chain",
  region: "R5",
  title: "Spin Chain",
  difficulty: "M",
  patterns: ["linked-list", "two-pointers"],
  signals: ["rotate a list by k places, k can exceed the length", "close the list into a ring, then cut it at the right place", "reduce k modulo the length"],
  prerequisites: ["tail-snip", "mid-link"],
  parSeconds: 720,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Rotate List", lcNumber: 61 }],
  spec: { kind: "function", name: "spinChain", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }, { type: "int", name: "k" }] },
};
