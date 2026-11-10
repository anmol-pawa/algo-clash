import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "odd-picks",
  region: "R3",
  title: "Odd Picks",
  difficulty: "M",
  patterns: ["sliding-window"],
  signals: ["count stretches with exactly k of something", "at most k minus at most k-1", "count could exceed int"],
  prerequisites: ["tight-patch", "flip-budget"],
  parSeconds: 1080,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Count Number of Nice Subarrays", lcNumber: 1248 }, { name: "Subarrays with K Different Integers", lcNumber: 992 }],
  spec: { kind: "function", name: "countExactOdds", returns: "long long", params: [{ type: "vector<int>", name: "nums" }, { type: "int", name: "k" }] },
};
