import { describe, expect, it } from "vitest";
import { FOE_MAX_HP, applyRust, effectiveness, rewards, submitDamage, timeBonus } from "../lib/battle/damage";
import * as M from "../lib/battle/machine";

const W = { basic: 25, edge: 25, adversarial: 20, perf: 30 };
const cfg = (o: Partial<M.BattleConfig> = {}): M.BattleConfig => ({ difficulty: "M", needsPlan: false, weights: W, parSeconds: 600, rusty: false, ...o });
const toCode = (c = cfg()) => M.strategise(M.scoutDone(M.start(c)), "neutral", 3);
const judge = (s: M.BattleState, r: M.JudgeReport) => M.applyJudge(M.beginJudge(s), r);
const fullGroups = { basic: true, edge: true, adversarial: true, perf: true };

describe("damage", () => {
  it("effectiveness", () => {
    expect(effectiveness("two-pointers", ["two-pointers"])).toBe("super");
    expect(effectiveness("sorting", ["two-pointers"], ["sorting"])).toBe("neutral");
    expect(effectiveness("heap", ["two-pointers"])).toBe("weak");
    expect(effectiveness(null, ["x"])).toBe("neutral");
  });
  it("time bonus bands", () => {
    expect([timeBonus(60, 60), timeBonus(120, 60), timeBonus(121, 60)]).toEqual([1.1, 1, 0.9]);
  });
  it("rust caps the multiplier", () => {
    expect(applyRust(1.5, true)).toBe(1.25);
    expect(applyRust(1.5, false)).toBe(1.5);
    expect(applyRust(0.5, true)).toBe(0.5);
  });
  it("full AC always defeats the foe, even with a weak multiplier and many hints", () => {
    expect(submitDamage({ passed: fullGroups, weights: W, multiplier: 0.5, hintsUsed: 6, seconds: 99999, parSeconds: 1 })).toBe(FOE_MAX_HP);
  });
  it("partial pass is weighted and never reaches full HP", () => {
    const base = { weights: W, multiplier: 1, hintsUsed: 0, seconds: 700, parSeconds: 600 };
    expect(submitDamage({ ...base, passed: { basic: true, edge: true } })).toBe(50);
    expect(submitDamage({ ...base, passed: { basic: true, edge: true, adversarial: true } })).toBe(70);
    expect(submitDamage({ ...base, multiplier: 1.5, passed: { basic: true, edge: true, adversarial: true } })).toBeLessThan(FOE_MAX_HP);
    expect(submitDamage({ ...base, multiplier: 1.5, passed: { basic: true, edge: true, adversarial: true } })).toBe(99);
  });
  it("hints and plan scale damage", () => {
    const base = { weights: W, multiplier: 1, seconds: 700, parSeconds: 600, passed: { basic: true, edge: true } };
    expect(submitDamage({ ...base, hintsUsed: 2 })).toBe(35);
    expect(submitDamage({ ...base, hintsUsed: 0, planCorrect: true })).toBe(55);
    expect(submitDamage({ ...base, hintsUsed: 9 })).toBe(0);
    expect(submitDamage({ ...base, hintsUsed: 0, passed: {} })).toBe(0);
  });
  it("rewards fall with assistance but stay positive", () => {
    const r = { difficulty: "M" as const, multiplier: 1, heartsLeft: 5, hintsUsed: 0, assisted: false, seconds: 100, parSeconds: 600 };
    const clean = rewards(r);
    expect(clean.xp).toBeGreaterThan(rewards({ ...r, assisted: true }).xp);
    expect(clean.xp).toBeGreaterThan(rewards({ ...r, heartsLeft: 1 }).xp);
    expect(rewards({ ...r, difficulty: "H" }).xp).toBeGreaterThan(clean.xp);
    expect(rewards({ ...r, assisted: true, hintsUsed: 9, heartsLeft: 0, seconds: 99999 }).bits).toBeGreaterThanOrEqual(1);
  });
});

describe("battle machine", () => {
  it("walks scout → strategise → code", () => {
    let s = M.start(cfg());
    expect(s.phase).toBe("scout");
    s = M.scoutDone(s);
    expect(s.phase).toBe("strategise");
    s = M.strategise(s, "super", 4);
    expect(s).toMatchObject({ phase: "code", effectiveness: "super", confidence: 4 });
  });
  it("hards go through the plan step; a correct plan grants a shield", () => {
    let s = M.strategise(M.scoutDone(M.start(cfg({ difficulty: "H", needsPlan: true }))), "neutral", null);
    expect(s.phase).toBe("plan");
    s = M.plan(s, true);
    expect(s).toMatchObject({ phase: "code", planCorrect: true, shield: true });
    const r = judge(s, { kind: "submit", groups: { basic: true } });
    expect(r.shieldUsed).toBe(true);
    expect(r.heartLost).toBe(false);
    expect(r.state.hearts).toBe(5);
    expect(r.state.shield).toBe(false);
    expect(judge(r.state, { kind: "submit", groups: {} }).heartLost).toBe(true);
  });
  it("rejects illegal transitions and bad confidence", () => {
    expect(() => M.beginJudge(M.start(cfg()))).toThrow(M.IllegalTransition);
    expect(() => M.strategise(M.start(cfg()), "neutral", 3)).toThrow(M.IllegalTransition);
    expect(() => M.plan(toCode(), true)).toThrow(M.IllegalTransition);
    expect(() => M.applyJudge(toCode(), { kind: "run" })).toThrow(M.IllegalTransition);
    expect(() => M.strategise(M.scoutDone(M.start(cfg())), "neutral", 6)).toThrow(RangeError);
    expect(() => M.useHint(M.start(cfg()))).toThrow(M.IllegalTransition);
  });
  it("a clean run chips 25% once and never costs a heart", () => {
    let r = judge(toCode(), { kind: "run", samplesPassed: true });
    expect(r.foeDamage).toBe(25);
    expect(r.state).toMatchObject({ foeHp: 75, hearts: 5, phase: "code", runs: 1 });
    r = judge(r.state, { kind: "run", samplesPassed: true });
    expect(r.foeDamage).toBe(0);
    expect(r.state.foeHp).toBe(75);
    expect(judge(toCode(), { kind: "run", samplesPassed: false }).state.hearts).toBe(5);
  });
  it("a compile error is free on submit and on run", () => {
    const r = judge(toCode(), { kind: "submit", compileError: true });
    expect(r.state).toMatchObject({ hearts: 5, submits: 0, phase: "code" });
    expect(r.heartLost).toBe(false);
  });
  it("a failed submit costs a heart and deals partial damage", () => {
    const r = judge(toCode(), { kind: "submit", groups: { basic: true, edge: true } });
    expect(r.heartLost).toBe(true);
    expect(r.state.hearts).toBe(4);
    expect(r.foeDamage).toBe(55); // 50 × 1.1 under-par bonus
    expect(r.state.foeHp).toBe(45);
    expect(r.state.submits).toBe(1);
  });
  it("partial damage accumulates only as a high-water mark, never heals the foe", () => {
    let r = judge(toCode(), { kind: "submit", groups: { basic: true, edge: true, adversarial: true } });
    expect(r.state.foeHp).toBe(23); // 70 × 1.1 = 77 damage
    r = judge(r.state, { kind: "submit", groups: { basic: true } });
    expect(r.state.foeHp).toBe(23);
  });
  it("a super effective partial pass still leaves the foe alive", () => {
    const s = M.strategise(M.scoutDone(M.start(cfg())), "super", 5);
    const r = judge(s, { kind: "submit", groups: { basic: true, edge: true, adversarial: true } });
    expect(r.state.foeHp).toBeGreaterThanOrEqual(1);
    expect(r.state.outcome).toBeNull();
  });
  it("full AC wins and ends in debrief", () => {
    const r = judge(toCode(), { kind: "submit", groups: fullGroups });
    expect(r.state).toMatchObject({ phase: "debrief", outcome: "won", foeHp: 0, hearts: 5, rematch: false });
    expect(M.isAssistedWin(r.state)).toBe(false);
  });
  it("five wrong submits faint the player and queue a rematch", () => {
    let s = toCode();
    let last = judge(s, { kind: "submit", groups: {} });
    for (let i = 1; i < 5; i++) {
      expect(last.state.phase).toBe("code");
      last = judge(last.state, { kind: "submit", groups: {} });
    }
    expect(last.state).toMatchObject({ phase: "debrief", outcome: "fainted", hearts: 0, rematch: true });
    s = last.state;
    expect(() => M.beginJudge(s)).toThrow(M.IllegalTransition);
  });
  it("hints: more than two make the win assisted; the editorial assists too", () => {
    let s = toCode();
    s = M.useHint(M.useHint(s));
    expect(s.assisted).toBe(false);
    s = M.useHint(s);
    expect(s.assisted).toBe(true);
    const won = judge(s, { kind: "submit", groups: fullGroups }).state;
    expect(M.isAssistedWin(won)).toBe(true);
    expect(M.readEditorial(toCode()).assisted).toBe(true);
  });
  it("retreat queues a rematch without losing hearts; it is a no-op in debrief", () => {
    const r = M.retreat(toCode());
    expect(r).toMatchObject({ phase: "debrief", outcome: "retreated", rematch: true, hearts: 5 });
    const won = judge(toCode(), { kind: "submit", groups: fullGroups }).state;
    expect(M.retreat(won)).toBe(won);
  });
  it("the clock only runs while coding or judging", () => {
    expect(M.tick(M.start(cfg()), 5).seconds).toBe(0);
    expect(M.tick(toCode(), 5).seconds).toBe(5);
    expect(M.tick(toCode(), -3).seconds).toBe(0);
  });
  it("rust caps a super multiplier in damage", () => {
    const g = { basic: true, edge: true, adversarial: true };
    const mk = (rusty: boolean) => M.strategise(M.scoutDone(M.start(cfg({ rusty }))), "super", 3);
    const rusty = judge(mk(true), { kind: "submit", groups: g }).foeDamage;
    const fresh = judge(mk(false), { kind: "submit", groups: g }).foeDamage;
    expect(rusty).toBeLessThan(fresh);
  });
  it("a weak strategy halves damage but a full AC still wins", () => {
    const s = M.strategise(M.scoutDone(M.start(cfg())), "weak", 2);
    expect(judge(s, { kind: "submit", groups: { basic: true, edge: true } }).state.foeHp).toBe(72); // 50 × 0.5 × 1.1 = 28
    expect(judge(s, { kind: "submit", groups: fullGroups }).state.outcome).toBe("won");
  });
});
