import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "lantern-wall",
  region: "R6",
  title: "Lantern Wall",
  difficulty: "H",
  patterns: ["monotonic-stack"],
  signals: ["largest all-ones rectangle in a binary grid", "reduce each row to a histogram of heights", "run the histogram stack once per row"],
  prerequisites: ["skyline-hall"],
  parSeconds: 2100,
  complexity: { time: "O(rows * cols)", space: "O(cols)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Maximal Rectangle", lcNumber: 85 }, { name: "Largest Rectangle in Histogram", lcNumber: 84 }],
  spec: { kind: "function", name: "brightestPane", returns: "int", params: [{ type: "const vector<string>&", name: "wall" }] },
};
