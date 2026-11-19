import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "burrow-cache",
  region: "R5",
  title: "Burrow Cache",
  difficulty: "M",
  patterns: ["linked-list", "hash-lookup", "design-ds"],
  signals: ["evict the least recently used", "every operation must be O(1)", "need to move an item to the front from the middle", "hash map into a doubly linked list"],
  prerequisites: ["flip-chain", "mirror-twins"],
  parSeconds: 1200,
  complexity: { time: "O(1)", space: "O(k)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.2, perf: 0.35 },
  similar: [{ name: "LRU Cache", lcNumber: 146 }],
  spec: {
    kind: "design",
    className: "BurrowCache",
    ctor: [{ type: "int", name: "capacity" }],
    methods: [
      { name: "get", returns: "int", params: [{ type: "int", name: "key" }] },
      { name: "put", returns: "void", params: [{ type: "int", name: "key" }, { type: "int", name: "value" }] },
    ],
  },
};
