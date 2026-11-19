import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

interface Call { op: string; args: number[] }
const enc = (calls: Call[]): string[] => [`[${calls.map((c) => `"${c.op}"`).join(",")}]`, `[${calls.map((c) => `[${c.args.join(",")}]`).join(",")}]`];
const E = (op: string, ...args: number[]): Call => ({ op, args });
const NAME = "BurrowCache";

/** Random session over `keys` distinct keys (a small key pool forces hits, updates and evictions). */
const session = (r: Rng, cap: number, n: number, keys: number, valMax: number, pPut: number, keyBase = 0, keyStep = 1): string[] => {
  const calls: Call[] = [E(NAME, cap)];
  for (let i = 0; i < n; ++i) {
    const key = keyBase + r.int(0, keys - 1) * keyStep;
    calls.push(r.next() < pPut ? E("put", key, r.int(0, valMax)) : E("get", key));
  }
  return enc(calls);
};

/** Fill to capacity, then repeatedly update an existing key while full (wrongly evicting here loses an entry). */
const updateWhileFull = (r: Rng, cap: number, rounds: number): string[] => {
  const calls: Call[] = [E(NAME, cap)];
  for (let i = 0; i < cap; ++i) calls.push(E("put", i, i + 100));
  for (let i = 0; i < rounds; ++i) calls.push(E("put", r.int(0, cap - 1), r.int(0, 999)));
  for (let i = 0; i < cap; ++i) calls.push(E("get", i));
  return enc(calls);
};

/** Keep one hot key alive with gets while a stream of new keys churns the rest. */
const hotKey = (cap: number, n: number): string[] => {
  const calls: Call[] = [E(NAME, cap), E("put", 7, 70)];
  for (let i = 0; i < n; ++i) calls.push(E("put", 1000 + i, i), E("get", 7));
  calls.push(E("get", 1000 + n - 1), E("get", 1000));
  return enc(calls);
};

/** Large capacity, scattered keys: a linear-scan cache does about k/2 work per operation. */
const wide = (r: Rng, cap: number, n: number): string[] => {
  const calls: Call[] = [E(NAME, cap)];
  for (let i = 0; i < cap; ++i) calls.push(E("put", i * 7919 + 13, i));
  for (let i = 0; calls.length < n; ++i) {
    const key = r.int(0, cap - 1) * 7919 + 13;
    calls.push(r.next() < 0.5 ? E("get", key) : E("put", key, r.int(0, 1000000000)));
  }
  return enc(calls);
};

export const gen: GenModule = {
  small: (r) => session(r, r.int(1, 3), r.int(2, 16), r.int(1, 5), 9, 0.55),
  groups: {
    basic: [
      enc([E(NAME, 2), E("put", 1, 10), E("put", 2, 20), E("get", 1), E("put", 3, 30), E("get", 2), E("put", 1, 11), E("put", 4, 40), E("get", 3), E("get", 1), E("get", 4)]),
      enc([E(NAME, 2), E("put", 5, 1), E("put", 6, 2), E("get", 5), E("put", 7, 3), E("get", 6), E("get", 5), E("get", 7)]),
      (r) => session(r, 3, 30, 6, 99, 0.5),
    ],
    edge: [
      enc([E(NAME, 1), E("get", 1), E("put", 1, 5), E("get", 1), E("put", 2, 6), E("get", 1), E("get", 2), E("put", 2, 7), E("get", 2)]),
      enc([E(NAME, 2), E("put", 1, 1), E("put", 2, 2), E("put", 1, 9), E("put", 3, 3), E("get", 2), E("get", 1), E("get", 3)]),
      enc([E(NAME, 3), E("put", 0, 0), E("put", 1000000000, 1000000000), E("get", 0), E("put", 5, 5), E("put", 6, 6), E("get", 1000000000), E("get", 0), E("get", 6)]),
      (r) => session(r, 1, 30, 3, 9, 0.5),
      (r) => updateWhileFull(r, 4, 10),
    ],
    adversarial: [
      (r) => updateWhileFull(r, 6, 60),
      () => hotKey(3, 100),
      (r) => session(r, 5, 500, 8, 1000000000, 0.5),
      (r) => session(r, 20, 800, 30, 99, 0.45),
      (r) => session(r, 2, 400, 4, 9, 0.6),
    ],
    perf: [
      (r) => wide(r, 50000, 200000),
      (r) => session(r, 100000, 199999, 150000, 1000000000, 0.5, 0, 3),
      (r) => session(r, 1000, 199999, 1500, 1000000000, 0.5),
      () => hotKey(50000, 99990),
    ],
  },
};
