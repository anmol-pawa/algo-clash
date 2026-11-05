import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "field-split",
  region: "R0",
  title: "Field Split",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "split a string on a delimiter", "substr(pos, len) takes a length, not an end"],
  prerequisites: [],
  parSeconds: 360,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Split a String in Balanced Strings", lcNumber: 1221 }],
  spec: { kind: "function", name: "splitFields", returns: "vector<string>", params: [{ type: "string", name: "line" }] },
};
