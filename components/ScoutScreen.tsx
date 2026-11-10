"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PATTERNS, patternById } from "@/content/patterns";
import { STATEMENTS } from "@/content/recognition";
import { choicesFor, gradeRecognition, type RecognitionResult } from "@/lib/recognition/grade";
import { pickRound, recordBlitz, SCOUT_MIN_STATEMENTS, scoutProgress } from "@/lib/recognition/progress";
import { BLITZ_TIME_MS, type RecognitionStatement } from "@/lib/recognition/types";
import { IdbBackend } from "@/lib/save/idb";
import { newCoreSave, type CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";

const ALL_IDS = PATTERNS.filter((p) => p.region !== "R0" && p.region !== "R1").map((p) => p.id);
const regionOf = (id: string) => patternById(id)?.region ?? "R2";
const ROUND = 10;

/** Highlights each verbatim signal inside the text. */
function Marked({ text, signals }: { text: string; signals: readonly string[] }) {
  const parts: { t: string; hit: boolean }[] = [{ t: text, hit: false }];
  for (const sig of signals) {
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]!;
      const at = p.hit ? -1 : p.t.indexOf(sig);
      if (at < 0) continue;
      parts.splice(i, 1, { t: p.t.slice(0, at), hit: false }, { t: sig, hit: true }, { t: p.t.slice(at + sig.length), hit: false });
      break;
    }
  }
  return <>{parts.map((p, i) => (p.hit ? <mark key={i} className="rounded bg-amber-400/30 px-0.5 text-inherit">{p.t}</mark> : <span key={i}>{p.t}</span>))}</>;
}

/** Scout School recognition blitz (CUR §5, GDD §5.5): name the pattern(s) within 20 s. Progress is saved in the core save's flags. */
export default function ScoutScreen() {
  const [core, setCore] = useState<CoreSave>(() => newCoreSave(0));
  const [ready, setReady] = useState(false);
  const [round, setRound] = useState<RecognitionStatement[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [results, setResults] = useState<RecognitionResult[]>([]);
  const [left, setLeft] = useState(BLITZ_TIME_MS);
  const started = useRef(0);
  const svc = useRef<SaveService | null>(null);
  const rotRef = useRef(0);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then(setCore).catch(() => {}).finally(() => setReady(true));
  }, []);

  const stmt = round?.[idx];
  const choices = useMemo(() => (stmt ? choicesFor(stmt, ALL_IDS, regionOf, idx) : []), [stmt, idx]);

  const submit = useCallback(async (forced: string[]) => {
    if (!stmt || result) return;
    const elapsed = Math.min(Date.now() - started.current, BLITZ_TIME_MS * 2);
    const r = gradeRecognition(stmt, forced, elapsed);
    setResult(r);
    setResults((x) => [...x, r]);
    const s = svc.current;
    if (!s) return;
    const fresh = await s.load();
    const next = recordBlitz(fresh, stmt.id, r);
    if (next !== fresh) await s.save(next);
    setCore(next);
  }, [stmt, result]);

  // 20 s countdown; at zero the current picks are graded as late.
  useEffect(() => {
    if (!stmt || result) return;
    started.current = Date.now();
    const t = setInterval(() => {
      const l = BLITZ_TIME_MS - (Date.now() - started.current);
      setLeft(Math.max(0, l));
    }, 200);
    return () => clearInterval(t);
  }, [stmt, result]);

  const timedOut = left <= 0 && !result;
  const start = () => {
    rotRef.current += ROUND;
    setRound(pickRound(core, STATEMENTS, ROUND, rotRef.current));
    setIdx(0); setPicks([]); setResult(null); setResults([]); setLeft(BLITZ_TIME_MS);
  };
  const advance = () => { setIdx((i) => i + 1); setPicks([]); setResult(null); setLeft(BLITZ_TIME_MS); };
  const prog = scoutProgress(core, STATEMENTS);
  const done = round && idx >= round.length;
  const toggle = (id: string) => setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const nameOf = (id: string) => patternById(id)?.name ?? id;

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Scout School</h1>
        <a href="/play/" className="text-sm underline opacity-80">Back to the map</a>
      </header>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <div className="panel p-3 text-sm" data-testid="scout-progress">
          <p>
            <strong>{prog.inTime}</strong> of <strong>{prog.attempted}</strong> statements spotted in time ({Math.round(prog.accuracy * 100)}%).
            Goal: 90% on at least {SCOUT_MIN_STATEMENTS} of {STATEMENTS.length}.
          </p>
          <p className="mt-1 opacity-80" data-testid="scout-mastery">
            {prog.mastered ? "Scout mastery earned: the Complexity Compass hint is now free." : `Scout mastery: ${Math.max(0, SCOUT_MIN_STATEMENTS - prog.attempted)} more statements to try, then keep 90%.`}
          </p>
        </div>

        {!round || done ? (
          <div className="panel flex flex-col gap-3 p-3">
            {done && (
              <p data-testid="scout-summary" className="text-sm">
                Round over: {results.filter((r) => r.inTime).length} of {results.length} named in time.
                {results.some((r) => r.correct && !r.inTime) ? " Correct-but-late answers do not count: in an interview, speed is part of recognition." : ""}
              </p>
            )}
            <p className="text-sm opacity-80">Read each short statement and its constraints, then pick the pattern(s) you would reach for within 20 seconds. Select every pattern the problem needs, then lock in.</p>
            <button className="px-btn px-btn-primary min-h-11 px-4 text-lg" disabled={!ready} onClick={start}>{done ? "NEXT ROUND" : "START BLITZ"}</button>
            <a href="/learn/" className="px-btn flex min-h-11 items-center justify-center text-sm">Scout lessons (Academy)</a>
          </div>
        ) : stmt ? (
          <div className="panel flex flex-col gap-3 p-3" data-testid="scout-card">
            <div className="flex items-center justify-between text-xs">
              <span>Statement {idx + 1} / {round.length}</span>
              <span data-testid="scout-timer" className={left < 5000 && !result ? "text-red-300" : ""}>{result ? "" : `${Math.ceil(left / 1000)} s`}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded bg-white/10" aria-hidden><div className="h-full bg-[var(--gold)]" style={{ width: `${(result ? 0 : left / BLITZ_TIME_MS) * 100}%` }} /></div>
            <p className="text-base leading-relaxed">{result ? <Marked text={stmt.text} signals={stmt.signals} /> : stmt.text}</p>
            <p className="font-mono text-sm opacity-80">{result ? <Marked text={stmt.constraints} signals={stmt.signals} /> : stmt.constraints}</p>
            <div role="group" aria-label="Patterns" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {choices.map((id) => {
                const on = picks.includes(id);
                const isAns = stmt.answer.includes(id);
                const cls = result ? (isAns ? "border-emerald-400/70 bg-emerald-500/20" : on ? "border-red-400/70 bg-red-500/20" : "border-white/15") : on ? "border-amber-400/80 bg-amber-500/20" : "border-white/20";
                return (
                  <button key={id} aria-pressed={on} disabled={!!result || timedOut} className={`min-h-11 rounded border px-2 py-1 text-left text-sm ${cls}`} onClick={() => toggle(id)}>{nameOf(id)}</button>
                );
              })}
            </div>
            {!result ? (
              <button className="px-btn px-btn-primary min-h-11 px-4" disabled={picks.length === 0 && !timedOut} onClick={() => submit(picks)}>{timedOut ? "TIME UP: SEE ANSWER" : "LOCK IN"}</button>
            ) : (
              <div className="flex flex-col gap-2" data-testid="scout-feedback">
                <p className="font-display text-sm" data-testid="scout-verdict">{result.inTime ? "Spotted in time" : result.correct ? "Right, but too slow" : "Not quite"}</p>
                <p className="text-sm">{stmt.explanation}</p>
                <button className="px-btn min-h-11 px-4" onClick={advance}>{idx + 1 >= round.length ? "FINISH ROUND" : "NEXT"}</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
