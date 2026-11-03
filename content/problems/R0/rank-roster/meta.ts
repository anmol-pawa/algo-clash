import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "rank-roster",
  region: "R0",
  title: "Rank Roster",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "custom ordering on a struct", "operator< decides sort order"],
  prerequisites: [],
  parSeconds: 480,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Relative Ranks", lcNumber: 506 }],
  spec: { kind: "function", name: "rankPlayers", returns: "vector<int>", params: [{ type: "vector<vector<int>>", name: "players" }] },
};
