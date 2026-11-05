"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pixelFamily } from "@/app/fonts";
import BattleLayout from "@/components/BattleLayout";
import { BattleStage, type BattleStageHandle } from "@/components/BattleStage";
import CodeEditor from "@/components/CodeEditor";
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
}

export interface ArenaOptions {
  /** Foe HP at the start of the fight (gym head start). */
  foeStartHp?: number;
  /** "gym": lighthouse backdrop and Warden Brace as the foe. */
  scene?: "meadow" | "gym";
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
  const [ended, setEnded] = useState<"won" | "fainted" | null>(null);
  const [confirmRetreat, setConfirmRetreat] = useState(false);
  const [debrief, setDebrief] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [won, setWon] = useState({ seconds: 0, hearts: PLAYER_HEARTS });
  const catalogEntry = problemCatalog[problem.id];
  const hints = useMemo(() => parseHints(catalogEntry?.hints ?? ""), [catalogEntry]);
  const [tokens, setTokens] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const assisted = isAssisted({ ...NO_ASSISTANCE, hintsUsed: revealed });
  const info: ArenaInfo = { hintsUsed: revealed, assisted };
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
    const t = setTimeout(() => stage.current?.say(scene === "gym" ? `${problem.foeName} holds the line! Write the code to break through.` : `A wild ${problem.foeName} appeared! Write the code to beat it.`), 900);
    return () => {
      alive = false;
      clearTimeout(t);
      document.removeEventListener("visibilitychange", onHide);
      void a.dispose();
    };
  }, [problem, scene]);

  useEffect(() => {
    let alive = true;
    const svc = new SaveService(new IdbBackend());
    svc.load().then(async (c) => {
      const kit = grantStarterKit(c);
      if (kit !== c) await svc.save(kit);
      if (alive) setTokens(countOf(kit, "hint-token"));
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  /** Spends one Hint Token (read-modify-write on the save) and reveals the next rung. */
  async function revealHint() {
    if (revealed >= hints.length) return;
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

  function edit(c: string) {
    setCode(c);
    saver.current?.update(c);
  }

  async function judge(kind: JudgeKind) {
    const tests = kind === "run" ? visible : problem.tests;
    setBusy(true);
    setView(null);
    const r = await judgeProblem(problem.spec, code, tests, { timeLimitMs: problem.timeLimitMs }, { compile: (s) => compileCpp(s, compileFlags), run: runWasm });
    const v = buildVerdictView(r, tests);
    setView(v);
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
          <div className="min-h-0 flex-1"><CodeEditor value={code} onChange={edit} settings={DEFAULT_EDITOR_SETTINGS} /></div>
          {hints.length > 0 && <HintPanel hints={hints} revealed={revealed} tokens={tokens} disabled={busy || !!ended} onReveal={revealHint} />}
          <div className="max-h-[30dvh] overflow-auto lg:max-h-[24dvh]"><VerdictPanel view={view} /></div>
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
            <button className="px-btn min-h-11 flex-1" disabled={busy} onClick={() => judge("run")}>Run ({visible.length})</button>
            <button className="px-btn px-btn-primary min-h-11 flex-1" disabled={busy} onClick={() => judge("submit")}>{busy ? "Judging…" : `Submit (${problem.tests.length})`}</button>
          </div>
        )
      }
    />
  );
}
