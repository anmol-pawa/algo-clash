import type { RecognitionStatement } from "./types";
import { BLITZ_TIME_MS } from "./types";

export interface RecognitionResult {
  /** Every required pattern picked and nothing outside answer + alsoOk. */
  correct: boolean;
  /** Correct and within the time budget: the only outcome the Gym blitz rewards. */
  inTime: boolean;
  hit: string[];
  missed: string[];
  /** Picked patterns that are neither required nor acceptable. */
  wrong: string[];
}

export function gradeRecognition(s: RecognitionStatement, picks: readonly string[], elapsedMs: number): RecognitionResult {
  const picked = [...new Set(picks)];
  const ok = new Set([...s.answer, ...(s.alsoOk ?? [])]);
  const hit = s.answer.filter((a) => picked.includes(a));
  const missed = s.answer.filter((a) => !picked.includes(a));
  const wrong = picked.filter((p) => !ok.has(p));
  const correct = missed.length === 0 && wrong.length === 0;
  return { correct, inTime: correct && elapsedMs <= BLITZ_TIME_MS, hit, missed, wrong };
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Pattern buttons for a statement: the required patterns, any acceptable extras are never offered
 * as distractors, plus `count - answer.length` distractors, shuffled deterministically from `seed` + id.
 * Distractors prefer patterns from neighbouring regions so the choice is a real discrimination.
 */
export function choicesFor(s: RecognitionStatement, allIds: readonly string[], regionOf: (id: string) => string, seed = 0, count = 6): string[] {
  const rng = mulberry32(hashStr(s.id) ^ seed);
  const taken = new Set([...s.answer, ...(s.alsoOk ?? [])]);
  const regionNum = (id: string) => Number(regionOf(id).slice(1));
  const base = Number(s.region.slice(1));
  const pool = allIds.filter((id) => !taken.has(id)).map((id) => ({ id, k: Math.abs(regionNum(id) - base) + rng() * 3 })).sort((a, b) => a.k - b.k);
  const picks = [...s.answer, ...pool.slice(0, Math.max(0, count - s.answer.length)).map((p) => p.id)];
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [picks[i], picks[j]] = [picks[j]!, picks[i]!];
  }
  return picks;
}

export interface BlitzTally {
  total: number;
  correct: number;
  inTime: number;
  accuracy: number;
  /** GDD §1 target: ≥ 90 % accuracy on at least 50 statements, each in time. */
  meetsTarget: boolean;
}

export function tally(results: readonly RecognitionResult[]): BlitzTally {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const inTime = results.filter((r) => r.inTime).length;
  const accuracy = total === 0 ? 0 : inTime / total;
  return { total, correct, inTime, accuracy, meetsTarget: total >= 50 && accuracy >= 0.9 };
}
