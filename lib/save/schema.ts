/** Save file schema (v1). Pure data, no DOM: everything here is JSON-serialisable. */

export const SAVE_VERSION = 1;

export type MasteryState = "unseen" | "learning" | "solved" | "mastered" | "rusty";

export interface ProblemMastery {
  state: MasteryState;
  /** Number of accepted solves. */
  solves: number;
  /** Epoch ms of the next review, 0 when none is scheduled. */
  due: number;
  /** SRS interval in days. */
  intervalDays: number;
  /** SRS ease factor. */
  ease: number;
  lastSolvedAt: number;
}

export type Verdict = "AC" | "WA" | "TLE" | "RE" | "CE";

export interface Attempt {
  problemId: string;
  at: number;
  verdict: Verdict;
  /** Wall time spent on the problem so far, in seconds. */
  seconds: number;
  hintsUsed: number;
  mode: "learn" | "practice" | "interview";
  /** Optional WA cause tag chosen in the debrief. */
  cause?: string;
}

export interface Draft {
  problemId: string;
  code: string;
  updatedAt: number;
}

export interface Settings {
  textSpeed: "slow" | "normal" | "fast";
  audio: boolean;
  reduceMotion: boolean;
  editor: { theme: "night" | "paper"; fontSize: number; autocomplete: boolean };
}

export interface Profile {
  name: string;
  createdAt: number;
  level: number;
  xp: number;
  bits: number;
  streakDays: number;
  lastPlayedDay: string;
}

/** The small, frequently-saved part of the game state. Attempts and drafts live in their own stores. */
export interface CoreSave {
  version: number;
  profile: Profile;
  /** Structling ids in party order (max 6). */
  party: string[];
  mastery: Record<string, ProblemMastery>;
  settings: Settings;
  flags: Record<string, boolean | number | string>;
}

export const DEFAULT_SETTINGS: Settings = {
  textSpeed: "normal",
  audio: true,
  reduceMotion: false,
  editor: { theme: "night", fontSize: 16, autocomplete: true },
};

export function newCoreSave(now: number, name = "Trainer"): CoreSave {
  return {
    version: SAVE_VERSION,
    profile: { name, createdAt: now, level: 1, xp: 0, bits: 0, streakDays: 0, lastPlayedDay: "" },
    party: [],
    mastery: {},
    settings: { ...DEFAULT_SETTINGS, editor: { ...DEFAULT_SETTINGS.editor } },
    flags: {},
  };
}

const num = (v: unknown, d: number, min = -Infinity, max = Infinity): number =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d;
const str = (v: unknown, d: string, maxLen = 200): string => (typeof v === "string" ? v.slice(0, maxLen) : d);
const rec = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

const MASTERY_STATES: readonly MasteryState[] = ["unseen", "learning", "solved", "mastered", "rusty"];
const VERDICTS: readonly Verdict[] = ["AC", "WA", "TLE", "RE", "CE"];
const MODES = ["learn", "practice", "interview"] as const;

function sanitizeMastery(raw: unknown): ProblemMastery {
  const r = rec(raw);
  return {
    state: MASTERY_STATES.includes(r.state as MasteryState) ? (r.state as MasteryState) : "unseen",
    solves: Math.round(num(r.solves, 0, 0)),
    due: num(r.due, 0, 0),
    intervalDays: num(r.intervalDays, 0, 0),
    ease: num(r.ease, 2.5, 1.3, 3.5),
    lastSolvedAt: num(r.lastSolvedAt, 0, 0),
  };
}

/** Coerce untrusted data (storage, imported JSON) into a valid v1 core save. Never throws. */
export function sanitizeCore(raw: unknown, now: number): CoreSave {
  const r = rec(raw);
  const base = newCoreSave(now);
  const p = rec(r.profile);
  const s = rec(r.settings);
  const e = rec(s.editor);
  const mastery: Record<string, ProblemMastery> = {};
  for (const [id, m] of Object.entries(rec(r.mastery))) mastery[id] = sanitizeMastery(m);
  const flags: CoreSave["flags"] = {};
  for (const [k, v] of Object.entries(rec(r.flags))) {
    if (typeof v === "boolean" || typeof v === "string" || (typeof v === "number" && Number.isFinite(v))) flags[k] = v;
  }
  return {
    version: SAVE_VERSION,
    profile: {
      name: str(p.name, base.profile.name, 24) || base.profile.name,
      createdAt: num(p.createdAt, now, 0),
      level: Math.round(num(p.level, 1, 1, 60)),
      xp: Math.round(num(p.xp, 0, 0)),
      bits: Math.round(num(p.bits, 0, 0)),
      streakDays: Math.round(num(p.streakDays, 0, 0)),
      lastPlayedDay: str(p.lastPlayedDay, "", 10),
    },
    party: Array.isArray(r.party) ? r.party.filter((x): x is string => typeof x === "string").slice(0, 6) : [],
    mastery,
    settings: {
      textSpeed: s.textSpeed === "slow" || s.textSpeed === "fast" ? s.textSpeed : "normal",
      audio: typeof s.audio === "boolean" ? s.audio : true,
      reduceMotion: typeof s.reduceMotion === "boolean" ? s.reduceMotion : false,
      editor: {
        theme: e.theme === "paper" ? "paper" : "night",
        fontSize: Math.round(num(e.fontSize, 16, 12, 24)),
        autocomplete: typeof e.autocomplete === "boolean" ? e.autocomplete : true,
      },
    },
    flags,
  };
}

/** Returns a valid attempt or null when the record is unusable. */
export function sanitizeAttempt(raw: unknown): Attempt | null {
  const r = rec(raw);
  if (typeof r.problemId !== "string" || !r.problemId || !VERDICTS.includes(r.verdict as Verdict)) return null;
  const a: Attempt = {
    problemId: r.problemId.slice(0, 80),
    at: num(r.at, 0, 0),
    verdict: r.verdict as Verdict,
    seconds: num(r.seconds, 0, 0),
    hintsUsed: Math.round(num(r.hintsUsed, 0, 0, 3)),
    mode: MODES.includes(r.mode as (typeof MODES)[number]) ? (r.mode as Attempt["mode"]) : "practice",
  };
  if (typeof r.cause === "string") a.cause = r.cause.slice(0, 60);
  return a;
}

export function sanitizeDraft(raw: unknown): Draft | null {
  const r = rec(raw);
  if (typeof r.problemId !== "string" || !r.problemId || typeof r.code !== "string") return null;
  return { problemId: r.problemId.slice(0, 80), code: r.code.slice(0, 200_000), updatedAt: num(r.updatedAt, 0, 0) };
}
