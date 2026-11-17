import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "twin-strands",
  region: "R4",
  title: "Twin Strands",
  difficulty: "M",
  patterns: ["hash-design"],
  signals: ["fixed-length substrings that repeat", "encode a window as one integer", "slide the encoding in O(1)"],
  prerequisites: ["crate-variety"],
  parSeconds: 840,
  complexity: { time: "O(n)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Repeated DNA Sequences", lcNumber: 187 }],
  spec: { kind: "function", name: "countTwinStrands", returns: "int", params: [{ type: "string", name: "dna" }, { type: "int", name: "len" }] },
};
