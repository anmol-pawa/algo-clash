import type { GenModule } from "../../../../lib/content/native";

const s = (hour: number, axles: number): string[] => [String(hour), String(axles)];
const hours = Array.from({ length: 24 }, (_, h) => h);

export const gen: GenModule = {
  small: (r) => s(r.int(0, 23), r.int(1, 8)),
  groups: {
    basic: [s(8, 2), s(3, 5), s(12, 4), s(0, 1), s(23, 8)],
    // Every boundary of every range, with and without the heavy-load fee.
    edge: [5, 6, 7, 9, 10, 15, 16, 18, 19].flatMap((h) => [s(h, 4), s(h, 5)]),
    // All 24 hours, at 7 axles (fee on) and 3 axles (fee off). Disjoint from the other groups.
    adversarial: [...hours.map((h) => s(h, 7)), ...hours.map((h) => s(h, 3))],
    perf: [],
  },
};
