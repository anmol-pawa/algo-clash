import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "mirror-twins",
  region: "R5",
  title: "Mirror Twins",
  difficulty: "M",
  patterns: ["linked-list", "hash-lookup"],
  signals: ["deep copy of a structure with an extra pointer", "extra pointers can point anywhere, even forward", "map old node to new node, or weave the copies into the list"],
  prerequisites: ["flip-chain", "mid-link"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Copy List with Random Pointer", lcNumber: 138 }],
  spec: { kind: "function", name: "copyChain", returns: "Node*", params: [{ type: "Node*", name: "head" }], randomNode: true },
};
