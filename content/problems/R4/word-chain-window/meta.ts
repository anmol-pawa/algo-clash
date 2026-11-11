import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "word-chain-window",
  region: "R4",
  title: "Word Chain Window",
  difficulty: "H",
  patterns: ["hash-design", "sliding-window"],
  signals: ["fixed-size window made of equal-length tokens", "order does not matter, counts do", "slide by whole tokens, once per alignment"],
  prerequisites: ["crate-variety", "longest-echo"],
  parSeconds: 1800,
  complexity: { time: "O(n·w)", space: "O(k·w)" },
  timeLimitMs: 1500,
  testWeights: { basic: 0.15, edge: 0.15, adversarial: 0.3, perf: 0.4 },
  similar: [{ name: "Substring with Concatenation of All Words", lcNumber: 30 }],
  spec: { kind: "function", name: "chainStarts", returns: "vector<int>", params: [{ type: "string", name: "text" }, { type: "vector<string>", name: "words" }] },
};
