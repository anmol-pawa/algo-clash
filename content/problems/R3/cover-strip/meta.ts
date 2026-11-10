import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "cover-strip",
  region: "R3",
  title: "Cover Strip",
  difficulty: "H",
  patterns: ["sliding-window", "hash-lookup"],
  signals: ["shortest stretch that contains everything required", "required items can repeat", "grow right until valid, shrink left while valid"],
  prerequisites: ["tight-patch", "tidy-tape", "shuffle-spotter"],
  parSeconds: 1500,
  complexity: { time: "O(n + m)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Minimum Window Substring", lcNumber: 76 }],
  spec: { kind: "function", name: "smallestCover", returns: "string", params: [{ type: "string", name: "tape" }, { type: "string", name: "charms" }] },
};
