import type { ProblemMeta } from "../../../../lib/content/types";

export const meta: ProblemMeta = {
  id: "echo-chamber",
  region: "R0",
  title: "Echo Chamber",
  difficulty: "E",
  patterns: ["syntax"],
  signals: ["write this function", "exponent up to 10^18", "answer modulo a prime", "recursion that halves the input"],
  prerequisites: ["cargo-total"],
  parSeconds: 420,
  complexity: { time: "O(log e)", space: "O(log e)" },
  timeLimitMs: 1000,
  testWeights: { basic: 0.2, edge: 0.25, adversarial: 0.25, perf: 0.3 },
  similar: [{ name: "Pow(x, n)", lcNumber: 50 }],
  spec: { kind: "function", name: "echoStrength", returns: "int", params: [{ type: "long long", name: "base" }, { type: "long long", name: "bounces" }] },
};
