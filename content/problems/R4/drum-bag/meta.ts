import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "drum-bag",
  region: "R4",
  title: "Drum Bag",
  difficulty: "M",
  patterns: ["hash-design"],
  signals: ["O(1) insert, erase and index access", "array plus hash map of positions", "swap with the last to delete"],
  prerequisites: ["twin-scripts"],
  parSeconds: 900,
  complexity: { time: "O(1)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Insert Delete GetRandom O(1)", lcNumber: 380 }],
  spec: { kind: "design", className: "DrumBag", ctor: [], methods: [{ name: "insert", returns: "bool", params: [{ type: "int", name: "val" }] }, { name: "erase", returns: "bool", params: [{ type: "int", name: "val" }] }, { name: "slot", returns: "int", params: [{ type: "int", name: "i" }] }, { name: "size", returns: "int", params: [] }] },
};
