/** Lessons (CUR §1): 5-12 short screens of typed blocks. Computed output comes from real C++ runs (lib/content/lessonsNative.ts). */

export type LessonBlock =
  /** A paragraph. `inline code` between backticks is rendered monospace. */
  | { kind: "text"; text: string }
  /** A program. With `run: true` it is compiled and run natively and its real stdout is shown under it. */
  | { kind: "code"; code: string; caption?: string; run?: boolean }
  /** The "C++ idiom" box: a short snippet worth memorising. */
  | { kind: "idiom"; title: string; code: string }
  /** A pitfall: what goes wrong, and why. Optional code that shows it. */
  | { kind: "pitfall"; title: string; text: string; code?: string }
  /** A picture drawn with fixed-width text (bit boxes, number lines). */
  | { kind: "picture"; lines: string[]; caption?: string }
  /** Retrieval check; the screen cannot be left until it is answered correctly (retries allowed). */
  | { kind: "recall"; id: string; prompt: string; choices: string[]; answer: number; explanation: string };

export interface LessonScreen {
  title: string;
  blocks: LessonBlock[];
}

export interface Lesson {
  id: string;
  region: string;
  title: string;
  /** Real-interview-style scenario that opens the lesson. */
  motivation: string;
  screens: LessonScreen[];
}

/** Native results keyed `${lessonId}#${screenIndex}.${blockIndex}` (content/lessons/generated.json). */
export type LessonComputed = Record<string, { output: string }>;

export const blockKey = (lessonId: string, screen: number, block: number) => `${lessonId}#${screen}.${block}`;
