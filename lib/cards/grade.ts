import type { Card, ComputedMap, Grade, Response } from "./types";

/** Whitespace-insensitive line comparison: trims each line and drops trailing blank lines. */
export function normOutput(s: string): string {
  return s.split("\n").map((l) => l.trim().replace(/\s+/g, " ")).join("\n").replace(/\n+$/, "");
}

const norm = (s: string) => s.trim().replace(/\s+/g, " ");

/** Cloze templates mark each blank with `___`. */
export const BLANK = "___";
export function fillCloze(template: string, fills: string[]): string {
  let i = 0;
  return template.replace(/___/g, () => fills[i++] ?? "");
}

/** Grade a response. Throws when the response kind does not match the card (a UI bug, not a wrong answer). */
export function gradeCard(card: Card, res: Response, computed: ComputedMap): Grade {
  if (res.kind !== card.kind) throw new Error(`response ${res.kind} does not match card ${card.id} (${card.kind})`);
  switch (card.kind) {
    case "mcq":
    case "compilerError": {
      const ok = (res as { choice: number }).choice === card.answer;
      return { correct: ok, parts: [] };
    }
    case "multi": {
      const got = [...new Set((res as { choices: number[] }).choices)].sort();
      const want = [...card.answers].sort();
      const parts = card.choices.map((_, i) => got.includes(i) === want.includes(i));
      return { correct: parts.every(Boolean), parts };
    }
    case "predict":
    case "trace": {
      const out = computed[card.id]?.output;
      if (out === undefined) throw new Error(`card ${card.id} has no computed output`);
      return { correct: normOutput((res as { text: string }).text) === normOutput(out), parts: [] };
    }
    case "parsons": {
      const got = (res as { lines: string[] }).lines.map((l) => l.trimEnd());
      const parts = card.lines.map((l, i) => got[i] === l.trimEnd());
      return { correct: got.length === card.lines.length && parts.every(Boolean), parts };
    }
    case "cloze": {
      const got = (res as { blanks: string[] }).blanks;
      const parts = card.blanks.map((acc, i) => acc.some((a) => norm(a) === norm(got[i] ?? "")));
      return { correct: parts.every(Boolean), parts };
    }
  }
}
