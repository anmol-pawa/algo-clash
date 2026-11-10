/** Recognition blitz statements (CUR §5, GDD §5.5): read a short statement plus constraints, name the pattern within 20 s. */
export interface RecognitionStatement {
  /** Unique, kebab-case. */
  id: string;
  /** Region of the main pattern (R2–R22). */
  region: string;
  /** Original problem statement, 1–3 sentences. Never copied from any site. */
  text: string;
  /** Constraints line, e.g. `1 <= n <= 10^5`. Part of the signal: it rules patterns in and out. */
  constraints: string;
  /** Pattern ids (content/patterns.ts) a correct answer must name, exactly. */
  answer: string[];
  /** Pattern ids that are also acceptable as part of an answer, without being required. */
  alsoOk?: string[];
  /** Verbatim substrings of `text` or `constraints` that give the pattern away; highlighted in the debrief. */
  signals: string[];
  /** Why this is the pattern: names the signals, and why the close alternatives lose. */
  explanation: string;
}

/** Time budget per statement, in milliseconds (GDD §5.5). */
export const BLITZ_TIME_MS = 20_000;
