/** Concept cards (GDD §8.2). Sources are hand-written; computed fields come from running real C++ (see lib/content/cardsNative.ts). */

export type CardKind = "mcq" | "multi" | "predict" | "trace" | "compilerError" | "parsons" | "cloze";

interface CardBase {
  /** Unique, kebab-case. */
  id: string;
  /** Region id (R0–R23). */
  region: string;
  tags: string[];
  /** Short question shown above the card body. */
  prompt: string;
  /** Shown after answering; says why, not just what. */
  explanation: string;
}

export interface McqCard extends CardBase { kind: "mcq"; choices: string[]; answer: number }
export interface MultiCard extends CardBase { kind: "multi"; choices: string[]; answers: number[] }
/** Program with a `main`; the player types what it prints. Answer = real stdout. */
export interface PredictCard extends CardBase { kind: "predict"; code: string }
/** Like predict but the program prints one value the player must track (e.g. a loop variable). Answer = real stdout. */
export interface TraceCard extends CardBase { kind: "trace"; code: string }
/** Code that fails to compile. The diagnostic is the real g++ message; the player picks the cause. */
export interface CompilerErrorCard extends CardBase { kind: "compilerError"; code: string; choices: string[]; answer: number }
/** Order the lines. `lines` is the correct order; the program must compile and print `expected` (computed). */
export interface ParsonsCard extends CardBase { kind: "parsons"; lines: string[] }
/** `template` has `___` per blank; `blanks[i]` lists accepted fillers (all verified natively). */
export interface ClozeCard extends CardBase { kind: "cloze"; template: string; blanks: string[][] }

export type Card = McqCard | MultiCard | PredictCard | TraceCard | CompilerErrorCard | ParsonsCard | ClozeCard;

/** Native results keyed by card id (content/cards/generated.json). */
export interface Computed {
  /** predict/trace: stdout; parsons/cloze: stdout of the solved program. */
  output?: string;
  /** compilerError: first g++ error as `line N: message`. */
  diagnostic?: string;
}
export type ComputedMap = Record<string, Computed>;

export type Response =
  | { kind: "mcq"; choice: number }
  | { kind: "compilerError"; choice: number }
  | { kind: "multi"; choices: number[] }
  | { kind: "predict"; text: string }
  | { kind: "trace"; text: string }
  | { kind: "parsons"; lines: string[] }
  | { kind: "cloze"; blanks: string[] };

export interface Grade {
  correct: boolean;
  /** Per-item correctness for multi-part answers (blanks, choices); empty otherwise. */
  parts: boolean[];
}
