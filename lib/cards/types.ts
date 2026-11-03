/** Concept-card model (GDD §8.2). Answers that depend on running code live in `generated.json`, never typed by hand. */
interface Base {
  id: string;
  region: string;
  tags: string[];
  /** One or two sentences shown after answering. */
  explanation: string;
}

export interface McqCard extends Base {
  kind: "mcq";
  prompt: string;
  /** Optional code shown above the options. */
  code?: string;
  options: string[];
  answer: number;
}

export interface MultiCard extends Base {
  kind: "multi";
  prompt: string;
  options: string[];
  /** Indices of every correct option. */
  answers: number[];
}

/** A whole program that prints one value; the player types what it prints. Expected output is generated. */
export interface PredictCard extends Base {
  kind: "predict";
  prompt: string;
  source: string;
}

/** A program that prints one value per line (e.g. a loop variable per iteration). Expected lines are generated. */
export interface TraceCard extends Base {
  kind: "trace";
  prompt: string;
  source: string;
}

/** A program with one compile error. The player taps the offending line; the line and the error kind are generated. */
export interface CompilerErrorCard extends Base {
  kind: "compiler-error";
  prompt: string;
  source: string;
}

/** Shuffle-and-order lines. `lines` are in the correct order; the UI shuffles them with a seed. */
export interface ParsonsCard extends Base {
  kind: "parsons";
  prompt: string;
  lines: string[];
  /** Lines that must stay out (distractors). */
  distractors?: string[];
}

/** Code with `___` blanks; each blank lists the accepted answers (whitespace-insensitive). */
export interface ClozeCard extends Base {
  kind: "cloze";
  prompt: string;
  code: string;
  blanks: string[][];
}

export type Card = McqCard | MultiCard | PredictCard | TraceCard | CompilerErrorCard | ParsonsCard | ClozeCard;
export type CardKind = Card["kind"];

export type Answer =
  | { kind: "mcq"; choice: number }
  | { kind: "multi"; choices: number[] }
  | { kind: "predict"; text: string }
  | { kind: "trace"; lines: string[] }
  | { kind: "compiler-error"; line: number }
  | { kind: "parsons"; order: string[] }
  | { kind: "cloze"; blanks: string[] };

/** What native g++/clang produced for a program card (`content/cards/generated.json`). */
export interface Generated {
  /** stdout of the program, trailing newline trimmed (predict, trace, and the solved cloze/parsons). */
  out?: string;
  /** First error line and the friendly-entry id (compiler-error cards). */
  errorLine?: number;
  errorId?: string | null;
}

export interface GradeResult {
  correct: boolean;
  /** Short feedback shown with the explanation. */
  detail: string;
}
