/** Calendar-day helpers for the Daily Rift. Pure: the caller passes the clock and the player's UTC offset. */

export const DAY_MS = 86_400_000;

/** `YYYY-MM-DD` for the player's local day. `tzOffsetMin` is `-new Date().getTimezoneOffset()` (minutes east of UTC). */
export function dayKey(at: number, tzOffsetMin = 0): string {
  return new Date(at + tzOffsetMin * 60_000).toISOString().slice(0, 10);
}

/** Whole days since 1970-01-01 for a `YYYY-MM-DD` key, or NaN when malformed. */
export function dayNumber(key: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return NaN;
  const t = Date.parse(`${key}T00:00:00Z`);
  return Number.isFinite(t) ? Math.round(t / DAY_MS) : NaN;
}

/** Days from `a` to `b` (positive when `b` is later). NaN when either key is malformed. */
export const daysBetween = (a: string, b: string): number => dayNumber(b) - dayNumber(a);

/** FNV-1a 32-bit hash: a stable seed from any string, the same on every machine. */
export function hashSeed(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; ++i) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
