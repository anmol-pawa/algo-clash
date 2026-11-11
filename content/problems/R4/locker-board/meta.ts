import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "locker-board",
  region: "R4",
  title: "Locker Board",
  difficulty: "M",
  patterns: ["hash-design"],
  signals: ["build a hash map without the library map", "buckets plus collision chains", "put, get and remove by key"],
  prerequisites: ["twin-scripts"],
  parSeconds: 1080,
  complexity: { time: "O(1)", space: "O(n)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.2, perf: 0.4 },
  similar: [{ name: "Design HashMap", lcNumber: 706 }],
  spec: { kind: "design", className: "LockerBoard", ctor: [], methods: [{ name: "put", returns: "void", params: [{ type: "int", name: "key" }, { type: "int", name: "val" }] }, { name: "get", returns: "int", params: [{ type: "int", name: "key" }] }, { name: "remove", returns: "void", params: [{ type: "int", name: "key" }] }, { name: "count", returns: "int", params: [] }] },
};
