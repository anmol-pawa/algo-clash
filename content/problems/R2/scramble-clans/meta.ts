import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "scramble-clans",
  region: "R2",
  title: "Scramble Clans",
  difficulty: "M",
  patterns: ["hash-lookup"],
  signals: ["group by", "same letters rearranged", "canonical form as key"],
  prerequisites: ["scramble-check"],
  parSeconds: 840,
  complexity: { time: "O(n * L log L)", space: "O(n * L)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Group Anagrams", lcNumber: 49 }],
  spec: { kind: "function", name: "largestClan", returns: "int", params: [{ type: "vector<string>", name: "words" }] },
};
