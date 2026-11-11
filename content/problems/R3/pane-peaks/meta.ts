import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "pane-peaks",
  region: "R3",
  title: "Pane Peaks",
  difficulty: "H",
  patterns: ["monotonic-deque", "sliding-window"],
  signals: ["best value in every window of fixed width", "window slides one step at a time", "old candidates can never win again"],
  prerequisites: ["peak-stretch", "tight-patch"],
  parSeconds: 1500,
  complexity: { time: "O(n)", space: "O(k)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.2, adversarial: 0.25, perf: 0.35 },
  similar: [{ name: "Sliding Window Maximum", lcNumber: 239 }],
  spec: { kind: "function", name: "paneMaxima", returns: "vector<int>", params: [{ type: "vector<int>", name: "heat" }, { type: "int", name: "width" }] },
};
