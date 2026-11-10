import { describe, expect, it } from "vitest";
import { STATEMENTS } from "@/content/recognition/statements";
import { PATTERNS, PATTERN_IDS, patternById } from "@/content/patterns";
import { BLITZ_TIME_MS } from "@/lib/recognition/types";
import { choicesFor, gradeRecognition, tally } from "@/lib/recognition/grade";

const ids = PATTERNS.map((p) => p.id);
const regionOf = (id: string) => patternById(id)!.region;
const by = (id: string) => STATEMENTS.find((s) => s.id === id)!;

describe("recognition statements", () => {
  it("has at least 60 with unique ids", () => {
    expect(STATEMENTS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(STATEMENTS.map((s) => s.id)).size).toBe(STATEMENTS.length);
  });
  it("uses valid pattern ids and the region of the first answer", () => {
    for (const s of STATEMENTS) {
      expect(s.answer.length, s.id).toBeGreaterThan(0);
      for (const p of [...s.answer, ...(s.alsoOk ?? [])]) expect(PATTERN_IDS.has(p), `${s.id}:${p}`).toBe(true);
      expect(s.region, s.id).toBe(regionOf(s.answer[0]!));
      expect(s.answer.filter((a) => (s.alsoOk ?? []).includes(a)), s.id).toEqual([]);
    }
  });
  it("highlights signals that really occur in the statement or constraints", () => {
    for (const s of STATEMENTS) {
      expect(s.signals.length, s.id).toBeGreaterThan(0);
      for (const sig of s.signals) expect(`${s.text}\n${s.constraints}`.includes(sig), `${s.id}: "${sig}"`).toBe(true);
      expect(s.explanation.length, s.id).toBeGreaterThan(40);
      expect(s.text.length, s.id).toBeLessThan(400);
    }
  });
  it("covers every pattern from R2 up at least once", () => {
    const seen = new Set(STATEMENTS.flatMap((s) => [...s.answer, ...(s.alsoOk ?? [])]));
    for (const p of PATTERNS) if (!["R0", "R1"].includes(p.region)) expect(seen.has(p.id), p.id).toBe(true);
  });
});

describe("grading", () => {
  const s = by("rb-sorted-pair");
  it("accepts the answer, optionally with acceptable extras", () => {
    expect(gradeRecognition(s, ["two-pointers"], 5000).correct).toBe(true);
    expect(gradeRecognition(s, ["two-pointers", "binary-search"], 5000).correct).toBe(true);
  });
  it("rejects misses and wrong extras", () => {
    const miss = gradeRecognition(s, ["binary-search"], 1000);
    expect(miss.correct).toBe(false);
    expect(miss.missed).toEqual(["two-pointers"]);
    const extra = gradeRecognition(s, ["two-pointers", "heap"], 1000);
    expect(extra.wrong).toEqual(["heap"]);
    expect(extra.correct).toBe(false);
  });
  it("requires every pattern of a multi answer", () => {
    const m = by("rb-subarray-k-neg");
    expect(gradeRecognition(m, ["prefix-sum"], 1).correct).toBe(false);
    expect(gradeRecognition(m, ["hash-lookup", "prefix-sum", "prefix-sum"], 1).correct).toBe(true);
  });
  it("is in time only at or under 20 s", () => {
    expect(gradeRecognition(s, ["two-pointers"], BLITZ_TIME_MS).inTime).toBe(true);
    const late = gradeRecognition(s, ["two-pointers"], BLITZ_TIME_MS + 1);
    expect(late.correct).toBe(true);
    expect(late.inTime).toBe(false);
  });
  it("tallies against the 90 % over 50 target", () => {
    const ok = gradeRecognition(s, ["two-pointers"], 1);
    const bad = gradeRecognition(s, [], 1);
    expect(tally(Array(50).fill(ok)).meetsTarget).toBe(true);
    expect(tally([...Array(44).fill(ok), ...Array(6).fill(bad)]).meetsTarget).toBe(false);
    expect(tally(Array(49).fill(ok)).meetsTarget).toBe(false);
    expect(tally([]).accuracy).toBe(0);
  });
});

describe("choicesFor", () => {
  it("always contains every answer, never an alsoOk pattern, and is deterministic", () => {
    for (const s of STATEMENTS) {
      const c = choicesFor(s, ids, regionOf, 7);
      expect(c.length, s.id).toBe(Math.max(6, s.answer.length));
      for (const a of s.answer) expect(c, s.id).toContain(a);
      for (const o of s.alsoOk ?? []) expect(c, s.id).not.toContain(o);
      expect(new Set(c).size, s.id).toBe(c.length);
      expect(choicesFor(s, ids, regionOf, 7)).toEqual(c);
    }
  });
});
