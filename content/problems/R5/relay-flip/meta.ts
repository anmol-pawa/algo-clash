import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "relay-flip",
  region: "R5",
  title: "Relay Flip",
  difficulty: "H",
  patterns: ["linked-list"],
  signals: ["reverse in blocks of fixed size", "leftover block shorter than k stays as it is", "dummy head plus remember the node before each block"],
  prerequisites: ["flip-chain", "zipper-merge"],
  parSeconds: 1200,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Reverse Nodes in k-Group", lcNumber: 25 }],
  spec: { kind: "function", name: "flipRelays", returns: "ListNode*", params: [{ type: "ListNode*", name: "head" }, { type: "int", name: "k" }] },
};
