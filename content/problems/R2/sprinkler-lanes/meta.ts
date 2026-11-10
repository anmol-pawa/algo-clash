import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "sprinkler-lanes",
  region: "R2",
  title: "Sprinkler Lanes",
  difficulty: "M",
  patterns: ["prefix-sum"],
  signals: ["many range updates", "only the final array is needed", "add v to every cell in [l, r]"],
  prerequisites: ["range-ledger"],
  parSeconds: 600,
  complexity: { time: "O(lanes + jobs)", space: "O(lanes)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Corporate Flight Bookings", lcNumber: 1109 }, { name: "Range Addition", lcNumber: 370 }],
  spec: { kind: "function", name: "finalLevels", returns: "vector<long long>", params: [{ type: "int", name: "lanes" }, { type: "vector<vector<int>>", name: "jobs" }] },
};
