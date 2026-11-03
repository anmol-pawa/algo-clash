import type { Answer, Card, Generated, GradeResult } from "./types";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const sameSet = (a: number[], b: number[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

/** Cloze source with the blanks filled in (used by the UI preview and by native verification). */
export function fillCloze(code: string, values: string[]): string {
  let i = 0;
  return code.replace(/___/g, () => values[i++] ?? "");
}

/** Number of `___` blanks in a cloze body. */
export const blankCount = (code: string) => (code.match(/___/g) ?? []).length;

/** Deterministic shuffle so a Parsons card looks the same on every render; never returns the solved order. */
export function shuffledLines(lines: string[], seed: number): string[] {
  const a = [...lines];
  let s = seed >>> 0 || 1;
  const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  for (let attempt = 0; attempt < 8; ++attempt) {
    for (let i = a.length - 1; i > 0; --i) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.length < 2 || a.join("\n") !== lines.join("\n")) break;
  }
  return a;
}

/** Grade one answer. `gen` is required for predict, trace and compiler-error cards. */
export function gradeCard(card: Card, answer: Answer, gen?: Generated): GradeResult {
  if (answer.kind !== card.kind) throw new Error(`answer kind ${answer.kind} does not match card ${card.id} (${card.kind})`);
  const ok = (correct: boolean, detail = ""): GradeResult => ({ correct, detail });
  switch (card.kind) {
    case "mcq": {
      const a = answer as Extract<Answer, { kind: "mcq" }>;
      return ok(a.choice === card.answer, `Answer: ${card.options[card.answer]}`);
    }
    case "multi": {
      const a = answer as Extract<Answer, { kind: "multi" }>;
      return ok(sameSet(a.choices, card.answers), `Answer: ${card.answers.map((i) => card.options[i]).join("; ")}`);
    }
    case "predict": {
      const a = answer as Extract<Answer, { kind: "predict" }>;
      if (gen?.out === undefined) throw new Error(`card ${card.id} has no generated output`);
      return ok(norm(a.text) === norm(gen.out), `It prints: ${gen.out}`);
    }
    case "trace": {
      const a = answer as Extract<Answer, { kind: "trace" }>;
      if (gen?.out === undefined) throw new Error(`card ${card.id} has no generated output`);
      const want = gen.out.split("\n").map(norm);
      const got = a.lines.map(norm);
      return ok(want.length === got.length && want.every((w, i) => w === got[i]), `Per step: ${want.join(", ")}`);
    }
    case "compiler-error": {
      const a = answer as Extract<Answer, { kind: "compiler-error" }>;
      if (gen?.errorLine === undefined) throw new Error(`card ${card.id} has no generated error line`);
      return ok(a.line === gen.errorLine, `Clang points at line ${gen.errorLine}`);
    }
    case "parsons": {
      const a = answer as Extract<Answer, { kind: "parsons" }>;
      return ok(a.order.length === card.lines.length && a.order.every((l, i) => l === card.lines[i]), "Check the order against the finished program.");
    }
    case "cloze": {
      const a = answer as Extract<Answer, { kind: "cloze" }>;
      const right = card.blanks.length === a.blanks.length && card.blanks.every((acc, i) => acc.some((x) => norm(x) === norm(a.blanks[i])));
      return ok(right, `Blanks: ${card.blanks.map((b) => b[0]).join(" | ")}`);
    }
  }
}
