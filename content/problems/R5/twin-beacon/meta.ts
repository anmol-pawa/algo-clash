import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "twin-beacon",
  region: "R5",
  title: "Twin Beacon",
  difficulty: "M",
  patterns: ["linked-list", "two-pointers"],
  signals: ["n + 1 values in 1..n", "exactly one value repeats", "array may not be modified and extra memory must be O(1)", "treat index to value as a next pointer"],
  prerequisites: ["loop-gate"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Find the Duplicate Number", lcNumber: 287 }],
  spec: { kind: "function", name: "findTwin", returns: "int", params: [{ type: "vector<int>", name: "beacons" }] },
};
