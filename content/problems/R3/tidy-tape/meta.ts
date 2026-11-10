import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "tidy-tape",
  region: "R3",
  title: "Tidy Tape",
  difficulty: "M",
  patterns: ["sliding-window"],
  signals: ["longest contiguous stretch", "no symbol more than m times", "shrink from the left while a count is too high"],
  prerequisites: ["peak-stretch"],
  parSeconds: 840,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Longest Substring Without Repeating Characters", lcNumber: 3 }],
  spec: { kind: "function", name: "longestTidy", returns: "int", params: [{ type: "string", name: "tape" }, { type: "int", name: "m" }] },
};
