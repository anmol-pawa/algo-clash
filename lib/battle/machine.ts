/** The Scout → Strategise → (Plan) → Code → Judge → Debrief state machine (GDD §5.3). Pure and immutable. */
import type { TestGroup } from "../content/types";
import { FOE_MAX_HP, MAX_HEARTS, MULTIPLIER, RUN_CHIP, applyRust, submitDamage, type Effectiveness } from "./damage";

export type Phase = "scout" | "strategise" | "plan" | "code" | "judging" | "debrief";
export type Outcome = "won" | "fainted" | "retreated" | null;

export interface BattleConfig {
  difficulty: "E" | "M" | "H";
  /** Hards and DP need the Plan step. */
  needsPlan: boolean;
  weights: Record<TestGroup, number>;
  parSeconds: number;
  rusty: boolean;
}

export interface BattleState {
  cfg: BattleConfig;
  phase: Phase;
  outcome: Outcome;
  hearts: number;
  foeHp: number;
  effectiveness: Effectiveness;
  confidence: number | null;
  planCorrect: boolean;
  /** A correct plan absorbs one wrong submission. */
  shield: boolean;
  hintsUsed: number;
  assisted: boolean;
  submits: number;
  runs: number;
  /** Seconds the Code phase has been running. */
  seconds: number;
  /** Set when the editorial has been opened before winning. */
  editorialRead: boolean;
  /** Problem goes to the Rematch list when true. */
  rematch: boolean;
}

export function start(cfg: BattleConfig): BattleState {
  return {
    cfg, phase: "scout", outcome: null, hearts: MAX_HEARTS, foeHp: FOE_MAX_HP, effectiveness: "neutral", confidence: null,
    planCorrect: false, shield: false, hintsUsed: 0, assisted: false, submits: 0, runs: 0, seconds: 0, editorialRead: false, rematch: false,
  };
}

export class IllegalTransition extends Error {}
function need(s: BattleState, ...phases: Phase[]): void {
  if (!phases.includes(s.phase)) throw new IllegalTransition(`not allowed in phase "${s.phase}"`);
}

/** Scout is free. Moving on goes to Strategise. */
export function scoutDone(s: BattleState): BattleState {
  need(s, "scout");
  return { ...s, phase: "strategise" };
}

/** `chosen === null` skips the strategy: neutral, no confidence recorded. */
export function strategise(s: BattleState, eff: Effectiveness, confidence: number | null): BattleState {
  need(s, "strategise");
  if (confidence !== null && (!Number.isInteger(confidence) || confidence < 1 || confidence > 5)) throw new RangeError("confidence is 1..5");
  return { ...s, effectiveness: eff, confidence, phase: s.cfg.needsPlan ? "plan" : "code" };
}

/** A correct plan gives +10 % damage and a one-wrong-submission shield. Skipping is allowed (counts as incorrect). */
export function plan(s: BattleState, correct: boolean): BattleState {
  need(s, "plan");
  return { ...s, planCorrect: correct, shield: correct, phase: "code" };
}

export function useHint(s: BattleState): BattleState {
  need(s, "code");
  const hintsUsed = s.hintsUsed + 1;
  return { ...s, hintsUsed, assisted: s.assisted || hintsUsed > 2 };
}

/** Called when the editorial is opened before the battle is won: the problem becomes assisted. */
export function readEditorial(s: BattleState): BattleState {
  return { ...s, editorialRead: true, assisted: true };
}

export function tick(s: BattleState, dtSeconds: number): BattleState {
  if (s.phase !== "code" && s.phase !== "judging") return s;
  return { ...s, seconds: s.seconds + Math.max(0, dtSeconds) };
}

export function beginJudge(s: BattleState): BattleState {
  need(s, "code");
  return { ...s, phase: "judging" };
}

export interface JudgeReport {
  kind: "run" | "submit";
  /** Run: whether every visible sample passed. Submit: which hidden groups passed fully. */
  samplesPassed?: boolean;
  groups?: Partial<Record<TestGroup, boolean>>;
  /** CE never costs a heart (nothing ran). */
  compileError?: boolean;
}

export interface JudgeResult {
  state: BattleState;
  foeDamage: number;
  heartLost: boolean;
  shieldUsed: boolean;
}

/** Apply a finished judge. Run chips 25 % on a clean pass and never costs a heart; a failing Submit costs one. */
export function applyJudge(s: BattleState, r: JudgeReport): JudgeResult {
  need(s, "judging");
  const back: BattleState = { ...s, phase: "code" };
  const none = (state: BattleState): JudgeResult => ({ state, foeDamage: 0, heartLost: false, shieldUsed: false });
  if (r.compileError) return none(r.kind === "run" ? { ...back, runs: s.runs + 1 } : back);
  if (r.kind === "run") {
    const runs = s.runs + 1;
    if (!r.samplesPassed) return none({ ...back, runs });
    // Chip damage happens once: it only applies while the foe is above the chip floor.
    const floor = Math.round(FOE_MAX_HP * (1 - RUN_CHIP));
    const dmg = s.foeHp > floor ? s.foeHp - floor : 0;
    return { state: { ...back, runs, foeHp: s.foeHp - dmg }, foeDamage: dmg, heartLost: false, shieldUsed: false };
  }
  const submits = s.submits + 1;
  const groups = r.groups ?? {};
  const full = (["basic", "edge", "adversarial", "perf"] as const).every((g) => groups[g]);
  if (full) {
    return { state: { ...s, phase: "debrief", outcome: "won", foeHp: 0, submits, rematch: false }, foeDamage: s.foeHp, heartLost: false, shieldUsed: false };
  }
  const mult = applyRust(MULTIPLIER[s.effectiveness], s.cfg.rusty);
  const hit = submitDamage({ passed: groups, weights: s.cfg.weights, multiplier: mult, hintsUsed: s.hintsUsed, seconds: s.seconds, parSeconds: s.cfg.parSeconds, planCorrect: s.planCorrect });
  const foeHp = Math.max(1, Math.min(s.foeHp, FOE_MAX_HP - hit)); // damage only ever accumulates; the foe never drops below 1 without AC
  const foeDamage = s.foeHp - foeHp;
  if (s.shield) return { state: { ...back, submits, foeHp, shield: false }, foeDamage, heartLost: false, shieldUsed: true };
  const hearts = s.hearts - 1;
  if (hearts <= 0) {
    return { state: { ...s, phase: "debrief", outcome: "fainted", hearts: 0, foeHp, submits, rematch: true }, foeDamage, heartLost: true, shieldUsed: false };
  }
  return { state: { ...back, hearts, foeHp, submits }, foeDamage, heartLost: true, shieldUsed: false };
}

/** Leave the battle. Retreating adds the problem to the Rematch list without losing hearts. */
export function retreat(s: BattleState): BattleState {
  if (s.phase === "debrief") return s;
  return { ...s, phase: "debrief", outcome: "retreated", rematch: true };
}

/** A win counts as assisted (no advance in mastery) after the editorial or more than two hints. */
export function isAssistedWin(s: BattleState): boolean {
  return s.outcome === "won" && s.assisted;
}
