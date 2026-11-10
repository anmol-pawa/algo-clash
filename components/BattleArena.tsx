"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pixelFamily } from "@/app/fonts";
import BattleLayout from "@/components/BattleLayout";
import { BattleStage, type BattleScene, type BattleStageHandle } from "@/components/BattleStage";
import CodeEditor from "@/components/CodeEditor";
import CompassPanel from "@/components/CompassPanel";
import LensPanel from "@/components/LensPanel";
import ModePanel from "@/components/ModePanel";
import OwnTestsPanel from "@/components/OwnTestsPanel";
import { applicableClasses, coverage, hidesDiff, ownTestIssue, ownTestsGate, type OwnTest } from "@/lib/modes/owntests";
import { DEFAULT_MODE, modeAssists, modeDef, runsLeft as runsLeftOf, sanitizeMode, timerSeconds, type ModeId } from "@/lib/modes/modes";
import DebriefPanel, { type DebriefDone } from "@/components/DebriefPanel";
import { problemCatalog } from "@/content/gyms/catalog";
import HintPanel from "@/components/HintPanel";
import StatementPanel from "@/components/StatementPanel";
import VerdictPanel from "@/components/VerdictPanel";
import { DEFAULT_EDITOR_SETTINGS } from "@/lib/editor/settings";
import { compileCpp, runWasm } from "@/lib/judge/client";
import { judgeProblem } from "@/lib/judge/judge";
import type { DriverSpec } from "@/lib/judge/harness/driver";
import { audio } from "@/lib/audio/engine";
import { verdictSfx } from "@/lib/audio/sfx";
import { useMusic } from "@/components/Music";
import type { TestCase } from "@/lib/judge/verdict";
import { parseHints } from "@/lib/items/hints";
import { NO_ASSISTANCE, consume, countOf, grantStarterKit, isAssisted } from "@/lib/items/items";
import { DraftAutosaver } from "@/lib/save/autosave";
import { IdbBackend } from "@/lib/save/idb";
import { SaveService } from "@/lib/save/service";
import { STATEMENTS } from "@/content/recognition";
import { scoutProgress } from "@/lib/recognition/progress";
import { battleOutcome, tabAfterJudge, type BattleTab, type JudgeKind } from "@/lib/ui/battleTabs";
import { parseStatement } from "@/lib/ui/statement";
import { buildVerdictView, type VerdictView } from "@/lib/ui/verdictView";

export interface ArenaProblem {
  id: string;
  title: string;
  difficulty: string;
  statement: string;
  starter: string;
  spec: DriverSpec;
  timeLimitMs: number;
  tests: TestCase[];
  foeName: string;
  foeLevel: number;
}

export type ArenaResult = "won" | "fainted" | "retreated";

/** What the fight cost the player, for the SRS (GDD §6.2): more than two hints makes a win assisted. */
export interface ArenaInfo {
  hintsUsed: number;
  assisted: boolean;
  /** The Complexity Compass was used: the tier gained by a win is cut by one. */
  compass: boolean;
  /** The Debug Lens was used: the win counts as assisted. */
  lens: boolean;
  /** Scaffolding mode the fight was played in (GDD 6.5). */
  mode: ModeId;
  /** Divide elapsed seconds by this before comparing with par (Interview and Contest slack). */
  creditMultiplier: number;
  /** Share (0..1) of the problem's edge-case classes your own tests covered; null when the mode has no own-tests gate. */
  edgeCoverage: number | null;
}

export interface ArenaOptions {
  /** Foe HP at the start of the fight (gym head start). */
  foeStartHp?: number;
  /** "gym": lighthouse backdrop and Warden Brace as the foe. */
  scene?: BattleScene;
  /** clang flags for every Run/Submit (a gym twist such as -Werror). Compile errors never cost a heart. */
  compileFlags?: string[];
  /** When set the fight can end: a Continue button reports the result, and Retreat is offered. */
  onResult?: (r: ArenaResult, info?: ArenaInfo) => void;
}

const PLAYER_HEARTS = 5;

const FOE_HP = 100;

/** One coding battle: stage + statement + editor, Run (visible tests) chips the foe, Submit (all tests) decides the fight. */
export default function BattleArena({ problem, foeStartHp, scene, compileFlags, onResult }: { problem: ArenaProblem } & ArenaOptions) {
  useMusic("battle");
  const statement = useMemo(() => parseStatement(problem.statement), [problem.statement]);
  const visible = useMemo(() => problem.tests.filter((t) => t.group === "basic"), [problem.tests]);
  const [tab, setTab] = useState<BattleTab>("code");
  const [code, setCode] = useState(problem.starter);
  const [view, setView] = useState<VerdictView | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [endedState, setEnded] = useState<"won" | "fainted" | null>(null);
  const [confirmRetreat, setConfirmRetreat] = useState(false);
  const [debrief, setDebrief] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [won, setWon] = useState({ seconds: 0, hearts: PLAYER_HEARTS });
  const catalogEntry = problemCatalog[problem.id];
  const hints = useMemo(() => parseHints(catalogEntry?.hints ?? ""), [catalogEntry]);
  const [tokens, setTokens] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [compassTokens, setCompassTokens] = useState(0);
  const [compassUsed, setCompassUsed] = useState(false);
  const [scoutMastered, setScoutMastered] = useState(false);
  const [lensTokens, setLensTokens] = useState(0);
  const [lensUsed, setLensUsed] = useState(false);
  const [lastFail, setLastFail] = useState<string | undefined>();
  const [modeId, setModeId] = useState<ModeId>(DEFAULT_MODE);
  const [runs, setRuns] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [ownTests, setOwnTests] = useState<OwnTest[]>([{ input: "", expected: "" }, { input: "", expected: "" }]);
  const [ownStatus, setOwnStatus] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const mode = modeDef(modeId);
  const parSeconds = catalogEntry?.meta.parSeconds ?? 600;
  const limit = timerSeconds(mode, parSeconds);
  const timeLeft = limit === null ? null : Math.max(0, limit - Math.floor((now - startedAt) / 1000));
  const runsLeft = runsLeftOf(mode, runs);
  const ended = endedState ?? (timeLeft === 0 ? "fainted" : null); // Contest: the clock ending is a faint
  const assisted = isAssisted({ ...NO_ASSISTANCE, hintsUsed: revealed, compass: compassUsed, lens: lensUsed, guided: modeAssists(mode) });
  const applicable = useMemo(() => applicableClasses(problem.tests), [problem.tests]);
  const cov = coverage(ownTests.filter((t) => ownTestIssue(t) === null), applicable);
  const gate = ownTestsGate(mode.ownTests, ownTests);
  const info: ArenaInfo = { hintsUsed: revealed, assisted, compass: compassUsed, lens: lensUsed, mode: mode.id, creditMultiplier: mode.multiplier, edgeCoverage: mode.ownTests ? cov.ratio : null };

  const hearts = useRef(PLAYER_HEARTS);
  const stage = useRef<BattleStageHandle>(null);
  const saver = useRef<DraftAutosaver | null>(null);

  useEffect(() => {
    let alive = true;
    const svc = new SaveService(new IdbBackend());
    const a = new DraftAutosaver(svc, problem.id, problem.starter);
    saver.current = a;
    svc.loadDraft(problem.id).then((d) => {
      if (!alive || !d || d.code === problem.starter) return;
      a.markSaved(d.code);
      setCode(d.code);
      setNote("Draft restored");
    }).catch(() => {});
    const onHide = () => { if (document.visibilityState === "hidden") void a.flush(); };
    document.addEventListener("visibilitychange", onHide);
    const t = setTimeout(() => stage.current?.say(scene && scene !== "meadow" ? `${problem.foeName} holds the line! Write the code to break through.` : `A wild ${problem.foeName} appeared! Write the code to beat it.`), 900);
    return () => {
      alive = false;
      clearTimeout(t);
      document.removeEventListener("visibilitychange", onHide);
      void a.dispose();
    };
  }, [problem, scene]);

  useEffect(() => {
    let saved: ModeId = DEFAULT_MODE;
    try { saved = sanitizeMode(window.localStorage.getItem("algo-clash.mode")); } catch { /* storage blocked: Standard */ }
    void Promise.resolve().then(() => setModeId(saved));
  }, []);

  function pickMode(id: ModeId) {
    setModeId(id);
    try { window.localStorage.setItem("algo-clash.mode", id); } catch { /* optional */ }
  }

  // Contest clock: when it runs out the foe wins.
  useEffect(() => {
    if (limit === null || ended) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [limit, ended]);
  useEffect(() => {
    if (timeLeft === 0) stage.current?.say("Time! The foe wins this round.");
  }, [timeLeft]);

  useEffect(() => {
    let alive = true;
    const svc = new SaveService(new IdbBackend());
    svc.load().then(async (c) => {
      const kit = grantStarterKit(c);
      if (kit !== c) await svc.save(kit);
      if (alive) { setScoutMastered(scoutProgress(c, STATEMENTS).mastered); setTokens(countOf(kit, "hint-token")); setCompassTokens(countOf(kit, "complexity-compass")); setLensTokens(countOf(kit, "debug-lens")); }
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  /** Spends one Hint Token (read-modify-write on the save) and reveals the next rung. */
  async function revealHint() {
    if (revealed >= hints.length) return;
    if (mode.approachCard) { setRevealed((n) => n + 1); audio.playSfx("menu"); return; } // Guided: free hints
    try {
      const svc = new SaveService(new IdbBackend());
      const next = consume(grantStarterKit(await svc.load()), "hint-token");
      if (!next) { setTokens(0); return; }
      await svc.save(next);
      setTokens(countOf(next, "hint-token"));
      setRevealed((n) => n + 1);
      audio.playSfx("menu");
    } catch { /* offline storage unavailable: no hint, no charge */ }
  }

  /** Spends one Complexity Compass (read-modify-write on the save) and shows the target complexity. */
  async function useCompass() {
    if (compassUsed) return;
    try {
      const svc = new SaveService(new IdbBackend());
      const next = consume(grantStarterKit(await svc.load()), "complexity-compass");
      if (!next) { setCompassTokens(0); return; }
      await svc.save(next);
      setCompassTokens(countOf(next, "complexity-compass"));
      setCompassUsed(true);
      audio.playSfx("menu");
    } catch { /* storage unavailable: no compass, no charge */ }
  }

  /** Spends one Debug Lens (read-modify-write on the save); the win will count as assisted. */
  async function useLens() {
    if (lensUsed) return;
    try {
      const svc = new SaveService(new IdbBackend());
      const next = consume(grantStarterKit(await svc.load()), "debug-lens");
      if (!next) { setLensTokens(0); return; }
      await svc.save(next);
      setLensTokens(countOf(next, "debug-lens"));
      setLensUsed(true);
      audio.playSfx("menu");
    } catch { /* storage unavailable: no lens, no charge */ }
  }

  function edit(c: string) {
    setCode(c);
    saver.current?.update(c);
  }

  /** Judge the player's own tests against their own code. Does not use up a Run. */
  async function runOwnTests() {
    const tests = ownTests.filter((t) => ownTestIssue(t) === null);
    if (tests.length === 0) return;
    setBusy(true);
    setOwnStatus("Judging your tests…");
    const r = await judgeProblem(problem.spec, code, tests, { timeLimitMs: problem.timeLimitMs }, { compile: (s) => compileCpp(s, compileFlags), run: runWasm });
    setBusy(false);
    if (r.verdict === "CE") { setOwnStatus("Your code does not compile yet. Fix that first."); return; }
    const verdicts = tests.map((_, i) => r.outcomes[i]?.verdict);
    let k = 0;
    setOwnTests(ownTests.map((t) => (ownTestIssue(t) === null ? { ...t, passed: verdicts[k] === undefined ? undefined : verdicts[k++] === "AC" } : t)));
    const bad = verdicts.findIndex((v) => v !== undefined && v !== "AC");
    setOwnStatus(bad < 0 ? "All your tests pass." : `Your test #${bad + 1} fails: either the expected output or your code is wrong. Work out which.`);
  }

  async function judge(kind: JudgeKind) {
    if (kind === "run" && runsLeft === 0) return;
    const tests = kind === "run" ? visible : problem.tests;
    if (kind === "run") setRuns((n) => n + 1); else setSubmitted(true);
    setBusy(true);
    setView(null);
    const r = await judgeProblem(problem.spec, code, tests, { timeLimitMs: problem.timeLimitMs }, { compile: (s) => compileCpp(s, compileFlags), run: runWasm });
    const v = buildVerdictView(r, tests);
    setView(v);
    if (v.failInput !== undefined) setLastFail(v.failInput);
    setBusy(false);
    const out = battleOutcome(kind, v.verdict, v.passed, v.total, FOE_HP);
    if (kind === "submit" || v.verdict !== "AC") audio.playSfx(verdictSfx(v.verdict));
    else audio.playSfx("menu");
    if (out.foeDamage > 0) { window.setTimeout(() => audio.playSfx("hit"), 250); }
    if (out.playerHearts > 0) { window.setTimeout(() => audio.playSfx("hurt"), 250); }
    if (out.foeDamage > 0) stage.current?.hitFoe(out.foeDamage, kind === "submit", kind === "submit" ? "burst" : "slash");
    if (out.playerHearts > 0) {
      stage.current?.hitPlayer(out.playerHearts);
      hearts.current = Math.max(0, hearts.current - out.playerHearts);
      if (hearts.current === 0) setEnded("fainted");
    }
    if (kind === "submit") {
      // Feeds the Trainer Card (solve rates, time vs par, failure causes). Never blocks play.
      new SaveService(new IdbBackend()).recordAttempt({
        problemId: problem.id, at: Date.now(), verdict: v.verdict, seconds: Math.round(((Date.now() - startedAt) / 1000) / mode.multiplier),
        hintsUsed: revealed, mode: mode.id === "guided" ? "learn" : mode.id === "standard" ? "practice" : "interview", assisted,
      }).catch(() => {});
    }
    if (kind === "submit") stage.current?.verdict(v.verdict);
    if (kind === "submit" && v.verdict === "AC") { setWon({ seconds: Math.round((Date.now() - startedAt) / 1000), hearts: hearts.current }); stage.current?.faint("foe"); setEnded("won"); }
    stage.current?.say(out.line);
    setTab((cur) => tabAfterJudge(cur, kind, v.verdict));
  }

  /** Journal the accepted solution (GDD §6.1 step 6), then report the win. Failure to save never blocks play. */
  function finishDebrief(d: DebriefDone) {
    const svc = new SaveService(new IdbBackend());
    svc.recordJournal({
      problemId: problem.id, at: Date.now(), code, seconds: won.seconds, hintsUsed: revealed, assisted,
      patterns: catalogEntry?.meta.patterns ?? [], promptChoice: d.promptChoice, promptCorrect: d.promptCorrect,
    }).catch(() => {}).finally(() => onResult?.("won", info));
  }

  if (debrief && catalogEntry) {
    return (
      <main className="mx-auto flex h-dvh max-w-3xl flex-col p-2">
        <DebriefPanel
          info={{ title: problem.title, editorial: catalogEntry.editorial, reference: catalogEntry.reference, prompt: catalogEntry.prompt, parSeconds: catalogEntry.meta.parSeconds }}
          code={code} seconds={won.seconds} heartsLeft={won.hearts} onContinue={finishDebrief}
        />
      </main>
    );
  }

  return (
    <BattleLayout
      tab={tab}
      onTab={setTab}
      badges={view ? { code: view.verdict } : undefined}
      stage={<BattleStage ref={stage} scene={scene} font={`${pixelFamily}, monospace`} foeName={problem.foeName} foeLevel={problem.foeLevel} foeMax={FOE_HP} foeStart={foeStartHp} />}
      problem={<StatementPanel statement={statement} badge={<span className="px-btn px-2 text-xs">{problem.difficulty}</span>} />}
      code={
        <>
          <ModePanel mode={mode} onPick={pickMode} locked={runs > 0 || submitted || !!ended} runsLeft={runsLeft} timeLeft={timeLeft}
            approach={hints.find((h) => h.rung === "Approach")?.text} />
          <div className="min-h-[200px] flex-1"><CodeEditor value={code} onChange={edit} settings={{ ...DEFAULT_EDITOR_SETTINGS, autocomplete: mode.autocomplete }} /></div>
          {catalogEntry && mode.items && <CompassPanel complexity={catalogEntry.meta.complexity} used={compassUsed || scoutMastered} free={scoutMastered} count={compassTokens} disabled={busy || !!ended} onUse={useCompass} />}
          <LensPanel input={lastFail} used={lensUsed} count={lensTokens} disabled={busy || !!ended} onUse={useLens} />
          {hints.length > 0 && mode.hints && <HintPanel hints={hints} revealed={revealed} tokens={tokens} disabled={busy || !!ended} onReveal={revealHint} free={mode.approachCard} />}
          {mode.ownTests && <OwnTestsPanel tests={ownTests} onChange={setOwnTests} onRun={runOwnTests} busy={busy || !!ended} gate={gate} cov={cov} status={ownStatus} />}
          <div className="max-h-[30dvh] overflow-auto lg:max-h-[24dvh]"><VerdictPanel view={view} hideDiff={hidesDiff(mode.ownTests)} /></div>
          {note && <p className="text-xs opacity-70" data-testid="draft-note">{note}</p>}
        </>
      }
      actions={
        ended && onResult ? (
          <button className="px-btn px-btn-primary min-h-11 w-full" onClick={() => (ended === "won" && catalogEntry ? setDebrief(true) : onResult(ended, info))}>
            {ended === "won" ? (catalogEntry ? "Foe beaten! Debrief ▶" : "Foe beaten! Continue ▶") : "You fainted. Continue ▶"}
          </button>
        ) : (
          <div className="flex gap-2">
            {onResult && (
              <button className="px-btn min-h-11 px-3 text-sm" disabled={busy} onClick={() => (confirmRetreat ? onResult("retreated") : setConfirmRetreat(true))}
                onBlur={() => setConfirmRetreat(false)}>{confirmRetreat ? "Sure?" : "Retreat"}</button>
            )}
            <button className="px-btn min-h-11 flex-1" disabled={busy || runsLeft === 0} onClick={() => judge("run")}>Run ({visible.length})</button>
            <button className="px-btn px-btn-primary min-h-11 flex-1" disabled={busy || !gate.unlocked} title={gate.unlocked ? undefined : gate.message} onClick={() => judge("submit")}>{busy ? "Judging…" : gate.unlocked ? `Submit (${problem.tests.length})` : `Submit 🔒 ${gate.passing}/${gate.need}`}</button>
          </div>
        )
      }
    />
  );
}
