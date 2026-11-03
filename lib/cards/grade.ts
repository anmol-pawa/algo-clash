import { makeRng } from "../content/rng";
import type { Card, CardResponse, CompilerErrorCard, PredictCard, CardSource, GeneratedEntry, GradeResult } from "./types";

/** Compare program output leniently: trim every line and the whole text, collapse spaces. */
export function normalizeOutput(s: string): string {
  return s
    .split("\n")
    .map((l) => l.trim().replace(/\s+/g, " "))
    .join("\n")
    .trim();
}

const sameSet = (a: number[], b: number[]) => {
  const x = [...new Set(a)].sort((p, q) => p - q);
  const y = [...new Set(b)].sort((p, q) => p - q);
  return x.length === y.length && x.every((v, i) => v === y[i]);
};

/** Fill the `___` blanks of a cloze template. */
export function fillTemplate(template: string, values: string[]): string {
  let i = 0;
  return template.replace(/___/g, () => values[i++] ?? "");
}

export function countBlanks(template: string): number {
  return (template.match(/___/g) ?? []).length;
}

const squash = (s: string) => s.replace(/\s+/g, "");

export function gradeCard(card: Card, r: CardResponse): GradeResult {
  switch (card.kind) {
    case "mcq":
    case "complexity":
      return { correct: r.kind === "choice" && r.index === card.answer, expected: card.choices[card.answer] };
    case "multi":
      return { correct: r.kind === "multi" && sameSet(r.indices, card.answers), expected: card.answers.map((i) => card.choices[i]).join("; ") };
    case "trace":
    case "predict":
      return { correct: r.kind === "text" && normalizeOutput(r.text) === normalizeOutput(card.answer), expected: card.answer };
    case "bug":
      return { correct: r.kind === "line" && r.line === card.bugLine, expected: `line ${card.bugLine}` };
    case "compiler-error":
      return { correct: r.kind === "pick" && r.id === card.answer, expected: card.answer };
    case "parsons":
      return {
        correct: r.kind === "order" && r.lines.length === card.lines.length && r.lines.every((l, i) => l === card.lines[i]),
        expected: card.lines.join("\n"),
      };
    case "cloze":
      return {
        correct:
          r.kind === "blanks" &&
          r.values.length === card.blanks.length &&
          r.values.every((v, i) => card.blanks[i].some((ok) => squash(ok) === squash(v))),
        expected: card.blanks.map((b) => b[0]).join(", "),
      };
  }
}

/** Merge authored sources with natively generated answers. Throws if a generated entry is missing. */
export function resolveCards(sources: CardSource[], generated: Record<string, GeneratedEntry>): Card[] {
  return sources.map((s): Card => {
    if (s.kind !== "predict" && s.kind !== "trace" && s.kind !== "compiler-error") return s as Exclude<Card, PredictCard | CompilerErrorCard>;
    const g = generated[s.id];
    if (!g) throw new Error(`card ${s.id}: no generated entry (run npm run cards:gen)`);
    if (s.kind === "compiler-error") {
      if (!g.choiceIds || g.errorLine === undefined) throw new Error(`card ${s.id}: incomplete generated entry`);
      return { ...s, answer: g.answer, errorLine: g.errorLine, choiceIds: g.choiceIds };
    }
    return { ...s, answer: g.answer };
  });
}

/** Seeded presentation order for choices or Parsons pools. Returns indices. */
export function permutation(n: number, seed: number): number[] {
  return makeRng(seed).shuffle(Array.from({ length: n }, (_, i) => i));
}

/** Lines the player puts in order: solution plus distractors, shuffled by `seed`. */
export function parsonsPool(card: Extract<Card, { kind: "parsons" }>, seed: number): string[] {
  const all = [...card.lines, ...card.distractors];
  return permutation(all.length, seed).map((i) => all[i]);
}

/** Problems with a card; empty when fine. */
export function validateCard(card: Card): string[] {
  const e: string[] = [];
  const bad = (m: string) => e.push(`${card.id}: ${m}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(card.id)) bad("id must be kebab-case");
  if (!/^R\d{1,2}$/.test(card.region)) bad("region must look like R0");
  if (card.tags.length === 0) bad("needs at least one tag");
  if (card.prompt.trim().length < 8) bad("prompt too short");
  if (card.explanation.trim().length < 20) bad("explanation too short");
  const choices = (c: string[], answers: number[]) => {
    if (c.length < 2 || c.length > 6) bad("2 to 6 choices");
    if (new Set(c.map((x) => x.trim())).size !== c.length) bad("duplicate choices");
    for (const a of answers) if (!Number.isInteger(a) || a < 0 || a >= c.length) bad(`answer ${a} out of range`);
  };
  switch (card.kind) {
    case "mcq":
    case "complexity":
      choices(card.choices, [card.answer]);
      break;
    case "multi":
      choices(card.choices, card.answers);
      if (card.answers.length < 2 || card.answers.length >= card.choices.length) bad("multi needs 2+ answers and at least one wrong choice");
      break;
    case "predict":
    case "trace":
      if (!card.code.includes("main")) bad("program needs main");
      if (card.answer.trim() === "") bad("empty answer");
      break;
    case "bug": {
      const n = card.code.split("\n").length;
      if (card.bugLine < 1 || card.bugLine > n) bad("bugLine out of range");
      break;
    }
    case "compiler-error":
      if (card.choiceIds.length < 3 || !card.choiceIds.includes(card.answer)) bad("choiceIds must include the answer");
      if (new Set(card.choiceIds).size !== card.choiceIds.length) bad("duplicate choiceIds");
      break;
    case "parsons":
      if (card.lines.length < 3) bad("needs at least 3 lines");
      if (new Set([...card.lines, ...card.distractors]).size !== card.lines.length + card.distractors.length) bad("lines/distractors must be unique");
      break;
    case "cloze":
      if (countBlanks(card.template) !== card.blanks.length) bad("blank count mismatch");
      if (card.blanks.some((b) => b.length === 0)) bad("empty accepted list");
      break;
  }
  return e;
}
