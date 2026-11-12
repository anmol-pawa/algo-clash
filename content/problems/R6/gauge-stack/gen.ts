import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

interface Call { op: string; args: number[] }
const enc = (calls: Call[]): string[] => [`[${calls.map((c) => `"${c.op}"`).join(",")}]`, `[${calls.map((c) => `[${c.args.join(",")}]`).join(",")}]`];
const E = (op: string, ...args: number[]): Call => ({ op, args });

/** Random session that never pops, tops or reads `low` on an empty stack. */
const session = (r: Rng, n: number, lo: number, hi: number, pPush: number): string[] => {
  const calls: Call[] = [E("GaugeStack")];
  let size = 0;
  for (let i = 0; i < n; ++i) {
    const x = r.next();
    if (size === 0 || x < pPush) {
      calls.push(E("push", r.int(lo, hi)));
      ++size;
    } else if (x < pPush + (1 - pPush) / 3) {
      calls.push(E("pop"));
      --size;
    } else if (x < pPush + (2 * (1 - pPush)) / 3) {
      calls.push(E("top"));
    } else {
      calls.push(E("low"));
    }
  }
  return enc(calls);
};

/** Push `up` values from `f(i)`, then alternate low and pop until empty. */
const ramp = (up: number, f: (i: number) => number): string[] => {
  const calls: Call[] = [E("GaugeStack")];
  for (let i = 0; i < up; ++i) calls.push(E("push", f(i)));
  for (let i = 0; i < up; ++i) calls.push(E("low"), E("pop"));
  return enc(calls);
};

/** Push `up` values, then query the minimum `lows` times without popping (a rescan costs up * lows). */
const hammer = (up: number, lows: number, f: (i: number) => number): string[] => {
  const calls: Call[] = [E("GaugeStack")];
  for (let i = 0; i < up; ++i) calls.push(E("push", f(i)));
  for (let i = 0; i < lows; ++i) calls.push(E("low"));
  return enc(calls);
};

export const gen: GenModule = {
  small: (r) => session(r, r.int(1, 14), -4, 4, 0.5),
  groups: {
    basic: [
      enc([E("GaugeStack"), E("push", 5), E("push", 3), E("push", 3), E("push", 8), E("low"), E("pop"), E("pop"), E("low"), E("pop"), E("low"), E("top")]),
      enc([E("GaugeStack"), E("push", 2), E("low"), E("push", 1), E("low"), E("pop"), E("low"), E("top")]),
      (r) => session(r, 25, -9, 9, 0.5),
    ],
    edge: [
      enc([E("GaugeStack"), E("push", 7), E("top"), E("low"), E("pop"), E("push", -7), E("low")]),
      enc([E("GaugeStack"), E("push", 4), E("push", 4), E("push", 4), E("pop"), E("low"), E("pop"), E("low"), E("pop")]),
      enc([E("GaugeStack"), E("push", 1000000000), E("push", -1000000000), E("low"), E("pop"), E("low"), E("top")]),
      (r) => session(r, 40, 0, 1, 0.55),
    ],
    adversarial: [
      (r) => session(r, 300, -5, 5, 0.6),
      (r) => session(r, 300, -1000000000, 1000000000, 0.55),
      () => ramp(150, (i) => 150 - i),
      () => ramp(150, (i) => i),
    ],
    perf: [
      () => ramp(66000, (i) => 66000 - i),
      () => ramp(66000, () => 1),
      (r) => session(r, 199999, -1000000000, 1000000000, 0.7),
      () => hammer(50000, 149999, (i) => 50000 - i),
    ],
  },
};
