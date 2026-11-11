import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

interface Call { op: string; args: number[] }
const enc = (calls: Call[]): string[] => [`[${calls.map((c) => `"${c.op}"`).join(",")}]`, `[${calls.map((c) => `[${c.args.join(",")}]`).join(",")}]`];
const E = (op: string, ...args: number[]): Call => ({ op, args });

/** Random session over a key universe; half the keys reuse recently touched ones so replaces and removes hit. */
const session = (r: Rng, n: number, keyMax: number, valMax: number, collide = 0): string[] => {
  const calls: Call[] = [E("LockerBoard")];
  const used: number[] = [];
  const key = () => {
    if (used.length > 0 && r.next() < 0.5) return used[r.int(0, used.length - 1)];
    // `collide` > 0 picks keys that share the same residue mod collide (stress a fixed bucket count).
    const k = collide > 0 ? r.int(0, Math.floor(keyMax / collide)) * collide : r.int(0, keyMax);
    if (used.length < 5000) used.push(k);
    return k;
  };
  for (let i = 0; i < n; ++i) {
    const x = r.next();
    if (x < 0.45) calls.push(E("put", key(), r.int(0, valMax)));
    else if (x < 0.7) calls.push(E("get", key()));
    else if (x < 0.9) calls.push(E("remove", key()));
    else calls.push(E("count"));
  }
  return enc(calls);
};

export const gen: GenModule = {
  small: (r) => session(r, r.int(1, 14), r.int(0, 6), r.int(0, 5)),
  groups: {
    basic: [
      enc([E("LockerBoard"), E("put", 7, 70), E("get", 7), E("put", 7, 71), E("get", 7), E("put", 1000007, 5), E("count"), E("remove", 7), E("get", 7), E("count"), E("remove", 7), E("count")]),
      enc([E("LockerBoard"), E("get", 3), E("remove", 3), E("count")]),
      (r) => session(r, 20, 8, 9),
    ],
    edge: [
      enc([E("LockerBoard"), E("put", 0, 0), E("get", 0), E("count"), E("put", 1000000000, 1000000000), E("get", 1000000000), E("remove", 0), E("get", 0), E("count")]),
      enc([E("LockerBoard"), E("put", 5, 0), E("get", 5), E("put", 5, 0), E("count"), E("remove", 5), E("put", 5, 9), E("get", 5), E("count")]),
      // Keys that collide mod 8, 16, 1031: 0, 8, 16, ..., 1031, 2062
      enc([E("LockerBoard"), ...[0, 8, 16, 24, 1031, 2062, 1039].map((k, i) => E("put", k, i + 1)), E("remove", 8), E("get", 16), E("get", 8), E("get", 2062), E("count")]),
      (r) => session(r, 40, 3, 2),
    ],
    adversarial: [(r) => session(r, 300, 10, 1000000000), (r) => session(r, 300, 1000000000, 1000000000), (r) => session(r, 300, 100000, 50, 1031), (r) => session(r, 300, 100000, 50, 8)],
    perf: [
      (r) => session(r, 199999, 1000000000, 1000000000),
      // All keys are multiples of 1031 * 8: any fixed-size table with a small bucket count collapses into one chain.
      (r) => session(r, 199999, 1000000000, 1000000000, 8248),
      (r) => session(r, 199999, 100000, 1000000000, 8),
    ],
  },
};
