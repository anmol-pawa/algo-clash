import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "twin-stack-line",
  region: "R6",
  title: "Twin Stack Line",
  difficulty: "E",
  patterns: ["stack", "queue"],
  signals: ["build a queue from stacks", "reversing twice restores order", "amortised O(1)"],
  prerequisites: ["crate-brackets"],
  parSeconds: 480,
  complexity: { time: "O(1)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.25, edge: 0.2, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "Implement Queue using Stacks", lcNumber: 232 }],
  spec: { kind: "design", className: "TwinStackLine", ctor: [], methods: [{ name: "enqueue", returns: "void", params: [{ type: "int", name: "val" }] }, { name: "dequeue", returns: "int", params: [] }, { name: "front", returns: "int", params: [] }, { name: "empty", returns: "bool", params: [] }] },
};
