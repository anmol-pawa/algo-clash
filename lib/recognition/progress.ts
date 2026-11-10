/** Scout School progress lives in the core save's `flags` (no schema change): pure and idempotent. */
import type { CoreSave } from "../save/schema";
import type { RecognitionResult } from "./grade";
import type { RecognitionStatement } from "./types";

/** Latest outcome per statement: 2 = right in time, 1 = right but late, 0 = missed. */
export type ScoutOutcome = 0 | 1 | 2;

export const scoutFlag = (statementId: string): string => `scout:${statementId}`;

export function outcomeOf(r: Pick<RecognitionResult, "correct" | "inTime">): ScoutOutcome {
  return r.inTime ? 2 : r.correct ? 1 : 0;
}

export function scoutOutcome(core: Pick<CoreSave, "flags">, statementId: string): ScoutOutcome | undefined {
  const v = core.flags[scoutFlag(statementId)];
  return v === 0 || v === 1 || v === 2 ? v : undefined;
}

/** Records the latest outcome for a statement (a replay overwrites: mastery means *currently* recognising it). */
export function recordScout(core: CoreSave, statementId: string, outcome: ScoutOutcome): CoreSave {
  if (core.flags[scoutFlag(statementId)] === outcome) return core;
  return { ...core, flags: { ...core.flags, [scoutFlag(statementId)]: outcome } };
}

export interface ScoutProgress {
  seen: number;
  inTime: number;
  total: number;
  /** In-time share of the statements seen so far. */
  accuracy: number;
  /** GDD §1: at least 50 statements seen, at least 90 % right in time. Unlocks the free Complexity Compass reading. */
  mastered: boolean;
}

export const MASTERY_MIN_SEEN = 50;
export const MASTERY_ACCURACY = 0.9;

export function scoutProgress(core: Pick<CoreSave, "flags">, statements: readonly RecognitionStatement[]): ScoutProgress {
  let seen = 0;
  let inTime = 0;
  for (const s of statements) {
    const o = scoutOutcome(core, s.id);
    if (o === undefined) continue;
    seen++;
    if (o === 2) inTime++;
  }
  const accuracy = seen === 0 ? 0 : inTime / seen;
  return { seen, inTime, total: statements.length, accuracy, mastered: seen >= MASTERY_MIN_SEEN && accuracy >= MASTERY_ACCURACY };
}

/**
 * The next round: unseen statements first, then the ones last missed or answered late, then the in-time ones
 * (oldest order), `size` long, with a deterministic shuffle inside each band from `seed`.
 */
export function pickRound(core: Pick<CoreSave, "flags">, statements: readonly RecognitionStatement[], size = 10, seed = 0): RecognitionStatement[] {
  const band = (s: RecognitionStatement): number => {
    const o = scoutOutcome(core, s.id);
    return o === undefined ? 0 : o === 2 ? 2 : 1;
  };
  let a = (seed ^ 0x9e3779b9) >>> 0;
  const rnd = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return statements
    .map((s) => ({ s, k: band(s) + rnd() * 0.99 }))
    .sort((x, y) => x.k - y.k)
    .slice(0, size)
    .map((x) => x.s);
}
