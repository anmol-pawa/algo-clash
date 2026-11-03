import type { Lesson, LessonScreen } from "./types";

export interface LessonState {
  screen: number;
  /** Recall block ids answered correctly so far. */
  solved: ReadonlySet<string>;
}

export const startLesson = (): LessonState => ({ screen: 0, solved: new Set() });

export const recallIds = (s: LessonScreen): string[] =>
  s.blocks.flatMap((b) => (b.kind === "recall" ? [b.id] : []));

/** The screen can be left once every recall check on it is solved. */
export function canAdvance(lesson: Lesson, st: LessonState): boolean {
  return recallIds(lesson.screens[st.screen]).every((id) => st.solved.has(id));
}

export function solve(st: LessonState, id: string): LessonState {
  return st.solved.has(id) ? st : { ...st, solved: new Set([...st.solved, id]) };
}

export function next(lesson: Lesson, st: LessonState): LessonState {
  if (!canAdvance(lesson, st) || st.screen >= lesson.screens.length - 1) return st;
  return { ...st, screen: st.screen + 1 };
}

export function back(st: LessonState): LessonState {
  return st.screen === 0 ? st : { ...st, screen: st.screen - 1 };
}

export const isLast = (lesson: Lesson, st: LessonState) => st.screen === lesson.screens.length - 1;
export const isComplete = (lesson: Lesson, st: LessonState) => isLast(lesson, st) && canAdvance(lesson, st);

/** Structural checks used by tests; returns error strings. */
export function validateLesson(l: Lesson): string[] {
  const errs: string[] = [];
  const e = (m: string) => errs.push(`${l.id}: ${m}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(l.id)) e("id must be kebab-case");
  if (l.screens.length < 5 || l.screens.length > 12) e(`needs 5-12 screens, has ${l.screens.length}`);
  if (!l.motivation.trim()) e("needs a motivation");
  const ids = new Set<string>();
  l.screens.forEach((s, i) => {
    if (!s.title.trim()) e(`screen ${i} needs a title`);
    if (s.blocks.length === 0) e(`screen ${i} is empty`);
    s.blocks.forEach((b) => {
      if (b.kind !== "recall") return;
      if (ids.has(b.id)) e(`duplicate recall id ${b.id}`);
      ids.add(b.id);
      if (b.choices.length < 2 || b.choices.length > 5) e(`${b.id}: 2-5 choices`);
      if (!Number.isInteger(b.answer) || b.answer < 0 || b.answer >= b.choices.length) e(`${b.id}: answer out of range`);
      if (new Set(b.choices).size !== b.choices.length) e(`${b.id}: duplicate choices`);
      if (!b.explanation.trim()) e(`${b.id}: needs an explanation`);
    });
  });
  if (ids.size < 3) e("needs at least 3 recall checks (retrieval over re-reading)");
  const last = l.screens[l.screens.length - 1];
  if (last && recallIds(last).length === 0) e("the last screen must end in a recall check");
  return errs;
}
