import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { R0_CARDS } from "../content/cards/R0/cards";
import { CLANG_ERRORS } from "../lib/judge/clangErrors";
import { countBlanks, fillTemplate, gradeCard, normalizeOutput, parsonsPool, permutation, resolveCards, validateCard } from "../lib/cards/grade";
import { generateAll, runCpp } from "../lib/cards/native";
import type { Card, GeneratedEntry, PredictCard } from "../lib/cards/types";

const genPath = join(process.cwd(), "content", "cards", "R0", "generated.json");
const write = process.env.CARDS_WRITE === "1";
const generated = generateAll(R0_CARDS);
if (write) writeFileSync(genPath, JSON.stringify(generated, null, 2) + "\n");
const stored: Record<string, GeneratedEntry> = existsSync(genPath) ? JSON.parse(readFileSync(genPath, "utf8")) : {};

describe("content/cards/R0", () => {
  it("generated.json is up to date with a native run (npm run cards:gen)", () => {
    expect(stored).toEqual(generated);
  });

  const cards = resolveCards(R0_CARDS, stored);

  it("has unique ids and covers every card kind", () => {
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
    expect(new Set(cards.map((c) => c.kind))).toEqual(new Set(["mcq", "multi", "complexity", "predict", "trace", "bug", "compiler-error", "parsons", "cloze"]));
  });

  for (const c of cards) {
    it(`${c.id} (${c.kind}) is valid`, () => {
      expect(validateCard(c)).toEqual([]);
    });
  }

  for (const c of cards) {
    if (c.kind === "parsons") {
      it(`${c.id}: the ordered lines compile and print the expected output`, () => {
        const ok = runCpp(c.prefix + c.lines.join("\n") + "\n" + c.suffix);
        expect(ok.compiled, ok.stderr).toBe(true);
        expect(normalizeOutput(ok.stdout)).toBe(normalizeOutput(c.expect));
      });
    }
    if (c.kind === "cloze") {
      it(`${c.id}: every accepted answer compiles and prints the expected output`, () => {
        const canonical = c.blanks.map((b) => b[0]);
        const variants = [canonical, ...c.blanks.flatMap((b, i) => b.slice(1).map((alt) => canonical.map((v, j) => (j === i ? alt : v))))];
        for (const v of variants) {
          const r = runCpp(fillTemplate(c.template, v));
          expect(r.compiled, `${v.join("|")}\n${r.stderr}`).toBe(true);
          expect(normalizeOutput(r.stdout), v.join("|")).toBe(normalizeOutput(c.expect));
        }
      });
    }
    if (c.kind === "bug") {
      it(`${c.id}: the fix prints the expected output and the original does not`, () => {
        const lines = c.code.split("\n");
        const fixed = [...lines.slice(0, c.bugLine - 1), c.fixedLine, ...lines.slice(c.bugLine)].join("\n");
        const good = runCpp(fixed);
        expect(good.compiled, good.stderr).toBe(true);
        expect(normalizeOutput(good.stdout)).toBe(normalizeOutput(c.expectFixed));
        const bad = runCpp(c.code);
        expect(bad.compiled, bad.stderr).toBe(true);
        expect(normalizeOutput(bad.stdout)).not.toBe(normalizeOutput(c.expectFixed));
      });
    }
    if (c.kind === "compiler-error") {
      it(`${c.id}: answer is a real table entry, error line is inside the program`, () => {
        expect(CLANG_ERRORS.some((e) => e.id === c.answer)).toBe(true);
        expect(c.choiceIds.every((id) => CLANG_ERRORS.some((e) => e.id === id))).toBe(true);
        expect(c.errorLine).toBeGreaterThanOrEqual(1);
        expect(c.errorLine).toBeLessThanOrEqual(c.code.split("\n").length);
      });
    }
  }

  it("known predict answers match hand analysis", () => {
    const by = Object.fromEntries(cards.map((c) => [c.id, c]));
    expect((by["negative-mod"] as PredictCard).answer).toBe("-3 -1 1");
    expect((by["unsigned-size-wrap"] as PredictCard).answer).toBe("1");
    expect((by["trace-doubling-loop"] as PredictCard).answer).toBe("2 5 12 27");
  });

  it("the correct response is graded right and a wrong one wrong, for every card", () => {
    for (const c of cards) {
      switch (c.kind) {
        case "mcq":
        case "complexity":
          expect(gradeCard(c, { kind: "choice", index: c.answer }).correct).toBe(true);
          expect(gradeCard(c, { kind: "choice", index: (c.answer + 1) % c.choices.length }).correct).toBe(false);
          break;
        case "multi":
          expect(gradeCard(c, { kind: "multi", indices: [...c.answers].reverse() }).correct).toBe(true);
          expect(gradeCard(c, { kind: "multi", indices: [c.answers[0]] }).correct).toBe(false);
          break;
        case "predict":
        case "trace":
          expect(gradeCard(c, { kind: "text", text: ` ${c.answer}\n` }).correct).toBe(true);
          expect(gradeCard(c, { kind: "text", text: c.answer + "0" }).correct).toBe(false);
          break;
        case "bug":
          expect(gradeCard(c, { kind: "line", line: c.bugLine }).correct).toBe(true);
          expect(gradeCard(c, { kind: "line", line: c.bugLine + 1 }).correct).toBe(false);
          break;
        case "compiler-error":
          expect(gradeCard(c, { kind: "pick", id: c.answer }).correct).toBe(true);
          expect(gradeCard(c, { kind: "pick", id: c.choiceIds.find((i) => i !== c.answer)! }).correct).toBe(false);
          break;
        case "parsons":
          expect(gradeCard(c, { kind: "order", lines: c.lines }).correct).toBe(true);
          expect(gradeCard(c, { kind: "order", lines: [...c.lines].reverse() }).correct).toBe(false);
          break;
        case "cloze":
          expect(gradeCard(c, { kind: "blanks", values: c.blanks.map((b) => b[b.length - 1]) }).correct).toBe(true);
          expect(gradeCard(c, { kind: "blanks", values: c.blanks.map(() => "banana") }).correct).toBe(false);
          break;
      }
    }
  });
});

describe("card helpers", () => {
  it("permutation is a seeded permutation", () => {
    const p = permutation(8, 42);
    expect([...p].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(permutation(8, 42)).toEqual(p);
    expect(permutation(8, 43)).not.toEqual(p);
  });
  it("parsonsPool holds every line and distractor exactly once", () => {
    const c = resolveCards(R0_CARDS, stored).find((x) => x.kind === "parsons")!;
    if (c.kind !== "parsons") throw new Error("unreachable");
    expect([...parsonsPool(c, 5)].sort()).toEqual([...c.lines, ...c.distractors].sort());
  });
  it("countBlanks and fillTemplate agree", () => {
    expect(countBlanks("a ___ b ___")).toBe(2);
    expect(fillTemplate("a ___ b ___", ["1", "2"])).toBe("a 1 b 2");
  });
  it("resolveCards throws when a generated entry is missing", () => {
    expect(() => resolveCards(R0_CARDS, {})).toThrow(/cards:gen/);
  });
  it("validateCard catches bad cards", () => {
    const bad: Card = { id: "Bad_ID", kind: "mcq", region: "x", tags: [], prompt: "?", explanation: "short", choices: ["a", "a"], answer: 5 };
    expect(validateCard(bad).length).toBeGreaterThanOrEqual(6);
  });
});
