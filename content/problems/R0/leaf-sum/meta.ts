import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "leaf-sum",
  region: "R0",
  title: "Leaf Sum",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "TreeNode", "a leaf has two null children", "recursion with a null check"],
  prerequisites: [],
  parSeconds: 480,
  complexity: { time: "O(n)", space: "O(h)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Sum of Left Leaves", lcNumber: 404 }],
  spec: { kind: "function", name: "leafSum", returns: "int", params: [{ type: "TreeNode*", name: "root" }] },
};
