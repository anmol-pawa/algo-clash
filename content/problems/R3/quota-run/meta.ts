import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "quota-run",
  region: "R3",
  title: "Quota Run",
  difficulty: "H",
  patterns: ["monotonic-deque", "prefix-sum", "sliding-window"],
  signals: ["shortest stretch with sum at least a target", "values can be negative so a plain window fails", "prefix sums plus a deque of candidates"],
  prerequisites: ["tight-patch", "pane-peaks"],
  parSeconds: 1800,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Shortest Subarray with Sum at Least K", lcNumber: 862 }],
  spec: { kind: "function", name: "shortestQuota", returns: "int", params: [{ type: "vector<int>", name: "change" }, { type: "long long", name: "quota" }] },
};
