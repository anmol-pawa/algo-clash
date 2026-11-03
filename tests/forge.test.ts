import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allCards, computed } from "../content/cards";
import { allScrolls } from "../content/scrolls";
import { fillCloze } from "../lib/cards/grade";
import { diffFills, makeMask, maskableTokens } from "../lib/forge/cloze";
import { emptyProgress, INGRAIN_GAP_MS, isIngrained, isUnlocked, recordPass, scrollStatus, tracePasses } from "../lib/forge/progress";

const DAY = 24 * 3600 * 1000;

describe("scroll content", () => {
  it("has unique kebab-case ids", () => {
    const ids = allScrolls.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
  for (const s of allScrolls) {
    describe(s.id, () => {
      const solution = () => readFileSync(join(process.cwd(), "content", "problems", s.region, s.problemId, "solution.cpp"), "utf8");
      it("template equals the judged problem's reference solution", () => {
        expect(s.template).toBe(solution());
      });
      it("annotations point at real lines, once each", () => {
        const n = s.template.trimEnd().split("\n").length;
        const lines = s.annotations.map((a) => a.line);
        expect(new Set(lines).size).toBe(lines.length);
        for (const a of s.annotations) {
          expect(a.line).toBeGreaterThanOrEqual(1);
          expect(a.line).toBeLessThanOrEqual(n);
          expect(a.note.length).toBeGreaterThan(10);
        }
      });
      it("has exactly 5 trace questions, all computed natively", () => {
        expect(s.traceCardIds).toHaveLength(5);
        for (const id of s.traceCardIds) {
          const card = allCards.find((c) => c.id === id);
          expect(card?.kind).toBe("trace");
          expect(computed[id]?.output?.trim()).toBeTruthy();
        }
      });
      it("lists common bugs", () => expect(s.commonBugs.length).toBeGreaterThanOrEqual(3));
    });
  }
});

describe("cloze masks", () => {
  const code = allScrolls[0].template;
  it("never blank comments or keep-words", () => {
    for (const t of maskableTokens(code)) {
      expect(["class", "public", "const", "auto"]).not.toContain(t.text);
    }
    expect(maskableTokens(code).map((t) => t.text)).not.toContain("coins of");
  });
  it("is deterministic per seed and differs across seeds", () => {
    expect(makeMask(code, 0.3, 7)).toEqual(makeMask(code, 0.3, 7));
    expect(makeMask(code, 0.3, 7).text).not.toBe(makeMask(code, 0.3, 8).text);
  });
  it("filling the answers restores the template exactly", () => {
    for (const ratio of [0.3, 0.7]) {
      for (let seed = 1; seed <= 25; ++seed) {
        const m = makeMask(code, ratio, seed);
        expect(fillCloze(m.text, m.answers)).toBe(code);
      }
    }
  });
  it("blanks about the requested share and 70% blanks more than 30%", () => {
    const a = makeMask(code, 0.3, 3);
    const b = makeMask(code, 0.7, 3);
    expect(a.ratio).toBeGreaterThan(0.2);
    expect(a.ratio).toBeLessThan(0.4);
    expect(b.ratio).toBeGreaterThan(0.6);
    expect(b.answers.length).toBeGreaterThan(a.answers.length);
  });
  it("diffFills flags wrong blanks", () => {
    const m = makeMask(code, 0.3, 3);
    const fills = [...m.answers];
    fills[0] = "zzz";
    expect(diffFills(m, fills)).toEqual(m.answers.map((_, i) => i !== 0));
  });
  it("masks nothing in text without tokens but still returns the code", () => {
    const m = makeMask("// nothing\n", 0.5, 1);
    expect(m.answers).toEqual([]);
    expect(m.text).toBe("// nothing\n");
  });
});

describe("progress", () => {
  it("unlocks tiers in order", () => {
    let p = emptyProgress();
    expect(isUnlocked(p, "trace")).toBe(true);
    expect(isUnlocked(p, "cloze30")).toBe(false);
    p = recordPass(p, "cloze30", { at: 1 });
    expect(p.passed).toEqual([]);
    p = recordPass(p, "trace", { at: 1 });
    expect(isUnlocked(p, "cloze30")).toBe(true);
    expect(isUnlocked(p, "blank")).toBe(false);
  });
  it("trace needs 4 of 5", () => {
    expect(tracePasses(4)).toBe(true);
    expect(tracePasses(3)).toBe(false);
  });
  it("walks new → forging → inscribed → ingrained", () => {
    const par = 180;
    let p = emptyProgress();
    expect(scrollStatus(p, par)).toBe("new");
    for (const t of ["trace", "cloze30", "cloze70"] as const) p = recordPass(p, t, { at: 0 });
    expect(scrollStatus(p, par)).toBe("forging");
    p = recordPass(p, "blank", { seconds: 400, at: 0 });
    expect(scrollStatus(p, par)).toBe("inscribed");
    p = recordPass(p, "blank", { seconds: 100, at: 10 * DAY });
    expect(scrollStatus(p, par)).toBe("inscribed"); // only one fast pass
    p = recordPass(p, "blank", { seconds: 150, at: 10 * DAY + INGRAIN_GAP_MS - 1 });
    expect(scrollStatus(p, par)).toBe("inscribed"); // too close together
    p = recordPass(p, "blank", { seconds: 90, at: 10 * DAY + INGRAIN_GAP_MS });
    expect(isIngrained(p, par)).toBe(true);
    expect(scrollStatus(p, par)).toBe("ingrained");
  });
  it("is idempotent for repeated tier passes", () => {
    let p = recordPass(emptyProgress(), "trace", { at: 0 });
    p = recordPass(p, "trace", { at: 5 });
    expect(p.passed).toEqual(["trace"]);
  });
});
