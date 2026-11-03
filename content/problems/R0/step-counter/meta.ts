import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "step-counter",
  region: "R0",
  title: "Step Counter",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["design a class", "constructor with a member initialiser list", "this-> to avoid shadowing", "clamp to a range"],
  prerequisites: [],
  parSeconds: 540,
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Design Parking System", lcNumber: 1603 }],
  spec: { kind: "design", className: "StepCounter", ctor: [{ type: "int", name: "limit" }, { type: "int", name: "start" }], methods: [{ name: "add", returns: "int", params: [{ type: "int", name: "amount" }] }, { name: "total", returns: "int", params: [] }, { name: "reset", returns: "void", params: [] }] },
};
