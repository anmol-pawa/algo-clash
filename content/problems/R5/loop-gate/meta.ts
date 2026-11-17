import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "loop-gate",
  region: "R5",
  title: "Loop Gate",
  difficulty: "M",
  patterns: ["linked-list"],
  signals: ["find where the cycle begins", "constant extra memory", "meeting point then restart one runner from the head"],
  prerequisites: ["chain-loop"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Linked List Cycle II", lcNumber: 142 }],
  spec: { kind: "function", name: "loopGate", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }] },
};
