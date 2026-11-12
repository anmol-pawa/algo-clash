import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

interface Call { op: string; args: number[] }
const enc = (calls: Call[]): string[] => [`[${calls.map((c) => `"${c.op}"`).join(",")}]`, `[${calls.map((c) => `[${c.args.join(",")}]`).join(",")}]`];
const E = (op: string, ...args: number[]): Call => ({ op, args });

/** Random session; `dequeue` and `front` only when somebody is waiting. */
const session = (r: Rng, n: number, lo: number, hi: number, pEnq: number): string[] => {
  const calls: Call[] = [E("TwinStackLine")];
  let size = 0;
  for (let i = 0; i < n; ++i) {
    const x = r.next();
    if (size === 0 && x >= pEnq && x < pEnq + 0.1) {
      calls.push(E("empty"));
    } else if (size === 0 || x < pEnq) {
      calls.push(E("enqueue", r.int(lo, hi)));
      ++size;
    } else if (x < pEnq + (1 - pEnq) * 0.5) {
      calls.push(E("dequeue"));
      --size;
    } else if (x < pEnq + (1 - pEnq) * 0.75) {
      calls.push(E("front"));
    } else {
      calls.push(E("empty"));
    }
  }
  return enc(calls);
};

/** `batches` rounds of: enqueue `k` values, then dequeue `k` (a full pour each round). */
const rounds = (k: number, batches: number): string[] => {
  const calls: Call[] = [E("TwinStackLine")];
  let v = 0;
  for (let b = 0; b < batches; ++b) {
    for (let i = 0; i < k; ++i) calls.push(E("enqueue", v++));
    for (let i = 0; i < k; ++i) calls.push(E("dequeue"));
  }
  calls.push(E("empty"));
  return enc(calls);
};

/** Enqueue one, peek, enqueue one, dequeue: interleaving that exposes a refill without the empty guard. */
const interleave = (n: number): string[] => {
  const calls: Call[] = [E("TwinStackLine")];
  for (let i = 0; i < n; ++i) calls.push(E("enqueue", 3 * i), E("enqueue", 3 * i + 1), E("front"), E("enqueue", 3 * i + 2), E("dequeue"));
  for (let i = 0; i < n; ++i) calls.push(E("dequeue"));
  calls.push(E("empty"));
  return enc(calls);
};

export const gen: GenModule = {
  small: (r) => session(r, r.int(1, 14), -4, 4, 0.55),
  groups: {
    basic: [
      enc([E("TwinStackLine"), E("enqueue", 1), E("enqueue", 2), E("front"), E("dequeue"), E("enqueue", 3), E("dequeue"), E("dequeue"), E("empty")]),
      enc([E("TwinStackLine"), E("empty"), E("enqueue", 9), E("empty"), E("dequeue"), E("empty")]),
      (r) => session(r, 25, -9, 9, 0.55),
    ],
    edge: [
      enc([E("TwinStackLine"), E("enqueue", 5), E("front"), E("front"), E("dequeue"), E("empty"), E("enqueue", 6), E("front")]),
      enc([E("TwinStackLine"), E("enqueue", -1000000000), E("enqueue", 1000000000), E("dequeue"), E("dequeue"), E("empty")]),
      () => interleave(5),
      (r) => session(r, 40, 0, 1, 0.6),
    ],
    adversarial: [(r) => session(r, 300, -5, 5, 0.55), () => interleave(60), () => rounds(1, 120), () => rounds(100, 3)],
    perf: [() => rounds(99999, 1), (r) => session(r, 199999, -1000000000, 1000000000, 0.6), () => rounds(1000, 99)],
  },
};
