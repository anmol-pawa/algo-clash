import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tide-pools",
  region: "R2",
  title: "Tide Pools",
  difficulty: "H",
  patterns: ["two-pointers"],
  signals: ["water held between walls", "each cell is bounded by the best wall on each side", "O(n) time with O(1) extra space"],
  prerequisites: ["widest-basin"],
  parSeconds: 1800,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Trapping Rain Water", lcNumber: 42 }],
  spec: { kind: "function", name: "poolVolume", returns: "long long", params: [{ type: "vector<int>", name: "heights" }] },
};
