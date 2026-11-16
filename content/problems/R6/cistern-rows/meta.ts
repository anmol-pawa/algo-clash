import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "cistern-rows",
  region: "R6",
  title: "Cistern Rows",
  difficulty: "H",
  patterns: ["monotonic-stack"],
  signals: ["water held between walls", "fill the basin one horizontal layer at a time", "a taller wall closes every basin on its left"],
  prerequisites: ["skyline-hall", "tide-pools"],
  parSeconds: 1800,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Trapping Rain Water", lcNumber: 42 }],
  spec: { kind: "function", name: "cisternVolume", returns: "long long", params: [{ type: "const vector<int>&", name: "ridge" }] },
};
