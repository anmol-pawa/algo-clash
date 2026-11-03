import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SYNTAX_CARDS } from "@/content/cards/syntax-shores/cards";
import { blankCount, fillCloze, gradeCard, shuffledLines } from "@/lib/cards/grade";
import { parseClangErrors } from "@/lib/judge/clangErrors";
import type { Answer, Card, Generated } from "@/lib/cards/types";

const GEN_PATH = join(process.cwd(), "content", "cards", "generated.json");
const TMP = join(process.cwd(), ".cache", "cards");
mkdirSync(TMP, { recursive: true });

function runProgram(id: string, src: string): string {
  const file = join(TMP, `${id}.cpp`);
  writeFileSync(file, src);
  const bin = join(TMP, id);
  const c = spawnSync("g++", ["-std=c++20", "-O1", "-Wall", file, "-o", bin], { encoding: "utf8" });
  if (c.status !== 0) throw new Error(`${id} failed to compile:\n${c.stderr}`);
  const r = spawnSync(bin, [], { encoding: "utf8", timeout: 5000 });
  if (r.status !== 0) throw new Error(`${id} exited ${r.status}`);
  return r.stdout.replace(/\n$/, "");
}

const WRAP = (body: string) => `#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n${body}\nint main() {\n  std::vector<int> t = {3, 9, 2, 7};\n  std::cout << ${"FN"}(t) << "\\n";\n}\n`;

/** Source for cards whose output is the answer or the proof. */
function programFor(card: Card): string | null {
  switch (card.kind) {
    case "predict":
    case "trace":
      return card.source;
    case "parsons":
      return WRAP(card.lines.join("\n")).replace("FN", "countEven");
    case "cloze":
      return WRAP(fillCloze(card.code, card.blanks.map((b) => b[0]))).replace("FN", "largest");
    default:
      return null;
  }
}

function generate(card: Card): Generated {
  if (card.kind === "compiler-error") {
    const file = join(TMP, `${card.id}.cpp`);
    writeFileSync(file, card.source);
    const r = spawnSync("clang++", ["-std=c++20", "-fsyntax-only", file], { encoding: "utf8" });
    const d = parseClangErrors(r.stderr)[0];
    if (!d) throw new Error(`${card.id} did not produce an error`);
    return { errorLine: d.line, errorId: d.entry?.id ?? null };
  }
  const src = programFor(card);
  return src ? { out: runProgram(card.id, src) } : {};
}

const stored: Record<string, Generated> = existsSync(GEN_PATH) ? JSON.parse(readFileSync(GEN_PATH, "utf8")) : {};

if (process.env.CARDS_WRITE) {
  const next: Record<string, Generated> = {};
  for (const c of SYNTAX_CARDS) {
    const g = generate(c);
    if (Object.keys(g).length) next[c.id] = g;
  }
  writeFileSync(GEN_PATH, JSON.stringify(next, null, 2) + "\n");
  Object.assign(stored, next);
}

describe("concept cards", () => {
  it("has unique ids and structurally valid cards", () => {
    expect(new Set(SYNTAX_CARDS.map((c) => c.id)).size).toBe(SYNTAX_CARDS.length);
    for (const c of SYNTAX_CARDS) {
      expect(c.explanation.length, c.id).toBeGreaterThan(20);
      if (c.kind === "mcq") expect(c.answer).toBeLessThan(c.options.length);
      if (c.kind === "multi") expect(c.answers.every((i) => i < c.options.length)).toBe(true);
      if (c.kind === "cloze") expect(blankCount(c.code), c.id).toBe(c.blanks.length);
    }
  });

  it("covers every card kind", () => {
    expect(new Set(SYNTAX_CARDS.map((c) => c.kind)).size).toBe(7);
  });

  for (const card of SYNTAX_CARDS) {
    if (card.kind === "mcq" || card.kind === "multi") continue;
    it(`${card.id}: committed answer equals native output`, () => {
      const fresh = generate(card);
      expect(stored[card.id], "run `CARDS_WRITE=1 npx vitest run tests/cards.test.ts`").toEqual(fresh);
    });
  }

  it("grades every card's right answer correct and a wrong one incorrect", () => {
    for (const c of SYNTAX_CARDS) {
      const g = stored[c.id];
      let right: Answer, wrong: Answer;
      switch (c.kind) {
        case "mcq": right = { kind: "mcq", choice: c.answer }; wrong = { kind: "mcq", choice: (c.answer + 1) % c.options.length }; break;
        case "multi": right = { kind: "multi", choices: [...c.answers].reverse() }; wrong = { kind: "multi", choices: [c.answers[0]] }; break;
        case "predict": right = { kind: "predict", text: `  ${g.out}\n` }; wrong = { kind: "predict", text: "nope" }; break;
        case "trace": right = { kind: "trace", lines: g.out!.split("\n") }; wrong = { kind: "trace", lines: ["0"] }; break;
        case "compiler-error": right = { kind: "compiler-error", line: g.errorLine! }; wrong = { kind: "compiler-error", line: g.errorLine! + 1 }; break;
        case "parsons": right = { kind: "parsons", order: c.lines }; wrong = { kind: "parsons", order: [...c.lines].reverse() }; break;
        case "cloze": right = { kind: "cloze", blanks: c.blanks.map((b) => ` ${b[b.length - 1]} `) }; wrong = { kind: "cloze", blanks: c.blanks.map(() => "zzz") }; break;
      }
      expect(gradeCard(c, right, g).correct, `${c.id} right`).toBe(true);
      expect(gradeCard(c, wrong, g).correct, `${c.id} wrong`).toBe(false);
    }
  });

  it("every accepted cloze alternative compiles and gives the same result", () => {
    for (const c of SYNTAX_CARDS) {
      if (c.kind !== "cloze") continue;
      const base = stored[c.id].out;
      const alts = c.blanks[0].map((first) => fillCloze(c.code, [first, ...c.blanks.slice(1).map((b) => b[0])]));
      alts.forEach((code, i) => expect(runProgram(`${c.id}-alt${i}`, WRAP(code).replace("FN", "largest")), `${c.id} alt ${i}`).toBe(base));
    }
  });

  it("rejects an answer of the wrong kind and Parsons shuffles never come back solved", () => {
    expect(() => gradeCard(SYNTAX_CARDS[6], { kind: "predict", text: "x" })).toThrow();
    const p = SYNTAX_CARDS.find((c) => c.kind === "parsons")!;
    if (p.kind !== "parsons") return;
    for (let seed = 0; seed < 50; ++seed) {
      const s = shuffledLines(p.lines, seed);
      expect([...s].sort()).toEqual([...p.lines].sort());
      expect(s.join("\n")).not.toBe(p.lines.join("\n"));
    }
  });
});
