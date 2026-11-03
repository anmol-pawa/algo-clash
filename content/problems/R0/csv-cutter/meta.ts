import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "csv-cutter",
  region: "R0",
  title: "Comma Cutter",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "split a string on a separator", "keep empty pieces"],
  prerequisites: [],
  parSeconds: 420,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.3, adversarial: 0.2, perf: 0.3 },
  similar: [{ name: "Split Strings by Separator", lcNumber: 2788 }],
  spec: { kind: "function", name: "cutFields", returns: "vector<string>", params: [{ type: "const string&", name: "line" }] },
};
