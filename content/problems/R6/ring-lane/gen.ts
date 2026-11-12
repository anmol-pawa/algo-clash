import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

interface Call { op: string; args: number[] }
const enc = (calls: Call[]): string[] => [`[${calls.map((c) => `"${c.op}"`).join(",")}]`, `[${calls.map((c) => `[${c.args.join(",")}]`).join(",")}]`];
const E = (op: string, ...args: number[]): Call => ({ op, args });

/** Random session; `pOffer` biases towards filling (high) or draining (low) so wraps and full/empty states both occur. */
const session = (r: Rng, cap: number, n: number, valMax: number, pOffer: number): string[] => {
  const calls: Call[] = [E("RingLane", cap)];
  for (let i = 0; i < n; ++i) {
    const x = r.next();
    if (x < pOffer) calls.push(E("offer", r.int(0, valMax)));
    else if (x < pOffer + (1 - pOffer) * 0.5) calls.push(E("poll"));
    else calls.push(E(r.pick(["front", "back", "empty", "full"])));
  }
  return enc(calls);
};

/** Fill the lane, then repeatedly poll one and offer one so the window laps the array many times. */
const lap = (cap: number, rounds: number): string[] => {
  const calls: Call[] = [E("RingLane", cap)];
  for (let i = 0; i < cap; ++i) calls.push(E("offer", i));
  for (let i = 0; i < rounds; ++i) calls.push(E("poll"), E("offer", cap + i), E("back"));
  calls.push(E("front"), E("full"));
  return enc(calls);
};

/** Fill a big lane, then drain it with polls (an erase-from-front implementation moves capacity items each time). */
const drain = (cap: number): string[] => {
  const calls: Call[] = [E("RingLane", cap)];
  for (let i = 0; i < cap; ++i) calls.push(E("offer", i));
  for (let i = 0; i < cap; ++i) calls.push(E("poll"));
  calls.push(E("empty"));
  return enc(calls);
};

export const gen: GenModule = {
  small: (r) => session(r, r.int(1, 4), r.int(1, 16), 9, r.pick([0.4, 0.6])),
  groups: {
    basic: [
      enc([E("RingLane", 2), E("offer", 7), E("offer", 8), E("offer", 9), E("front"), E("poll"), E("offer", 9), E("back"), E("front")]),
      enc([E("RingLane", 3), E("empty"), E("offer", 1), E("offer", 2), E("full"), E("offer", 3), E("full"), E("poll"), E("full"), E("back")]),
      (r) => session(r, 4, 30, 99, 0.5),
    ],
    edge: [
      enc([E("RingLane", 1), E("front"), E("back"), E("poll"), E("offer", 5), E("full"), E("offer", 6), E("front"), E("poll"), E("empty"), E("offer", 0), E("back")]),
      enc([E("RingLane", 2), E("offer", 1), E("offer", 2), E("poll"), E("poll"), E("poll"), E("front"), E("back"), E("offer", 3), E("offer", 4), E("offer", 5), E("back")]),
      enc([E("RingLane", 3), E("offer", 0), E("offer", 1000000000), E("poll"), E("offer", 2), E("offer", 3), E("back"), E("front")]),
      (r) => session(r, 1, 30, 9, 0.5),
    ],
    adversarial: [
      () => lap(5, 200),
      () => lap(7, 300),
      (r) => session(r, 3, 400, 1000000000, 0.55),
      (r) => session(r, 50, 600, 99, 0.65),
    ],
    perf: [
      () => drain(100000),
      () => lap(66000, 22000),
      (r) => session(r, 100000, 199999, 1000000000, 0.6),
      (r) => session(r, 1000, 199999, 1000000000, 0.5),
    ],
  },
};
