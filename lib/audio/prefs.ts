/** Audio preferences. Kept outside the game save (it is a device preference, not progress). */
export interface AudioPrefs {
  muted: boolean;
  master: number;
  music: number;
  sfx: number;
}

export const DEFAULT_AUDIO_PREFS: AudioPrefs = { muted: false, master: 0.7, music: 0.6, sfx: 0.8 };
export const AUDIO_PREFS_KEY = "algo-clash:audio";

const unit = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : d);

export function sanitizePrefs(raw: unknown): AudioPrefs {
  const r = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_AUDIO_PREFS;
  return { muted: typeof r.muted === "boolean" ? r.muted : d.muted, master: unit(r.master, d.master), music: unit(r.music, d.music), sfx: unit(r.sfx, d.sfx) };
}

export function loadPrefs(storage: Pick<Storage, "getItem"> | undefined): AudioPrefs {
  try {
    const s = storage?.getItem(AUDIO_PREFS_KEY);
    return sanitizePrefs(s ? JSON.parse(s) : undefined);
  } catch {
    return sanitizePrefs(undefined);
  }
}

export function savePrefs(storage: Pick<Storage, "setItem"> | undefined, p: AudioPrefs): void {
  try {
    storage?.setItem(AUDIO_PREFS_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: the preference just does not persist */
  }
}

/** Effective gains for the music and SFX buses. */
export function busGains(p: AudioPrefs): { music: number; sfx: number } {
  if (p.muted) return { music: 0, sfx: 0 };
  return { music: p.master * p.music * 0.5, sfx: p.master * p.sfx * 0.6 };
}
