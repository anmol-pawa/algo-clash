import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tight-patch",
  region: "R3",
  title: "Tight Patch",
  difficulty: "M",
  patterns: ["sliding-window"],
  signals: ["shortest contiguous stretch", "sum at least target", "all values positive so the sum only grows"],
  prerequisites: ["peak-stretch"],
  parSeconds: 840,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Minimum Size Subarray Sum", lcNumber: 209 }],
  spec: { kind: "function", name: "tightPatch", returns: "int", params: [{ type: "vector<int>", name: "power" }, { type: "long long", name: "need" }] },
};
