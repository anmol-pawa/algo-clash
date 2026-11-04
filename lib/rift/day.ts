/** Calendar-day helpers for the Daily Rift. Pure: callers pass the clock and the timezone offset. */

/** Local calendar day "YYYY-MM-DD" for an epoch-ms instant and a UTC offset in minutes (JS `-getTimezoneOffset()`). */
export function dayKey(at: number, offsetMinutes = 0): string {
  const d = new Date(at + offsetMinutes * 60_000);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(d.getUTCFullYear(), 4)}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
}

const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Whole days from day `a` to day `b` (b - a). NaN if either is malformed. */
export function daysBetween(a: string, b: string): number {
  const ma = DAY_RE.exec(a);
  const mb = DAY_RE.exec(b);
  if (!ma || !mb) return NaN;
  const ta = Date.UTC(+ma[1], +ma[2] - 1, +ma[3]);
  const tb = Date.UTC(+mb[1], +mb[2] - 1, +mb[3]);
  return Math.round((tb - ta) / 86_400_000);
}

/** Stable 32-bit FNV-1a hash of a string, used to seed the day's Rift. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; ++i) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
