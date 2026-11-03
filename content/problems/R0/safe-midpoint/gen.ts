import type { GenModule } from "../../../../lib/content/native";

const MAX = 2147483647;

export const gen: GenModule = {
  small: (r) => {
    const lo = r.int(0, 40);
    return [String(lo), String(lo + r.int(0, 40))];
  },
  groups: {
    basic: [["2", "8"], ["3", "6"], ["0", "0"], ["0", "1"], (r) => { const lo = r.int(0, 1000); return [String(lo), String(lo + r.int(0, 1000))]; }],
    edge: [[String(MAX), String(MAX)], ["0", String(MAX)], [String(MAX - 1), String(MAX)], ["0", String(MAX - 1)], ["1", "2"], ["5", "5"], ["4", "5"]],
    adversarial: [
      [String(MAX - 2), String(MAX)],
      ["1073741824", "1073741824"],
      ["1073741824", "1073741825"],
      ["1500000000", "2000000000"],
      (r) => { const lo = r.int(1073741824, MAX); return [String(lo), String(r.int(lo, MAX))]; },
      (r) => { const lo = r.int(0, MAX); return [String(lo), String(r.int(lo, MAX))]; },
    ],
    perf: [],
  },
};
