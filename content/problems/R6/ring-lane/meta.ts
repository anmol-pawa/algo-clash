import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "ring-lane",
  region: "R6",
  title: "Ring Lane",
  difficulty: "M",
  patterns: ["queue", "design-ds"],
  signals: ["fixed capacity queue", "reuse freed slots instead of shifting", "indices that wrap around with modulo"],
  prerequisites: ["twin-stack-line"],
  parSeconds: 780,
  complexity: { time: "O(1)", space: "O(k)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.25, perf: 0.3 },
  similar: [{ name: "Design Circular Queue", lcNumber: 622 }],
  spec: { kind: "design", className: "RingLane", ctor: [{ type: "int", name: "capacity" }], methods: [{ name: "offer", returns: "bool", params: [{ type: "int", name: "val" }] }, { name: "poll", returns: "bool", params: [] }, { name: "front", returns: "int", params: [] }, { name: "back", returns: "int", params: [] }, { name: "empty", returns: "bool", params: [] }, { name: "full", returns: "bool", params: [] }] },
};
