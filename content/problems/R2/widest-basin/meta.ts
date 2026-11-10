import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "widest-basin",
  region: "R2",
  title: "Widest Basin",
  difficulty: "M",
  patterns: ["two-pointers"],
  signals: ["best pair of positions", "value depends on the smaller side and the distance", "O(n) required"],
  prerequisites: ["mirror-check"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Container With Most Water", lcNumber: 11 }],
  spec: { kind: "function", name: "bestBasin", returns: "long long", params: [{ type: "vector<int>", name: "heights" }] },
};
