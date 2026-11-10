import { MAX_VIS_LENGTH } from "./types";

/** Parse "5, 2 9 1" into integers. Returns an error string for the UI when the text is unusable. */
export function parseNumbers(text: string, max = MAX_VIS_LENGTH): { ok: true; values: number[] } | { ok: false; error: string } {
  const parts = text.split(/[\s,]+/).filter(Boolean);
  if (parts.length > max) return { ok: false, error: `Use at most ${max} numbers.` };
  const values: number[] = [];
  for (const p of parts) {
    if (!/^-?\d{1,4}$/.test(p)) return { ok: false, error: `"${p}" is not a whole number (up to 4 digits).` };
    values.push(Number(p));
  }
  return { ok: true, values };
}
