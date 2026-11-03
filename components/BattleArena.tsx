"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pixelFamily } from "@/app/fonts";
import BattleLayout from "@/components/BattleLayout";
import { BattleStage, type BattleStageHandle } from "@/components/BattleStage";
import CodeEditor from "@/components/CodeEditor";
import StatementPanel from "@/components/StatementPanel";
import VerdictPanel from "@/components/VerdictPanel";
import { DEFAULT_EDITOR_SETTINGS } from "@/lib/editor/settings";
import { compileCpp, runWasm } from "@/lib/judge/client";
import { judgeProblem } from "@/lib/judge/judge";
import type { DriverSpec } from "@/lib/judge/harness/driver";
import type { TestCase } from "@/lib/judge/verdict";
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

const FOE_HP = 100;

/** One coding battle: stage + statement + editor, Run (visible tests) chips the foe, Submit (all tests) decides the fight. */
export default function BattleArena({ problem }: { problem: ArenaProblem }) {
  const statement = useMemo(() => parseStatement(problem.statement), [problem.statement]);
  const visible = useMemo(() => problem.tests.filter((t) => t.group === "basic"), [problem.tests]);
  const [tab, setTab] = useState<BattleTab>("code");
  const [code, setCode] = useState(problem.starter);
  const [view, setView] = useState<VerdictView | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
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
    const t = setTimeout(() => stage.current?.say(`A wild ${problem.foeName} appeared! Write the code to beat it.`), 900);
    return () => {
      alive = false;
      clearTimeout(t);
      document.removeEventListener("visibilitychange", onHide);
      void a.dispose();
    };
  }, [problem]);

  function edit(c: string) {
    setCode(c);
    saver.current?.update(c);
  }

  async function judge(kind: JudgeKind) {
    const tests = kind === "run" ? visible : problem.tests;
    setBusy(true);
    setView(null);
    const r = await judgeProblem(problem.spec, code, tests, { timeLimitMs: problem.timeLimitMs }, { compile: (s) => compileCpp(s), run: runWasm });
    const v = buildVerdictView(r, tests);
    setView(v);
    setBusy(false);
    const out = battleOutcome(kind, v.verdict, v.passed, v.total, FOE_HP);
    if (out.foeDamage > 0) stage.current?.hitFoe(out.foeDamage, kind === "submit", kind === "submit" ? "burst" : "slash");
    if (out.playerHearts > 0) stage.current?.hitPlayer(out.playerHearts);
    if (kind === "submit") stage.current?.verdict(v.verdict);
    if (kind === "submit" && v.verdict === "AC") stage.current?.faint("foe");
    stage.current?.say(out.line);
    setTab((cur) => tabAfterJudge(cur, kind, v.verdict));
  }

  return (
    <BattleLayout
      tab={tab}
      onTab={setTab}
      badges={view ? { code: view.verdict } : undefined}
      stage={<BattleStage ref={stage} font={`${pixelFamily}, monospace`} foeName={problem.foeName} foeLevel={problem.foeLevel} foeMax={FOE_HP} />}
      problem={<StatementPanel statement={statement} badge={<span className="px-btn px-2 text-xs">{problem.difficulty}</span>} />}
      code={
        <>
          <div className="min-h-0 flex-1"><CodeEditor value={code} onChange={edit} settings={DEFAULT_EDITOR_SETTINGS} /></div>
          <div className="max-h-[30dvh] overflow-auto lg:max-h-[24dvh]"><VerdictPanel view={view} /></div>
          {note && <p className="text-xs opacity-70" data-testid="draft-note">{note}</p>}
        </>
      }
      actions={
        <div className="flex gap-2">
          <button className="px-btn min-h-11 flex-1" disabled={busy} onClick={() => judge("run")}>Run ({visible.length})</button>
          <button className="px-btn px-btn-primary min-h-11 flex-1" disabled={busy} onClick={() => judge("submit")}>{busy ? "Judging…" : `Submit (${problem.tests.length})`}</button>
        </div>
      }
    />
  );
}
