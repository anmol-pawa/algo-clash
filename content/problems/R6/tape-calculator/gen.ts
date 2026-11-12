import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const tape = (tokens: string[]) => [`[${tokens.map((t) => `"${t}"`).join(",")}]`];

/**
 * Random valid tape with `operands` numbers. `ops` limits the operators used.
 * Every intermediate stays within +-1e9, so it fits in int32 even after one more + or -.
 */
function randomTape(r: Rng, operands: number, ops: string, lo = -20, hi = 20): string[] {
  const tokens: string[] = [];
  const st: number[] = [];
  let left = operands;
  const apply = () => {
    const b = st.pop()!;
    const a = st.pop()!;
    let op = ops[r.int(0, ops.length - 1)];
    let v = 0;
    if (op === "/" && b === 0) op = "+";
    if (op === "*" && Math.abs(a * b) > 1e9) op = "-";
    if (op === "+") v = a + b;
    else if (op === "-") v = a - b;
    else if (op === "*") v = a * b;
    else v = Math.trunc(a / b);
    if (Math.abs(v) > 1e9) {
      // Keep every value within +-1e9 so a later + or - cannot overflow int32.
      if (b === 0) {
        op = "+";
        v = a;
      } else {
        op = "/";
        v = Math.trunc(a / b);
      }
    }
    tokens.push(op);
    st.push(v);
  };
  while (left > 0 || st.length > 1) {
    if (st.length >= 2 && (left === 0 || r.int(0, 1) === 0)) apply();
    else {
      const x = r.int(lo, hi);
      tokens.push(String(x));
      st.push(x);
      left--;
    }
  }
  return tokens;
}

export const gen: GenModule = {
  small: (r) => tape(randomTape(r, r.int(1, 6), "+-*/", -9, 9)),
  groups: {
    basic: [
      tape(["2", "3", "+", "4", "*"]),
      tape(["10", "2", "-"]),
      tape(["-7", "2", "/"]),
      tape(["4", "13", "5", "/", "+"]),
      (r) => tape(randomTape(r, 8, "+-*/")),
    ],
    edge: [
      tape(["42"]),
      tape(["-7"]),
      tape(["0", "5", "/"]),
      tape(["7", "-2", "/"]),
      tape(["-7", "-2", "/"]),
      tape(["-1000000", "-1000000", "*"]),
      tape(["1000000", "1000000", "*", "-1000000", "*"]),
      tape(["3", "-4", "-"]),
    ],
    adversarial: [
      (r) => tape(randomTape(r, 300, "+-*/", -1000000, 1000000)),
      (r) => tape(randomTape(r, 300, "-/", -50, 50)),
      tape([...Array.from({ length: 200 }, (_, i) => String(i - 100)), ...new Array<string>(199).fill("+")]),
      tape(["1", ...Array.from({ length: 150 }, () => ["2", "-"]).flat()]),
    ],
    perf: [
      (r) => tape(randomTape(r, 50001, "+-*/", -9, 9)),
      tape([...new Array<string>(50001).fill("9"), ...new Array<string>(50000).fill("+")]),
      tape(["1", ...Array.from({ length: 50000 }, () => ["2", "+"]).flat()]),
      (r) => tape(randomTape(r, 50001, "+-", -9, 9)),
    ],
  },
};
