"use client";

import { useEffect, useMemo, useState } from "react";
import { allScrolls } from "@/content/scrolls";
import { problemCatalog } from "@/content/gyms/catalog";
import { PATTERNS } from "@/content/patterns";
import { STATEMENTS } from "@/content/recognition";
import { computeReadiness, type ReadinessInput } from "@/lib/readiness/readiness";
import { scoutProgress } from "@/lib/recognition/progress";
import { IdbBackend } from "@/lib/save/idb";
import { newCoreSave, type Attempt, type CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";

const PROBLEMS = Object.values(problemCatalog).map((c) => ({ id: c.meta.id, difficulty: c.meta.difficulty, patterns: c.meta.patterns, parSeconds: c.meta.parSeconds }));
const SCROLLS = allScrolls.map((s) => ({ id: s.id, parSeconds: problemCatalog[s.problemId]?.meta.parSeconds ?? 600 }));

const pct = (x: number): string => `${Math.round(x * 100)}%`;
const DIFF_NAME = { E: "Easy", M: "Medium", H: "Hard" } as const;

/** Pixel-styled radar: one spoke per pattern. Falls back to bars when there are fewer than three patterns. */
function Radar({ spokes }: { spokes: { pattern: string; name: string; value: number }[] }) {
  const n = spokes.length;
  const R = 80;
  const C = 100;
  const pt = (i: number, v: number): [number, number] => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v];
  };
  const ring = (v: number): string => spokes.map((_, i) => pt(i, v).join(",")).join(" ");
  const shape = spokes.map((s, i) => pt(i, Math.max(0.03, s.value)).join(",")).join(" ");
  return (
    <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-xs" role="img" aria-label="Pattern strength radar" shapeRendering="crispEdges" data-testid="radar">
      {[0.25, 0.5, 0.75, 1].map((v) => <polygon key={v} points={ring(v)} fill="none" stroke="currentColor" strokeOpacity={0.2} />)}
      {spokes.map((s, i) => { const [x, y] = pt(i, 1); return <line key={s.pattern} x1={C} y1={C} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.2} />; })}
      <polygon points={shape} fill="var(--gold)" fillOpacity={0.35} stroke="var(--gold)" strokeWidth={2} />
    </svg>
  );
}

/** Trainer Card / Readiness Report (GDD §9). Everything is derived on load from the save and the attempt log. */
export default function CardScreen() {
  const [data, setData] = useState<{ core: CoreSave; attempts: Attempt[]; now: number } | null>(null);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    Promise.all([s.load(), s.attempts()]).then(([core, attempts]) => setData({ core, attempts, now: Date.now() })).catch(() => setData({ core: newCoreSave(Date.now()), attempts: [], now: Date.now() }));
  }, []);

  const report = useMemo(() => {
    if (!data) return null;
    const input: ReadinessInput = {
      core: data.core, attempts: data.attempts, problems: PROBLEMS, scrolls: SCROLLS, patterns: PATTERNS, scout: scoutProgress(data.core, STATEMENTS), now: data.now,
    };
    return computeReadiness(input);
  }, [data]);

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Trainer Card</h1>
        <a href="/play/" className="text-sm underline opacity-80">Back to the map</a>
      </header>
      {!report || !data ? <p className="mx-auto max-w-3xl text-sm">Loading your card…</p> : (
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <section className="panel p-4" aria-label="Summary" data-testid="card-summary">
            <p className="font-display text-xl">{data.core.profile.name}</p>
            <p className="text-sm opacity-80">Lv {data.core.profile.level} · {data.core.profile.bits} Bits · {data.core.profile.streakDays}-day streak</p>
            <p className="mt-1 text-sm">Interview readiness: <b className="text-[var(--gold)]" data-testid="readiness">{pct(report.readiness)}</b> of gates passed · {report.accepted} accepted of {report.attemptsTotal} submissions</p>
          </section>

          <section className="panel flex flex-col gap-1 p-4" aria-label="Next best action" data-testid="next-action">
            <h2 className="font-display text-lg text-[var(--gold)]">Next best action</h2>
            <p className="font-semibold">{report.next.title}</p>
            <p className="text-sm opacity-80">{report.next.why}</p>
            <a href={report.next.href} className="px-btn px-btn-primary mt-2 flex min-h-11 items-center justify-center">GO</a>
          </section>

          <section className="panel flex flex-col gap-3 p-4" aria-label="Readiness gates">
            <h2 className="font-display text-lg text-[var(--gold)]">Readiness gates</h2>
            {report.gates.map((g) => (
              <div key={g.id} data-testid={`gate-${g.id}`}>
                <div className="flex justify-between text-sm"><span>{g.label}</span><span>{g.passed ? "✔ passed" : pct(g.progress)}</span></div>
                <div className="my-1 h-3 w-full border border-white/30 bg-black/40" role="progressbar" aria-valuenow={Math.round(g.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={g.label}>
                  <div className="h-full" style={{ width: pct(g.progress), background: g.passed ? "#34d399" : "var(--gold)" }} />
                </div>
                <p className="text-xs opacity-70">{g.detail}</p>
              </div>
            ))}
          </section>

          <section className="panel p-4" aria-label="Pattern strength">
            <h2 className="font-display text-lg text-[var(--gold)]">Pattern strength</h2>
            {report.radar.length >= 3 && <Radar spokes={report.radar} />}
            <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
              {report.radar.map((s) => <li key={s.pattern} className="flex justify-between"><span>{s.name}</span><span className="opacity-80">{pct(s.value)}</span></li>)}
            </ul>
          </section>

          <section className="panel p-4" aria-label="Time versus par">
            <h2 className="font-display text-lg text-[var(--gold)]">Median time vs par</h2>
            <ul className="text-sm">
              {report.timeVsPar.map((t) => (
                <li key={t.difficulty} className="flex justify-between">
                  <span>{DIFF_NAME[t.difficulty]}</span>
                  <span className="opacity-80">{t.medianRatio === null ? "no accepted solves yet" : `${t.medianRatio.toFixed(2)}× par (${t.samples} solve${t.samples === 1 ? "" : "s"})`}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel p-4" aria-label="Why submissions failed" data-testid="causes">
            <h2 className="font-display text-lg text-[var(--gold)]">Why submissions fail</h2>
            {report.causes.length === 0 ? <p className="text-sm opacity-80">No failed submissions recorded yet.</p> : (
              <ul className="text-sm">
                {report.causes.map((c) => (
                  <li key={c.cause} className="flex items-center gap-2">
                    <span className="w-28 shrink-0">{c.cause}</span>
                    <span className="h-3 bg-[var(--gold)]" style={{ width: `${Math.max(4, (c.count / report.causes[0]!.count) * 60)}%` }} />
                    <span className="opacity-80">{c.count}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs opacity-60">Causes are verdicts (WA, TLE, RE, CE) until the debrief gains cause tags. Confidence calibration arrives with those prompts.</p>
          </section>
        </div>
      )}
    </main>
  );
}
