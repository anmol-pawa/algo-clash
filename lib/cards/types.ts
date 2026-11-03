/** Concept card model (GDD §8.2). Sources are authored; generated fields are filled by native runs. */
export type CardKind = "mcq" | "multi" | "complexity" | "trace" | "predict" | "bug" | "compiler-error" | "parsons" | "cloze";

interface Base {
  /** Unique, kebab-case. */
  id: string;
  /** Region id (R0–R23). */
  region: string;
  /** Pattern or topic ids. */
  tags: string[];
  /** The question shown to the player. */
  prompt: string;
  /** Shown after answering, right or wrong. Required. */
  explanation: string;
}

export interface McqCard extends Base {
  kind: "mcq";
  choices: string[];
  answer: number;
}
export interface MultiCard extends Base {
  kind: "multi";
  choices: string[];
  answers: number[];
}
export interface ComplexityCard extends Base {
  kind: "complexity";
  code: string;
  choices: string[];
  answer: number;
}
/** Predict-output and trace share a shape: the program's stdout is the answer. */
export interface PredictSource extends Base {
  kind: "predict" | "trace";
  code: string;
}
export interface PredictCard extends PredictSource {
  /** Exact stdout produced by compiling and running `code` natively. */
  answer: string;
}
export interface BugCard extends Base {
  kind: "bug";
  /** The buggy program. Lines are numbered from 1 in the UI. */
  code: string;
  /** 1-based line holding the bug. */
  bugLine: number;
  /** Replacement for that line that makes the program print `expectFixed`. */
  fixedLine: string;
  expectFixed: string;
}
export interface CompilerErrorSource extends Base {
  kind: "compiler-error";
  /** Program that fails to compile. */
  code: string;
}
export interface CompilerErrorCard extends CompilerErrorSource {
  /** Entry id in `CLANG_ERRORS` for clang's first error on `code`. */
  answer: string;
  /** Line of that first error. */
  errorLine: number;
  /** Answer plus distractor entry ids, in presentation order. */
  choiceIds: string[];
}
export interface ParsonsCard extends Base {
  kind: "parsons";
  /** Correct order. Indentation is part of each line. */
  lines: string[];
  distractors: string[];
  /** Stdout when the correctly ordered program runs (checked natively). */
  expect: string;
  /** Code placed before and after the player's lines (e.g. includes, `int main() {`). */
  prefix: string;
  suffix: string;
}
export interface ClozeCard extends Base {
  kind: "cloze";
  /** Code containing `___` once per blank. */
  template: string;
  /** Accepted answers per blank (first is canonical). Each must compile and print `expect`. */
  blanks: string[][];
  expect: string;
}

export type CardSource = McqCard | MultiCard | ComplexityCard | PredictSource | BugCard | CompilerErrorSource | ParsonsCard | ClozeCard;
export type Card = McqCard | MultiCard | ComplexityCard | PredictCard | BugCard | CompilerErrorCard | ParsonsCard | ClozeCard;

/** What native generation produces per source card, stored in `generated.json`. */
export interface GeneratedEntry {
  answer: string;
  errorLine?: number;
  choiceIds?: string[];
}

export type CardResponse =
  | { kind: "choice"; index: number }
  | { kind: "multi"; indices: number[] }
  | { kind: "text"; text: string }
  | { kind: "line"; line: number }
  | { kind: "pick"; id: string }
  | { kind: "order"; lines: string[] }
  | { kind: "blanks"; values: string[] };

export interface GradeResult {
  correct: boolean;
  /** Human-readable correct answer. */
  expected: string;
}
