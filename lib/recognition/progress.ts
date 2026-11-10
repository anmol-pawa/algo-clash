/** Scout School progress lives in the core save's `flags` (no schema change). Pure and idempotent. */
import type { CoreSave } from "../save/schema";
import type { RecognitionResult } from "./grade";
import type { RecognitionStatement } from "./types";

type FlagView = Pick<CoreSave, "flags">;

/** 1 when the latest attempt at this statement was correct and in time, 0 when it was not. Absent = never tried. */
export const statementFlag = (id: string): string => `scout:s:${id}`;
export const SCOUT_MIN_STATEMENTS = 50;
export const SCOUT_TARGET = 0.9;

/** Records one graded answer; the latest attempt replaces the previous one for that statement. */
export function recordBlitz(core: CoreSave, id: string, result: Pick<RecognitionResult, "inTime">): CoreSave {
  const v = result.inTime ? 1 : 0;
  if (core.flags[statementFlag(id)] === v) return core;
  return { ...core, flags: { ...core.flags, [statementFlag(id)]: v } };
}

export interface ScoutProgress {
  attempted: number;
  inTime: number;
  accuracy: number;
  /** GDD §1: >= 90 % in time on at least 50 distinct statements. Unlocks the Complexity Compass hint for free. */
  mastered: boolean;
}

export function scoutProgress(core: FlagView, statements: readonly RecognitionStatement[]): ScoutProgress {
  let attempted = 0;
  let inTime = 0;
  for (const s of statements) {
    const f = core.flags[statementFlag(s.id)];
    if (f === undefined) continue;
    attempted++;
    if (f === 1) inTime++;
  }
  const accuracy = attempted === 0 ? 0 : inTime / attempted;
  return { attempted, inTime, accuracy, mastered: attempted >= SCOUT_MIN_STATEMENTS && accuracy >= SCOUT_TARGET };
}

/** Next round: never-tried statements first, then ones last missed, then the rest; stable and seeded by `rot`. */
export function pickRound(core: FlagView, statements: readonly RecognitionStatement[], size = 10, rot = 0): RecognitionStatement[] {
  const rank = (s: RecognitionStatement) => { const f = core.flags[statementFlag(s.id)]; return f === undefined ? 0 : f === 0 ? 1 : 2; };
  const n = statements.length;
  const rotated = statements.map((s, i) => ({ s, k: (i + rot) % n }));
  return rotated.sort((a, b) => rank(a.s) - rank(b.s) || a.k - b.k).slice(0, size).map((x) => x.s);
}
