"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PATTERNS } from "@/content/patterns";
import { STATEMENTS } from "@/content/recognition";
import { blitzSecondsLeft } from "@/lib/gym/progress";
import { choicesFor, gradeRecognition, type RecognitionResult } from "@/lib/recognition/grade";
import { outcomeOf, pickRound, recordScout, scoutProgress } from "@/lib/recognition/progress";
import { BLITZ_TIME_MS, type RecognitionStatement } from "@/lib/recognition/types";
import { IdbBackend } from "@/lib/save/idb";
import { SaveService } from "@/lib/save/service";

const ROUND = 10;
const nowMs = (): number => Date.now();
const nameOf = (id: string): string => PATTERNS.find((p) => p.id === id)?.name ?? id;
const regionOf = (id: string): string => PATTERNS.find((p) => p.id === id)?.region ?? "R0";
const ALL_IDS = PATTERNS.filter((p) => p.region !== "R0" && p.region !== "R1").map((p) => p.id);

/** The text with every signal phrase marked, so the player sees what gave the pattern away. */
function Marked({ text, signals }: { text: string; signals: readonly string[] }) {
  const parts: { t: string; hit: boolean }[] = [];
  let rest = text;
  while (rest) {
    const found = signals.map((s) => ({ s, i: rest.indexOf(s) })).filter((x) => x.i >= 0).sort((a, b) => a.i - b.i)[0];
    if (!found) { parts.push({ t: rest, hit: false }); break; }
    if (found.i > 0) parts.push({ t: rest.slice(0, found.i), hit: false });
    parts.push({ t: found.s, hit: true });
    rest = rest.slice(found.i + found.s.length);
  }
  return <>{parts.map((p, i) => (p.hit ? <mark key={i} className="rounded bg-amber-400/30 px-0.5 text-inherit">{p.t}</mark> : <Fragment key={i}>{p.t}</Fragment>))}</>;
}

function Question({ s, index, onDone }: { s: RecognitionStatement; index: number; onDone: (r: RecognitionResult) => void }) {
  const options = useMemo(() => choicesFor(s, ALL_IDS, regionOf, 7), [s]);
  const [startedAt] = useState(nowMs); // the parent remounts this per statement
  const [left, setLeft] = useState(BLITZ_TIME_MS / 1000);
  const [picks, setPicks] = useState<string[]>([]);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const lock = useCallback((chosen: string[], elapsed: number) => setResult(gradeRecognition(s, chosen, elapsed)), [s]);
  useEffect(() => {
    if (result) return;
    const t = setInterval(() => {
      const l = blitzSecondsLeft(startedAt, nowMs(), BLITZ_TIME_MS / 1000);
      setLeft(l);
      if (l <= 0) lock(picks, BLITZ_TIME_MS + 1);
    }, 200);
    return () => clearInterval(t);
  }, [result, startedAt, picks, lock]);
  const toggle = (id: string) => !result && setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const need = s.answer.length;
  return (
    <section className="panel flex flex-col gap-3 p-3" data-testid="scout-question" aria-label={`Statement ${index + 1}`}>
      <div className="flex items-center justify-between text-sm">
        <span>Statement {index + 1}/{ROUND}</span>
        <span className="font-display text-[var(--gold)]" data-testid="scout-timer">{result ? "—" : `${left}s`}</span>
      </div>
      <div className="h-2 w-full border border-white/30" role="progressbar" aria-label="Time left" aria-valuemin={0} aria-valuemax={BLITZ_TIME_MS / 1000} aria-valuenow={left}>
        <div className={`h-full ${left <= 5 ? "bg-red-400" : "bg-sky-400"}`} style={{ width: `${(result ? 0 : left / (BLITZ_TIME_MS / 1000)) * 100}%` }} />
      </div>
      <p className="text-base leading-snug">{result ? <Marked text={s.text} signals={s.signals} /> : s.text}</p>
      <p className="font-mono text-xs opacity-80">{result ? <Marked text={s.constraints} signals={s.signals} /> : s.constraints}</p>
      <p className="text-xs opacity-70">{result ? "" : `Pick ${need === 1 ? "the pattern" : `all ${need} patterns`} this needs.`}</p>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Patterns">
        {options.map((id) => {
          const isAns = s.answer.includes(id);
          const on = picks.includes(id);
          const tone = result ? (isAns ? "border-emerald-400 bg-emerald-500/20" : on ? "border-red-400 bg-red-500/20" : "opacity-50") : on ? "border-amber-300 bg-amber-400/20" : "";
          return (
            <button key={id} className={`px-btn min-h-11 px-2 text-left text-sm ${tone}`} aria-pressed={on} disabled={!!result} data-pattern={id} onClick={() => toggle(id)}>
              {nameOf(id)}
            </button>
          );
        })}
      </div>
      {!result ? (
        <button className="px-btn px-btn-primary min-h-11 px-4" disabled={picks.length === 0} data-testid="scout-lock" onClick={() => lock(picks, nowMs() - startedAt)}>
          Lock in
        </button>
      ) : (
        <div className="flex flex-col gap-2" data-testid="scout-feedback">
          <p className={`font-display text-lg ${result.inTime ? "text-emerald-300" : result.correct ? "text-amber-300" : "text-red-300"}`}>
            {result.inTime ? "Spotted in time" : result.correct ? "Right, but too slow" : "Missed it"}
          </p>
          <p className="text-sm">{s.explanation}</p>
          <button className="px-btn px-btn-primary min-h-11 px-4" data-testid="scout-next" onClick={() => onDone(result)}>
            {index + 1 >= ROUND ? "Finish round" : "Next statement"}
          </button>
        </div>
      )}
    </section>
  );
}

/** Scout School (`/scout`): rounds of recognition blitz. Latest outcomes are saved; mastery unlocks the free Compass reading. */
export default function ScoutScreen() {
  const svc = useRef<SaveService | null>(null);
  const [flags, setFlags] = useState<Record<string, boolean | number | string>>({});
  const [ready, setReady] = useState(false);
  const [round, setRound] = useState<RecognitionStatement[] | null>(null);
  const [at, setAt] = useState(0);
  const [results, setResults] = useState<RecognitionResult[]>([]);
  const view = { flags };
  const prog = scoutProgress(view, STATEMENTS);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then((core) => setFlags(core.flags)).catch(() => {}).finally(() => setReady(true));
  }, []);

  const start = () => { setRound(pickRound({ flags }, STATEMENTS, ROUND, Date.now())); setAt(0); setResults([]); };
  const answered = (r: RecognitionResult) => {
    const s = round![at]!;
    setResults((prev) => [...prev, r]);
    const sv = svc.current;
    if (sv) sv.load().then((core) => { const next = recordScout(core, s.id, outcomeOf(r)); setFlags(next.flags); return next === core ? undefined : sv.save(next); }).catch(() => {});
    setAt((i) => i + 1);
  };
  const finished = round && at >= round.length;
  const got = results.filter((r) => r.inTime).length;

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Scout School</h1>
        <a href="/learn/" className="text-sm underline opacity-80">Back to the Academy</a>
      </header>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {!round && (
          <>
            <p className="text-sm">Read a short problem, then name the pattern in 20 seconds. Real interviews reward spotting the approach before writing a line.</p>
            <p className="panel p-3 text-sm" data-testid="scout-progress">
              {prog.seen} of {prog.total} statements seen · {prog.inTime} spotted in time ({Math.round(prog.accuracy * 100)}%).{" "}
              {prog.mastered
                ? <b className="text-emerald-300">Scout mastery earned: the Complexity Compass reads for free in battle.</b>
                : <>Mastery: at least {50} seen and 90% in time unlocks the free Complexity Compass reading.</>}
            </p>
            <button className="px-btn px-btn-primary min-h-12 px-4 text-lg" disabled={!ready} data-testid="scout-start" onClick={start}>Start a round of {ROUND}</button>
          </>
        )}
        {round && !finished && <Question key={round[at]!.id} s={round[at]!} index={at} onDone={answered} />}
        {finished && (
          <section className="panel flex flex-col gap-3 p-3" data-testid="scout-summary">
            <h2 className="font-display text-xl text-[var(--gold)]">Round complete</h2>
            <p>{got} of {round.length} spotted in time · {results.filter((r) => r.correct).length} right.</p>
            <p className="text-sm opacity-80" data-testid="scout-progress">{prog.seen} of {prog.total} seen · {Math.round(prog.accuracy * 100)}% in time overall.{prog.mastered ? " Scout mastery earned." : ""}</p>
            <ul className="text-sm">
              {round.map((s, i) => (
                <li key={s.id}>{results[i]?.inTime ? "✔" : results[i]?.correct ? "◐" : "✘"} {s.answer.map(nameOf).join(" + ")}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button className="px-btn px-btn-primary min-h-11 flex-1" data-testid="scout-again" onClick={start}>Another round</button>
              <button className="px-btn min-h-11 flex-1" onClick={() => setRound(null)}>Done</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
