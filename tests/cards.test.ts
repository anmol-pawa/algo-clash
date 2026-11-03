/** Concept cards: grading logic, deck helpers, and native verification of every card (`npm run content:verify` also runs this). */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allCards, computed as stored } from "../content/cards";
import { cardXp, parsonsShuffle, pickDeck } from "../lib/cards/deck";
import { fillCloze, gradeCard, normOutput } from "../lib/cards/grade";
import type { Card, ClozeCard, ParsonsCard } from "../lib/cards/types";
import { verifyCards } from "../lib/content/cardsNative";
import { makeRng } from "../lib/content/rng";

const write = process.env.CONTENT_WRITE === "1";
const { errors, computed } = verifyCards(allCards, stored, write);
if (write) writeFileSync(join(process.cwd(), "content", "cards", "generated.json"), JSON.stringify(computed, null, 2) + "\n");

const byId = (id: string) => allCards.find((c) => c.id === id)!;

describe("content/cards native verification", () => {
  it("every card is well formed, compiles/fails as designed, and generated.json is current", () => {
    expect(errors).toEqual([]);
  });
  it("covers every card kind", () => {
    expect(new Set(allCards.map((c) => c.kind))).toEqual(new Set(["mcq", "multi", "predict", "trace", "compilerError", "parsons", "cloze"]));
  });
  it("computes the expected real outputs", () => {
    expect(computed["r0-int-division"].output).toBe("3\n2\n");
    expect(computed["r0-loop-sum"].output).toBe("22\n");
    expect(computed["r0-scope-error"].diagnostic).toMatch(/'i' was not declared in this scope/);
    expect(computed["r0-const-error"].diagnostic).toMatch(/read-only/);
    expect(computed["r0-sum-vector-order"].output).toBe("43\n");
    expect(computed["r0-count-up-cloze"].output).toBe("0\n1\n2\n3\n4\n");
  });
});

describe("gradeCard", () => {
  it("grades mcq and compiler-error by index", () => {
    expect(gradeCard(byId("r0-vector-header"), { kind: "mcq", choice: 1 }, computed).correct).toBe(true);
    expect(gradeCard(byId("r0-vector-header"), { kind: "mcq", choice: 0 }, computed).correct).toBe(false);
    expect(gradeCard(byId("r0-scope-error"), { kind: "compilerError", choice: 1 }, computed).correct).toBe(true);
    expect(gradeCard(byId("r0-const-error"), { kind: "compilerError", choice: 2 }, computed).correct).toBe(false);
  });
  it("multi-select needs the exact set and reports per-choice parts", () => {
    const c = byId("r0-contiguous");
    expect(gradeCard(c, { kind: "multi", choices: [4, 0, 1, 1] }, computed).correct).toBe(true);
    const g = gradeCard(c, { kind: "multi", choices: [0, 1] }, computed);
    expect(g.correct).toBe(false);
    expect(g.parts).toEqual([true, true, true, true, false]);
  });
  it("predict/trace compare against the real output ignoring whitespace", () => {
    expect(gradeCard(byId("r0-int-division"), { kind: "predict", text: " 3 \n 2\n\n" }, computed).correct).toBe(true);
    expect(gradeCard(byId("r0-int-division"), { kind: "predict", text: "3 2" }, computed).correct).toBe(false);
    expect(gradeCard(byId("r0-loop-sum"), { kind: "trace", text: "22" }, computed).correct).toBe(true);
    expect(gradeCard(byId("r0-loop-sum"), { kind: "trace", text: "21" }, computed).correct).toBe(false);
  });
  it("parsons needs the exact order and marks each line", () => {
    const c = byId("r0-sum-vector-order") as ParsonsCard;
    expect(gradeCard(c, { kind: "parsons", lines: [...c.lines] }, computed).correct).toBe(true);
    const swapped = [...c.lines];
    [swapped[4], swapped[5]] = [swapped[5], swapped[4]];
    const g = gradeCard(c, { kind: "parsons", lines: swapped }, computed);
    expect(g.correct).toBe(false);
    expect(g.parts.filter((p) => !p)).toHaveLength(2);
    expect(gradeCard(c, { kind: "parsons", lines: c.lines.slice(1) }, computed).correct).toBe(false);
  });
  it("cloze accepts any listed alternative and ignores spacing", () => {
    const c = byId("r0-count-up-cloze") as ClozeCard;
    expect(gradeCard(c, { kind: "cloze", blanks: [" 0", "<"] }, computed).correct).toBe(true);
    const g = gradeCard(c, { kind: "cloze", blanks: ["0", "<="] }, computed);
    expect(g.parts).toEqual([true, false]);
  });
  it("rejects a response of the wrong kind", () => {
    expect(() => gradeCard(byId("r0-vector-header"), { kind: "predict", text: "x" }, computed)).toThrow();
  });
  it("helpers normalise and fill", () => {
    expect(normOutput("a  b \n\n")).toBe("a b");
    expect(fillCloze("x=___;y=___", ["1", "2"])).toBe("x=1;y=2");
  });
});

describe("every seed card has a passing answer in the data", () => {
  // Guards the data itself: the keyed answer of each hand-written card must grade correct.
  for (const c of allCards) {
    it(c.id, () => {
      const out = computed[c.id];
      const res = ((): Parameters<typeof gradeCard>[1] => {
        switch (c.kind) {
          case "mcq": return { kind: "mcq", choice: c.answer };
          case "compilerError": return { kind: "compilerError", choice: c.answer };
          case "multi": return { kind: "multi", choices: c.answers };
          case "predict": return { kind: "predict", text: out.output! };
          case "trace": return { kind: "trace", text: out.output! };
          case "parsons": return { kind: "parsons", lines: c.lines };
          case "cloze": return { kind: "cloze", blanks: c.blanks.map((b) => b[0]) };
        }
      })();
      expect(gradeCard(c, res, computed).correct).toBe(true);
    });
  }
});

describe("deck helpers", () => {
  it("pickDeck prefers unseen cards, is deterministic per seed, and has no duplicates", () => {
    const seen = new Set(allCards.slice(0, 5).map((c: Card) => c.id));
    const a = pickDeck(allCards, 3, makeRng(1), seen);
    expect(a.every((c) => !seen.has(c.id))).toBe(true);
    expect(pickDeck(allCards, 3, makeRng(1), seen).map((c) => c.id)).toEqual(a.map((c) => c.id));
    const all = pickDeck(allCards, 99, makeRng(2), seen);
    expect(new Set(all.map((c) => c.id)).size).toBe(allCards.length);
    expect(all.slice(0, 3).every((c) => !seen.has(c.id))).toBe(true);
  });
  it("parsonsShuffle is a permutation and never solved", () => {
    const c = byId("r0-sum-vector-order") as ParsonsCard;
    for (let seed = 0; seed < 30; ++seed) {
      const s = parsonsShuffle(c, makeRng(seed));
      expect([...s].sort()).toEqual([...c.lines].sort());
      expect(s).not.toEqual(c.lines);
    }
  });
  it("cardXp rewards first tries and streaks, with a cap", () => {
    expect(cardXp(false, true, 3)).toBe(2);
    expect(cardXp(true, true, 0)).toBe(15);
    expect(cardXp(true, false, 0)).toBe(10);
    expect(cardXp(true, true, 99)).toBe(20);
  });
});
