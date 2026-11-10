import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "peak-stretch",
  region: "R3",
  title: "Peak Stretch",
  difficulty: "E",
  patterns: ["sliding-window"],
  signals: ["fixed-size contiguous block", "best total of k in a row", "slide by adding one and dropping one"],
  prerequisites: [],
  parSeconds: 420,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.25, adversarial: 0.15, perf: 0.35 },
  similar: [{ name: "Maximum Average Subarray I", lcNumber: 643 }],
  spec: { kind: "function", name: "peakStretch", returns: "long long", params: [{ type: "vector<int>", name: "readings" }, { type: "int", name: "k" }] },
};
