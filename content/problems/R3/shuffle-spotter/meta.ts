import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "shuffle-spotter",
  region: "R3",
  title: "Shuffle Spotter",
  difficulty: "M",
  patterns: ["sliding-window"],
  signals: ["window of fixed length", "same letters in any order", "compare letter counts, not strings"],
  prerequisites: ["peak-stretch", "tidy-tape"],
  parSeconds: 840,
  complexity: { time: "O(n)", space: "O(1)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Find All Anagrams in a String", lcNumber: 438 }, { name: "Permutation in String", lcNumber: 567 }],
  spec: { kind: "function", name: "countShuffles", returns: "int", params: [{ type: "string", name: "text" }, { type: "string", name: "word" }] },
};
