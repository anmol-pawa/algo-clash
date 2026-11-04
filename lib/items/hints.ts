/** The three-rung hint ladder (GDD §6.6). Pure: rung text comes from a problem's `hints.md`. */

export const HINT_TITLES = ["Nudge", "Approach", "Key insight"] as const;

/** Splits `hints.md` into its three rungs; throws if the file does not have exactly the three headings in order. */
export function parseHints(md: string): [string, string, string] {
  const parts = md.split(/^## /m).slice(1);
  if (parts.length !== 3) throw new Error(`hints.md needs exactly 3 sections, found ${parts.length}`);
  const out = parts.map((p, i) => {
    const nl = p.indexOf("\n");
    const title = (nl < 0 ? p : p.slice(0, nl)).trim();
    if (title.toLowerCase() !== HINT_TITLES[i].toLowerCase()) throw new Error(`hint ${i + 1} must be titled "${HINT_TITLES[i]}", got "${title}"`);
    const body = (nl < 0 ? "" : p.slice(nl + 1)).trim();
    if (!body) throw new Error(`hint ${i + 1} is empty`);
    return body;
  });
  return [out[0], out[1], out[2]];
}

export type HintMode = "guided" | "standard" | "interview" | "contest";

/** Rungs available per mode: Guided unlimited and free, Standard needs a token per rung, others none. */
export const hintsAllowed = (mode: HintMode): boolean => mode === "guided" || mode === "standard";
export const hintCostsToken = (mode: HintMode): boolean => mode === "standard";

export type HintRequest = { ok: true; rung: number; spendToken: boolean } | { ok: false; reason: "mode" | "no-more" | "no-token" };

/** Decide whether the next rung may be opened. `used` is rungs opened so far (0..3). */
export function requestHint(mode: HintMode, used: number, tokens: number): HintRequest {
  if (!hintsAllowed(mode)) return { ok: false, reason: "mode" };
  if (used >= 3) return { ok: false, reason: "no-more" };
  const spendToken = hintCostsToken(mode);
  if (spendToken && tokens < 1) return { ok: false, reason: "no-token" };
  return { ok: true, rung: used + 1, spendToken };
}

/** Mastery credit for a solve: assisted wins never advance mastery (GDD §6.2); a Compass costs one tier. */
export function masteryCredit(a: { mode: HintMode; hintsUsed: number; lens: boolean; editorialRead: boolean; compass: boolean }): "none" | "reduced" | "full" {
  if (a.mode === "guided" || a.lens || a.editorialRead || a.hintsUsed > 2) return "none";
  return a.compass ? "reduced" : "full";
}
