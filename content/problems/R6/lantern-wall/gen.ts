import type { GenModule } from "../../../../lib/content/native";
import type { Rng } from "../../../../lib/content/rng";

const q = (rows: string[]) => `[${rows.map((s) => `"${s}"`).join(",")}]`;

/** rows x cols grid where each pane is lit with probability `p`. */
function grid(r: Rng, rows: number, cols: number, p: number): string[] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (r.next() < p ? "1" : "0")).join(""));
}
const solid = (rows: number, cols: number, ch: string) => Array.from({ length: rows }, () => ch.repeat(cols));

/** A lit block dropped into a noisy grid so the answer is not tiny. */
function withBlock(r: Rng, rows: number, cols: number, p: number): string[] {
  const g = grid(r, rows, cols, p).map((s) => s.split(""));
  const h = r.int(1, rows);
  const w = r.int(1, cols);
  const top = r.int(0, rows - h);
  const left = r.int(0, cols - w);
  for (let i = top; i < top + h; i++) for (let j = left; j < left + w; j++) g[i][j] = "1";
  return g.map((row) => row.join(""));
}

export const gen: GenModule = {
  small: (r) => [q(grid(r, r.int(1, 6), r.int(1, 6), r.pick([0.3, 0.6, 0.85])))],
  groups: {
    basic: [
      [q(["10100", "10111", "11111", "10010"])],
      [q(["111", "111"])],
      [q(["1011", "1111"])],
      [q(["1"])],
      (r) => [q(grid(r, 5, 6, 0.7))],
    ],
    edge: [
      [q(["0"])],
      [q(["0000", "0000"])],
      [q(["1111111111"])],
      [q(["1", "1", "1", "1", "1"])],
      [q(["101", "010", "101"])],
      [q(["110", "111", "011"])],
      [q(solid(1000, 1, "1"))],
      [q(solid(1, 1000, "1"))],
    ],
    adversarial: [
      [q(solid(300, 300, "1"))],
      [q(Array.from({ length: 300 }, (_, i) => "1".repeat(i + 1) + "0".repeat(299 - i)))],
      [q(Array.from({ length: 300 }, (_, i) => "0".repeat(i) + "1".repeat(300 - i)))],
      [q(Array.from({ length: 200 }, (_, i) => (i % 2 ? "01".repeat(100) : "10".repeat(100))))],
      (r) => [q(withBlock(r, 120, 150, 0.6))],
      (r) => [q(withBlock(r, 200, 80, 0.9))],
      (r) => [q(grid(r, 250, 250, 0.97))],
      [q(Array.from({ length: 250 }, (_, i) => (i % 25 === 24 ? "0".repeat(240) : "1".repeat(240))))],
    ],
    perf: [
      [q(solid(500, 500, "1"))],
      [q(solid(1000, 250, "1"))],
      [q(solid(250, 1000, "1"))],
      (r) => [q(withBlock(r, 500, 500, 0.8))],
      (r) => [q(grid(r, 500, 500, 0.995))],
      [q(Array.from({ length: 500 }, (_, i) => "1".repeat(i + 1) + "0".repeat(499 - i)))],
    ],
  },
};
