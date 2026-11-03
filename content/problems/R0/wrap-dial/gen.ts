import type { GenModule } from "../../../../lib/content/native";

export const gen: GenModule = {
  small: (r) => [String(r.int(-60, 60)), String(r.int(1, 9))],
  groups: {
    basic: [["7", "5"], ["-1", "5"], ["-10", "5"], ["0", "3"], (r) => [String(r.int(1, 50)), String(r.int(2, 9))]],
    edge: [["0", "1"], ["-1", "1"], ["-1", "100000"], ["5", "5"], ["-5", "5"], ["4", "5"], ["-4", "5"], ["-6", "5"]],
    adversarial: [
      ["1000000000", "100000"],
      ["-1000000000", "100000"],
      ["-999999999", "99991"],
      ["999999999", "99991"],
      (r) => [String(r.int(-1000000000, -1)), String(r.int(1, 100000))],
      (r) => [String(r.int(-1000000000, 1000000000)), String(r.int(1, 100000))],
    ],
    perf: [],
  },
};
