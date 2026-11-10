import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "flip-budget",
  region: "R3",
  title: "Flip Budget",
  difficulty: "M",
  patterns: ["sliding-window"],
  signals: ["longest run after at most k changes", "count the bad items inside the window", "bad count may not exceed the budget"],
  prerequisites: ["tidy-tape"],
  parSeconds: 780,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Max Consecutive Ones III", lcNumber: 1004 }],
  spec: { kind: "function", name: "longestAfterFlips", returns: "int", params: [{ type: "vector<int>", name: "lamps" }, { type: "int", name: "budget" }] },
};
