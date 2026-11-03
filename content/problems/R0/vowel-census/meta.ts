import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "vowel-census",
  region: "R0",
  title: "Vowel Census",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "loop over a string", "count matching characters"],
  prerequisites: [],
  parSeconds: 240,
  timeLimitMs: 1000,
  testWeights: { basic: 0.3, edge: 0.3, adversarial: 0.2, perf: 0.2 },
  similar: [{ name: "Reverse Vowels of a String", lcNumber: 345 }],
  spec: { kind: "function", name: "countVowels", returns: "int", params: [{ type: "string", name: "s" }] },
};
