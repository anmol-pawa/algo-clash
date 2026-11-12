import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "gauge-stack",
  region: "R6",
  title: "Gauge Stack",
  difficulty: "M",
  patterns: ["stack", "design-ds"],
  signals: ["stack with an extra O(1) query", "the answer must survive pops", "store a summary next to each element"],
  prerequisites: ["crate-brackets"],
  parSeconds: 600,
  complexity: { time: "O(1)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Min Stack", lcNumber: 155 }],
  spec: { kind: "design", className: "GaugeStack", ctor: [], methods: [{ name: "push", returns: "void", params: [{ type: "int", name: "val" }] }, { name: "pop", returns: "void", params: [] }, { name: "top", returns: "int", params: [] }, { name: "low", returns: "int", params: [] }] },
};
