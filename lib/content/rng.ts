/** Seeded RNG for problem generators (`gen.ts`): same seed, same tests, on every machine. */
export interface Rng {
  /** Float in [0, 1). */
  next(): number;
  /** Integer in [lo, hi], inclusive. */
  int(lo: number, hi: number): number;
  pick<T>(items: readonly T[]): T;
  /** Fisher-Yates, returns a new array. */
  shuffle<T>(items: readonly T[]): T[];
}

/** mulberry32: tiny, fast, good enough for test data. */
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
    shuffle: (items) => {
      const a = [...items];
      for (let i = a.length - 1; i > 0; i--) {
        const j = int(0, i);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };
}
