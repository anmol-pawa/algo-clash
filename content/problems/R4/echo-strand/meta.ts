import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "echo-strand",
  region: "R4",
  title: "Echo Strand",
  difficulty: "M",
  patterns: ["hash-design", "sliding-window"],
  signals: ["fixed-length substrings that repeat", "encode a window as a number", "update the key in O(1) as the window slides"],
  prerequisites: ["twin-scripts", "crate-variety"],
  parSeconds: 900,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Repeated DNA Sequences", lcNumber: 187 }],
  spec: { kind: "function", name: "echoes", returns: "vector<string>", params: [{ type: "string", name: "strand" }, { type: "int", name: "k" }] },
};
