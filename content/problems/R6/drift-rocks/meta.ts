import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "drift-rocks",
  region: "R6",
  title: "Drift Rocks",
  difficulty: "M",
  patterns: ["stack"],
  signals: ["items that meet head-on and one or both vanish", "only the most recent survivor can be hit", "simulate collisions in one pass"],
  prerequisites: ["crate-brackets"],
  parSeconds: 600,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Asteroid Collision", lcNumber: 735 }],
  spec: { kind: "function", name: "survivors", returns: "vector<int>", params: [{ type: "vector<int>&", name: "rocks" }] },
};
