import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tree-depth",
  region: "R0",
  title: "Tree Depth",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["TreeNode*", "check nullptr before dereferencing", "recursion on left and right children"],
  prerequisites: [],
  parSeconds: 480,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Maximum Depth of Binary Tree", lcNumber: 104 }],
  spec: { kind: "function", name: "treeDepth", returns: "int", params: [{ type: "TreeNode*", name: "root" }] },
};
