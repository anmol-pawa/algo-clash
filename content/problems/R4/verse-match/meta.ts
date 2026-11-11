import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "verse-match",
  region: "R4",
  title: "Verse Match",
  difficulty: "M",
  patterns: ["hash-design"],
  signals: ["pattern letters vs words", "one-to-one both ways", "longest consistent prefix"],
  prerequisites: ["twin-scripts"],
  parSeconds: 660,
  complexity: { time: "O(n · w)", space: "O(n · w)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Word Pattern", lcNumber: 290 }],
  spec: { kind: "function", name: "matchingPrefix", returns: "int", params: [{ type: "string", name: "pattern" }, { type: "vector<string>", name: "words" }] },
};
