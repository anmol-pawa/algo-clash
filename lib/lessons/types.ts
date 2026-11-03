/** Lesson screens (GDD §8; CURRICULUM §2). A lesson is a few pages of typed blocks followed by its concept cards and exercises. */

export type LessonBlock =
  /** Prose. `backticks` mark inline code. */
  | { kind: "text"; text: string }
  /** A code listing. With `run`, it is compiled and executed natively and its real stdout is shown (content/lessons/generated.json). */
  | { kind: "code"; code: string; caption?: string; run?: boolean }
  /** The habit to copy. */
  | { kind: "idiom"; title: string; text: string }
  /** A trap that costs wrong answers. */
  | { kind: "pitfall"; title: string; text: string }
  /** What the interviewer is listening for. */
  | { kind: "interview"; text: string };

export interface LessonPage {
  title: string;
  blocks: LessonBlock[];
}

export interface Lesson {
  /** Unique, kebab-case. */
  id: string;
  region: string;
  /** Curriculum section, e.g. "S1". */
  section: string;
  title: string;
  summary: string;
  pages: LessonPage[];
  /** Concept cards that practise this lesson (ids in content/cards). */
  cardIds: string[];
  /** Judged exercises that apply it (ids under content/problems/<region>/). */
  problemIds: string[];
}

/** Stdout of each `run` code block, keyed by `lessonKey(lessonId, page, block)`. */
export type LessonOutputs = Record<string, string>;

export const lessonKey = (lessonId: string, page: number, block: number): string => `${lessonId}:${page}:${block}`;

/** Split text into plain and inline-code runs for rendering. */
export function inlineRuns(text: string): { code: boolean; text: string }[] {
  return text.split("`").map((t, i) => ({ code: i % 2 === 1, text: t })).filter((r) => r.text !== "");
}
