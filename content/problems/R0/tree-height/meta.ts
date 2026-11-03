import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tree-height",
  region: "R0",
  title: "Tree Height",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "TreeNode", "nullptr is the base case", "recursion on left and right"],
  prerequisites: [],
  parSeconds: 420,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Maximum Depth of Binary Tree", lcNumber: 104 }],
  spec: { kind: "function", name: "treeHeight", returns: "int", params: [{ type: "TreeNode*", name: "root" }] },
};
