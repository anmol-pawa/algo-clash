import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const t = (year: number, month: number, day: number): string[] => [String(year), String(month), String(day)];
const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const monthLen = (y: number, m: number) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

function randomDate(r: Rng, years: readonly number[] | null): string[] {
  const y = years ? r.pick(years) : r.int(1, 9999);
  const m = r.int(1, 12);
  return t(y, m, r.int(1, monthLen(y, m)));
}

const CENTURIES = [1900, 2000, 2100, 2400, 100, 400, 1600, 9600];

export const gen: GenModule = {
  small: (r) => randomDate(r, null),
  groups: {
    basic: [t(2023, 1, 31), t(2024, 3, 1), t(1900, 12, 31), t(2023, 1, 1), (r) => randomDate(r, null)],
    edge: [
      t(2024, 2, 28), t(2024, 2, 29), t(2023, 2, 28), t(2023, 3, 1), t(2024, 12, 31), t(2023, 12, 31),
      t(1, 1, 1), t(9999, 12, 31), t(2024, 1, 1), t(2024, 2, 1),
    ],
    // Century years: 1900/2100 are not leap, 2000/2400 are. Probe the days around February's end.
    adversarial: [
      ...CENTURIES.flatMap((y) => [t(y, 2, 28), t(y, 3, 1), t(y, 12, 30)]),
      t(2000, 2, 29), t(2400, 2, 29),
      (r) => randomDate(r, [4, 8, 1996, 2004, 2020, 2096]),
    ],
    perf: [],
  },
};
