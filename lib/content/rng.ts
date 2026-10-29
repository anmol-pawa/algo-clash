/** Seeded RNG for problem generators (`gen.ts`): same seed, same tests, on every machine. */
export interface Rng {
  /** Float in [0, 1). */
  next(): number;
  /** Integer in [lo, hi], both inclusive. */
  int(lo: number, hi: number): number;
  pick<T>(items: readonly T[]): T;
  shuffle<T>(items: readonly T[]): T[];
  /** `n` ints in [lo, hi]. */
  ints(n: number, lo: number, hi: number): number[];
}

/** mulberry32: small, fast and good enough for test generation. */
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
  return {
    next,
    int,
    pick: (items) => items[int(0, items.length - 1)],
    shuffle(items) {
      const a = [...items];
      for (let i = a.length - 1; i > 0; --i) {
        const j = int(0, i);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    ints: (n, lo, hi) => Array.from({ length: n }, () => int(lo, hi)),
  };
}

/** Stable per-problem, per-group seed so adding a group never reshuffles another. */
export function seedFor(problemId: string, label: string): number {
  let h = 2166136261;
  for (const c of `${problemId}/${label}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
