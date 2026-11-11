import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

interface Call { op: string; args: number[] }
const enc = (calls: Call[]): string[] => [`[${calls.map((c) => `"${c.op}"`).join(",")}]`, `[${calls.map((c) => `[${c.args.join(",")}]`).join(",")}]`];

/** Random session; mirrors the slot rules so every `slot(i)` call is in range. */
const session = (r: Rng, n: number, universe: number, pInsert: number, pErase: number): string[] => {
  const calls: Call[] = [{ op: "DrumBag", args: [] }];
  const slots: number[] = [];
  const val = () => (universe > 1000 ? r.int(-1000000000, 1000000000) : r.int(-universe, universe));
  for (let i = 0; i < n; ++i) {
    const x = r.next();
    if (x < pInsert) {
      const v = val();
      calls.push({ op: "insert", args: [v] });
      if (!slots.includes(v)) slots.push(v);
    } else if (x < pInsert + pErase) {
      // Half the time erase something that exists.
      const v = slots.length > 0 && r.next() < 0.6 ? slots[r.int(0, slots.length - 1)] : val();
      calls.push({ op: "erase", args: [v] });
      const at = slots.indexOf(v);
      if (at >= 0) { slots[at] = slots[slots.length - 1]; slots.pop(); }
    } else if (slots.length > 0 && x < pInsert + pErase + 0.2) {
      calls.push({ op: "slot", args: [r.int(0, slots.length - 1)] });
    } else {
      calls.push({ op: "size", args: [] });
    }
  }
  return enc(calls);
};

/** Large session using a Map index so generation stays fast at 200k operations. */
const bigSession = (r: Rng, n: number, universe: number, pInsert: number, pErase: number): string[] => {
  const calls: Call[] = [{ op: "DrumBag", args: [] }];
  const slots: number[] = [];
  const where = new Map<number, number>();
  for (let i = 0; i < n; ++i) {
    const x = r.next();
    const v = universe > 1000 ? r.int(-1000000000, 1000000000) : r.int(-universe, universe);
    if (x < pInsert) {
      calls.push({ op: "insert", args: [v] });
      if (!where.has(v)) { where.set(v, slots.length); slots.push(v); }
    } else if (x < pInsert + pErase) {
      const w = slots.length > 0 && r.next() < 0.7 ? slots[r.int(0, slots.length - 1)] : v;
      calls.push({ op: "erase", args: [w] });
      const at = where.get(w);
      if (at !== undefined) {
        const last = slots[slots.length - 1];
        slots[at] = last; where.set(last, at); slots.pop(); where.delete(w);
      }
    } else if (slots.length > 0) {
      calls.push({ op: "slot", args: [r.int(0, slots.length - 1)] });
    } else {
      calls.push({ op: "size", args: [] });
    }
  }
  return enc(calls);
};

const E = (op: string, ...args: number[]): Call => ({ op, args });

export const gen: GenModule = {
  small: (r) => session(r, r.int(1, 14), r.int(1, 5), 0.4, 0.3),
  groups: {
    basic: [
      enc([E("DrumBag"), E("insert", 5), E("insert", 8), E("insert", 5), E("insert", 2), E("erase", 5), E("slot", 0), E("size")]),
      enc([E("DrumBag"), E("erase", 1), E("size"), E("insert", 1), E("erase", 1), E("size")]),
      (r) => session(r, 20, 6, 0.4, 0.3),
    ],
    edge: [
      enc([E("DrumBag"), E("insert", 7), E("erase", 7), E("insert", 7), E("slot", 0), E("size")]),
      enc([E("DrumBag"), E("insert", 1), E("insert", 2), E("insert", 3), E("erase", 3), E("erase", 3), E("slot", 1), E("erase", 1), E("slot", 0), E("size")]),
      enc([E("DrumBag"), E("insert", -1000000000), E("insert", 1000000000), E("insert", 0), E("erase", -1000000000), E("slot", 0), E("slot", 1)]),
      (r) => session(r, 40, 2, 0.4, 0.4),
    ],
    adversarial: [(r) => session(r, 300, 10, 0.4, 0.3), (r) => session(r, 300, 1000000000, 0.5, 0.3), (r) => session(r, 300, 3, 0.35, 0.35)],
    perf: [
      (r) => bigSession(r, 199999, 1000000000, 0.6, 0.15),
      (r) => bigSession(r, 199999, 100000, 0.5, 0.3),
      (r) => bigSession(r, 199999, 1000000000, 0.75, 0.05),
    ],
  },
};
