/** Native verification of lessons (Node-only). Every `run` block is compiled and executed with g++; its stdout is what the UI shows. */
import { runProgram } from "../content/cardsNative";
import { lessonKey, type Lesson, type LessonOutputs } from "./types";

export interface LessonCheckEnv {
  cardIds: Set<string>;
  problemIds: Set<string>;
}

export function verifyLessons(lessons: Lesson[], stored: LessonOutputs, env: LessonCheckEnv, write = false): { errors: string[]; outputs: LessonOutputs } {
  const errors: string[] = [];
  const outputs: LessonOutputs = {};
  const ids = new Set<string>();
  for (const l of lessons) {
    const e = (m: string) => errors.push(`${l.id}: ${m}`);
    if (ids.has(l.id)) e("duplicate id");
    ids.add(l.id);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(l.id)) e("id must be kebab-case");
    if (l.pages.length === 0) e("needs pages");
    if (l.cardIds.length === 0) e("needs practice cards");
    for (const c of l.cardIds) if (!env.cardIds.has(c)) e(`unknown card ${c}`);
    for (const p of l.problemIds) if (!env.problemIds.has(p)) e(`unknown problem ${p}`);
    l.pages.forEach((page, pi) => {
      if (!page.title.trim() || page.blocks.length === 0) e(`page ${pi} needs a title and blocks`);
      page.blocks.forEach((b, bi) => {
        if (b.kind !== "code") {
          const text = b.kind === "text" || b.kind === "interview" ? b.text : b.text + b.title;
          if (!text.trim()) e(`page ${pi} block ${bi} is empty`);
          if ((text.match(/`/g) ?? []).length % 2 !== 0) e(`page ${pi} block ${bi} has an unbalanced backtick`);
          return;
        }
        if (!b.run) return;
        const key = lessonKey(l.id, pi, bi);
        const r = runProgram(b.code);
        if (!r.ok) { e(`page ${pi} block ${bi} does not run: ${r.diagnostic}`); return; }
        outputs[key] = r.stdout;
        if (!write && stored[key] !== r.stdout) e(`page ${pi} block ${bi}: generated.json is stale: run \`npm run content:gen\``);
      });
    });
  }
  if (!write) for (const k of Object.keys(stored)) if (!(k in outputs)) errors.push(`generated.json has stale key ${k}`);
  return { errors, outputs };
}
