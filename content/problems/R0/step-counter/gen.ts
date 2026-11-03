import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

interface Call { op: string; args: number[] }
const enc = (calls: Call[]): string[] => [`[${calls.map((c) => `"${c.op}"`).join(",")}]`, `[${calls.map((c) => `[${c.args.join(",")}]`).join(",")}]`];
const session = (r: Rng, limit: number, start: number, n: number, amp: number): string[] => {
  const calls: Call[] = [{ op: "StepCounter", args: [limit, start] }];
  for (let i = 0; i < n; ++i) {
    const x = r.next();
    if (x < 0.65) calls.push({ op: "add", args: [r.int(-amp, amp)] });
    else if (x < 0.9) calls.push({ op: "total", args: [] });
    else calls.push({ op: "reset", args: [] });
  }
  return enc(calls);
};

export const gen: GenModule = {
  small: (r) => {
    const limit = r.int(1, 12);
    return session(r, limit, r.int(0, limit), r.int(1, 12), 15);
  },
  groups: {
    basic: [
      enc([{ op: "StepCounter", args: [10, 3] }, { op: "add", args: [4] }, { op: "add", args: [20] }, { op: "total", args: [] }]),
      enc([{ op: "StepCounter", args: [5, 2] }, { op: "add", args: [-9] }, { op: "reset", args: [] }, { op: "total", args: [] }]),
      enc([{ op: "StepCounter", args: [8, 8] }, { op: "total", args: [] }]),
      (r) => session(r, 20, 5, 15, 10),
    ],
    edge: [
      enc([{ op: "StepCounter", args: [1, 0] }, { op: "add", args: [1] }, { op: "add", args: [1] }, { op: "add", args: [-1] }, { op: "add", args: [-5] }, { op: "total", args: [] }]),
      enc([{ op: "StepCounter", args: [1000000, 1000000] }, { op: "add", args: [1000000] }, { op: "add", args: [-1000000] }, { op: "reset", args: [] }, { op: "total", args: [] }]),
      enc([{ op: "StepCounter", args: [7, 0] }, { op: "reset", args: [] }, { op: "reset", args: [] }, { op: "total", args: [] }]),
      (r) => session(r, 3, 1, 30, 4),
    ],
    adversarial: [(r) => session(r, 50, 25, 300, 40), (r) => session(r, 1000000, 500000, 300, 1000000), (r) => session(r, 2, 2, 200, 2)],
    perf: [(r) => session(r, 1000000, 0, 199999, 1000000), (r) => session(r, 1000, 500, 199999, 600), (r) => session(r, 5, 3, 199999, 3)],
  },
};
