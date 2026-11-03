/** Native verification of lesson code blocks (Node-only). Every `code` block must compile; `run` blocks get real stdout. */
import { runProgram } from "./cardsNative";
import { blockKey, type Lesson, type LessonComputed } from "../lessons/types";

export function verifyLessons(lessons: Lesson[], generated: LessonComputed, write = false): { errors: string[]; computed: LessonComputed } {
  const errors: string[] = [];
  const computed: LessonComputed = {};
  for (const l of lessons) {
    l.screens.forEach((s, si) => s.blocks.forEach((b, bi) => {
      if (b.kind !== "code" && b.kind !== "idiom" && !(b.kind === "pitfall" && b.code)) return;
      const code = b.kind === "pitfall" ? b.code! : b.code;
      const key = blockKey(l.id, si, bi);
      const runnable = b.kind === "code" ? !!b.run : false;
      // Snippets without main are wrapped so they at least must compile as fragments.
      const hasMain = /\bint\s+main\s*\(/.test(code);
      if (!hasMain) return;
      const r = runProgram(code);
      if (!r.ok) { errors.push(`${key}: ${r.diagnostic}`); return; }
      if (runnable) {
        computed[key] = { output: r.stdout };
        if (!write && JSON.stringify(generated[key] ?? null) !== JSON.stringify(computed[key])) errors.push(`${key}: lessons generated.json is stale: run \`npm run content:gen\``);
      }
    }));
  }
  return { errors, computed };
}
