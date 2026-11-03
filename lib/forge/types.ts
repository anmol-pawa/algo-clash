/** The Forge (GDD §6.4): reusable templates ("scrolls") inscribed through four tiers. */
export type ForgeTier = "trace" | "cloze30" | "cloze70" | "blank";
export const FORGE_TIERS: readonly ForgeTier[] = ["trace", "cloze30", "cloze70", "blank"];

export interface ScrollAnnotation {
  /** 1-based line of `template`. */
  line: number;
  note: string;
}

export interface Scroll {
  /** Unique, kebab-case. */
  id: string;
  /** Number in CUR §4. */
  cur: number;
  title: string;
  region: string;
  /** One-line job of the template. */
  blurb: string;
  /** Judged problem package that doubles as the scroll's spec + tests (`content/problems/<region>/<problemId>`). */
  problemId: string;
  /** The reference template; byte-identical to the problem's `solution.cpp` (tested). */
  template: string;
  annotations: ScrollAnnotation[];
  /** Trace-tier questions: ids of trace cards in `content/cards` (answers computed natively). */
  traceCardIds: string[];
  /** The common-bugs list shown after each tier. */
  commonBugs: string[];
}

/** One masked version of a template: `text` holds `___` per blank. */
export interface ClozeMask {
  text: string;
  answers: string[];
  /** Fraction of eligible tokens that were blanked. */
  ratio: number;
}

/** Per-scroll progress (pure; persisted by the Forge UI). */
export interface ScrollProgress {
  /** Tiers passed so far, in order. */
  passed: ForgeTier[];
  /** Blank-tier passes: seconds taken and epoch ms. */
  blankRuns: { seconds: number; at: number }[];
}
