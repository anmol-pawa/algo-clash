import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const arr = (tokens: string[]) => [`[${tokens.map((t) => `"${t}"`).join(",")}]`];
const LIM = 1e9;

/** Random valid command list of length `n`; every score that lands on the tape stays within +-1e9. */
function session(r: Rng, n: number, lo: number, hi: number, weights = { num: 4, plus: 2, d: 2, h: 2, c: 2 }): string[] {
  const out: string[] = [];
  const tape: number[] = [];
  const bag: string[] = [];
  for (const [k, w] of Object.entries(weights)) for (let i = 0; i < w; ++i) bag.push(k);
  for (let i = 0; i < n; ++i) {
    let kind = bag[r.int(0, bag.length - 1)];
    if (kind === "plus" && tape.length < 2) kind = "num";
    if (kind !== "num" && tape.length < 1) kind = "num";
    if (kind === "plus" && Math.abs(tape[tape.length - 1] + tape[tape.length - 2]) > LIM) kind = "c";
    if (kind === "d" && Math.abs(tape[tape.length - 1] * 2) > LIM) kind = "h";
    if (kind === "num") {
      const x = r.int(lo, hi);
      tape.push(x);
      out.push(String(x));
    } else if (kind === "plus") {
      tape.push(tape[tape.length - 1] + tape[tape.length - 2]);
      out.push("+");
    } else if (kind === "d") {
      tape.push(tape[tape.length - 1] * 2);
      out.push("D");
    } else if (kind === "h") {
      tape.push(Math.trunc(tape[tape.length - 1] / 2));
      out.push("H");
    } else {
      tape.pop();
      out.push("C");
    }
  }
  return out;
}

const many = (n: number, x: string): string[] => new Array<string>(n).fill(x);

export const gen: GenModule = {
  small: (r) => arr(session(r, r.int(0, 8), -9, 9)),
  groups: {
    basic: [
      arr(["5", "2", "C", "D", "+"]),
      arr(["8", "H", "H", "+"]),
      arr(["-4", "D", "C", "C"]),
      (r) => arr(session(r, 20, -9, 9)),
    ],
    edge: [
      arr([]),
      arr(["7", "C"]),
      arr(["-7", "H"]),
      arr(["7", "H", "-7", "H"]),
      arr(["1", "H", "H", "D", "+"]),
      arr(["1000000000", "1000000000", "+"].slice(0, 2)),
      (r) => arr(session(r, 40, -3, 3)),
    ],
    adversarial: [
      (r) => arr(session(r, 300, -1000000000, 1000000000)),
      (r) => arr(session(r, 300, -5, 5, { num: 3, plus: 4, d: 3, h: 3, c: 1 })),
      arr([...many(150, "1000000000"), ...many(150, "C"), "5"]),
    ],
    perf: [
      // 100000 scores of 1e9 each: the sum needs 64 bits.
      arr(many(100000, "1000000000")),
      (r) => arr(session(r, 100000, -1000000000, 1000000000)),
      arr(["1", ...many(99999, "+").map((_, i) => (i % 2 === 0 ? "1" : "+"))]),
    ],
  },
};
