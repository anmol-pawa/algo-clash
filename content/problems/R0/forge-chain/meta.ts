import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "forge-chain",
  region: "R0",
  title: "Forge Chain",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "build a ListNode list with new", "return nullptr for empty input", "keep a tail pointer"],
  prerequisites: [],
  parSeconds: 420,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Merge Two Sorted Lists", lcNumber: 21 }],
  spec: { kind: "function", name: "forgeChain", returns: "ListNode*", params: [{ type: "vector<int>", name: "values" }] },
};
