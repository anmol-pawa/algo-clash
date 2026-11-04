"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CardBattle from "@/components/CardBattle";
import CodeEditor from "@/components/CodeEditor";
import StatementPanel from "@/components/StatementPanel";
import VerdictPanel from "@/components/VerdictPanel";
import { allCards, computed } from "@/content/cards";
import { allScrolls } from "@/content/scrolls";
import { scrollKits } from "@/content/scrolls/kits";
import { fillCloze } from "@/lib/cards/grade";
import { diffFills, makeMask } from "@/lib/forge/cloze";
import { emptyProgress, isUnlocked, recordPass, scrollStatus, tracePasses, type ScrollStatus } from "@/lib/forge/progress";
import { FORGE_TIERS, type ClozeMask, type ForgeTier, type Scroll, type ScrollProgress } from "@/lib/forge/types";
import { DEFAULT_EDITOR_SETTINGS } from "@/lib/editor/settings";
import { compileCpp, runWasm } from "@/lib/judge/client";
import { judgeProblem } from "@/lib/judge/judge";
import type { TestCase } from "@/lib/judge/verdict";
import { IdbBackend } from "@/lib/save/idb";
import { SaveService } from "@/lib/save/service";
import { parseStatement } from "@/lib/ui/statement";
import { buildVerdictView, type VerdictView } from "@/lib/ui/verdictView";

const TIER_LABEL: Record<ForgeTier, string> = { trace: "Trace", cloze30: "Cloze 30%", cloze70: "Cloze 70%", blank: "Blank" };
const STATUS_LABEL: Record<ScrollStatus, string> = { new: "New", forging: "Forging", inscribed: "Inscribed", ingrained: "Ingrained" };
const STATUS_CLS: Record<ScrollStatus, string> = {
  new: "border-white/20 bg-black/30",
  forging: "border-amber-400/60 bg-amber-500/15",
  inscribed: "border-emerald-400/60 bg-emerald-500/15",
  ingrained: "border-sky-300/70 bg-sky-400/20",
};

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
/** A stable seed per scroll and tier, so the same blanks come back every visit. */
const maskSeed = (id: string, tier: ForgeTier) => [...`${id}:${tier}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function Code({ code, notes }: { code: string; notes?: Map<number, string> }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono text-[13px] leading-5 [font-variant-ligatures:none]" aria-label="template">
      {lines.map((l, i) => (
        <div key={i}><span className="mr-3 inline-block w-5 select-none text-right opacity-40">{i + 1}</span>{l || " "}{notes?.has(i + 1) ? <span className="ml-2 text-[var(--gold)]" aria-hidden>◀ {i + 1}</span> : null}</div>
      ))}
    </pre>
  );
}

function CommonBugs({ bugs }: { bugs: string[] }) {
  return (
    <aside className="rounded border border-rose-400/50 bg-rose-500/10 p-3 text-sm" data-testid="common-bugs">
      <h4 className="font-display text-xs uppercase tracking-wider">Common bugs</h4>
      <ul className="mt-1 list-disc space-y-1 pl-5">{bugs.map((b) => <li key={b}>{b.replace(/`/g, "")}</li>)}</ul>
    </aside>
  );
}

function TraceTier({ scroll, onPass }: { scroll: Scroll; onPass: () => void }) {
  const cards = useMemo(() => allCards.filter((c) => scroll.traceCardIds.includes(c.id)), [scroll]);
  const notes = useMemo(() => new Map(scroll.annotations.map((a) => [a.line, a.note])), [scroll]);
  const [result, setResult] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">Read the template and its notes, then trace five calls. Get at least 4 right to open the next tier.</p>
      <Code code={scroll.template} notes={notes} />
      <ol className="flex flex-col gap-1 text-sm" aria-label="notes">
        {scroll.annotations.map((a) => (
          <li key={a.line} className="rounded border border-white/10 bg-black/25 px-2 py-1"><strong className="mr-2 text-[var(--gold)]">{a.line}</strong>{a.note}</li>
        ))}
      </ol>
      <CardBattle cards={cards} computed={computed} size={5} seed={3} onFinish={(r) => { setResult(r.correct); if (tracePasses(r.correct)) onPass(); }} />
      {result !== null && (
        <p className={`panel p-3 text-sm ${tracePasses(result) ? "text-emerald-300" : "text-rose-300"}`} role="status" data-testid="trace-result">
          {tracePasses(result) ? `Trace passed (${result}/5). The Cloze tiers are open.` : `${result}/5: read the notes again, then try once more.`}
        </p>
      )}
      <CommonBugs bugs={scroll.commonBugs} />
    </div>
  );
}

/** Judge `code` against every hidden test; the judge, not string equality, decides whether a fill is right. */
function useScrollJudge(scroll: Scroll) {
  const kit = scrollKits[scroll.id];
  const tests = useRef<TestCase[] | null>(null);
  const [view, setView] = useState<VerdictView | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = useCallback(async (code: string): Promise<VerdictView> => {
    setBusy(true);
    setView(null);
    tests.current ??= await kit.loadTests();
    const r = await judgeProblem(kit.spec, code, tests.current, { timeLimitMs: kit.timeLimitMs }, { compile: (s) => compileCpp(s), run: runWasm });
    const v = buildVerdictView(r, tests.current);
    setView(v);
    setBusy(false);
    return v;
  }, [kit]);
  return { view, busy, submit };
}

function ClozeTier({ scroll, tier, onPass }: { scroll: Scroll; tier: "cloze30" | "cloze70"; onPass: () => void }) {
  const mask: ClozeMask = useMemo(() => makeMask(scroll.template, tier === "cloze30" ? 0.3 : 0.7, maskSeed(scroll.id, tier)), [scroll, tier]);
  const [fills, setFills] = useState<string[]>(() => mask.answers.map(() => ""));
  const [wrong, setWrong] = useState<boolean[] | null>(null);
  const { view, busy, submit } = useScrollJudge(scroll);
  const parts = mask.text.replace(/\n$/, "").split("___");
  const ready = fills.every((f) => f.trim());

  async function check() {
    const v = await submit(fillCloze(mask.text, fills.map((f) => f.trim())));
    setWrong(v.verdict === "AC" ? null : diffFills(mask, fills).map((ok) => !ok));
    if (v.verdict === "AC") onPass();
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">Fill the blanks ({mask.answers.length}). The compiler and the hidden tests decide, so any correct fill passes.</p>
      <pre className="whitespace-pre-wrap break-words rounded border border-white/10 bg-black/40 p-3 font-mono text-[13px] leading-8 [font-variant-ligatures:none]" aria-label="template with blanks">
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < parts.length - 1 && (
              <input
                aria-label={`blank ${i + 1}`}
                className={`mx-0.5 h-8 rounded border bg-black/60 px-1 text-center font-mono text-[13px] [font-variant-ligatures:none] ${wrong?.[i] ? "border-rose-400" : "border-[var(--accent)]"}`}
                style={{ width: `${Math.max(3, mask.answers[i].length + 2)}ch`, minWidth: 44 }}
                value={fills[i]}
                autoCapitalize="off" autoCorrect="off" spellCheck={false}
                onChange={(e) => { const n = fills.slice(); n[i] = e.target.value; setFills(n); setWrong(null); }}
              />
            )}
          </span>
        ))}
      </pre>
      <button className="px-btn px-btn-primary min-h-11 self-start px-5" disabled={!ready || busy} onClick={check}>{busy ? "Judging…" : "Check with the judge"}</button>
      <VerdictPanel view={view} />
      {wrong && <p className="text-xs opacity-70">Blanks that differ from the reference are outlined in red (a hint; a different fill can still be right).</p>}
    </div>
  );
}

function BlankTier({ scroll, onPass }: { scroll: Scroll; onPass: (seconds: number) => void }) {
  const kit = scrollKits[scroll.id];
  const statement = useMemo(() => parseStatement(kit.statement), [kit]);
  const [code, setCode] = useState(kit.starter);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [done, setDone] = useState<number | null>(null);
  const { view, busy, submit } = useScrollJudge(scroll);

  useEffect(() => {
    if (startedAt === null || done !== null) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [startedAt, done]);

  const elapsed = done ?? (startedAt === null ? 0 : Math.max(0, (now - startedAt) / 1000));
  async function go() {
    const v = await submit(code);
    if (v.verdict === "AC" && startedAt !== null) {
      const secs = Math.round((Date.now() - startedAt) / 1000);
      setDone(secs);
      onPass(secs);
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">Write the scroll from memory. The clock starts when you press Start; par is {mmss(kit.parSeconds)}. Two passes under par, two days apart, make it Ingrained.</p>
      <StatementPanel statement={statement} />
      {startedAt === null ? (
        <button className="px-btn px-btn-primary min-h-11 self-start px-5" onClick={() => { setStartedAt(Date.now()); setNow(Date.now()); }}>Start the clock</button>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm" aria-live="off">
            <span className="font-mono" data-testid="forge-timer">{mmss(elapsed)} / par {mmss(kit.parSeconds)}</span>
            {done !== null && <strong className={done <= kit.parSeconds ? "text-emerald-300" : "text-amber-300"}>{done <= kit.parSeconds ? "Under par!" : "Inscribed, over par"}</strong>}
          </div>
          <div className="h-56 overflow-hidden rounded border border-white/10"><CodeEditor value={code} onChange={setCode} settings={DEFAULT_EDITOR_SETTINGS} /></div>
          <button className="px-btn px-btn-primary min-h-11 self-start px-5" disabled={busy || done !== null} onClick={go}>{busy ? "Judging…" : "Submit"}</button>
        </>
      )}
      <VerdictPanel view={view} />
    </div>
  );
}

function ScrollView({ scroll, progress, onProgress, onBack }: { scroll: Scroll; progress: ScrollProgress; onProgress: (p: ScrollProgress) => void; onBack: () => void }) {
  const kit = scrollKits[scroll.id];
  const [tier, setTier] = useState<ForgeTier>(() => FORGE_TIERS.find((t) => isUnlocked(progress, t) && !progress.passed.includes(t)) ?? "trace");
  const pass = (t: ForgeTier, seconds?: number) => onProgress(recordPass(progress, t, { seconds, at: Date.now() }));
  const status = scrollStatus(progress, kit.parSeconds);
  return (
    <section className="panel mx-auto flex max-w-3xl flex-col gap-3 p-4" aria-label={scroll.title}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg text-[var(--gold)]">{scroll.title}</h2>
          <p className="text-sm opacity-80">{scroll.blurb}</p>
        </div>
        <span className={`rounded border px-2 py-1 text-xs ${STATUS_CLS[status]}`} data-testid="scroll-status">{STATUS_LABEL[status]}</span>
      </header>
      <nav className="grid grid-cols-4 gap-1" aria-label="Tiers">
        {FORGE_TIERS.map((t) => {
          const open = isUnlocked(progress, t);
          const passed = progress.passed.includes(t);
          return (
            <button key={t} disabled={!open} aria-pressed={tier === t} className={`min-h-11 rounded border px-1 text-xs ${tier === t ? "border-[var(--accent)] bg-[var(--accent)]/20" : "border-white/15 bg-black/30"} disabled:opacity-40`} onClick={() => setTier(t)}>
              {passed ? "✓ " : open ? "" : "🔒 "}{TIER_LABEL[t]}
            </button>
          );
        })}
      </nav>
      {tier === "trace" && <TraceTier key="trace" scroll={scroll} onPass={() => pass("trace")} />}
      {(tier === "cloze30" || tier === "cloze70") && <ClozeTier key={tier} scroll={scroll} tier={tier} onPass={() => pass(tier)} />}
      {tier === "blank" && <BlankTier key="blank" scroll={scroll} onPass={(s) => pass("blank", s)} />}
      {progress.passed.includes(tier) && tier !== "trace" && <CommonBugs bugs={scroll.commonBugs} />}
      <button className="px-btn min-h-11 self-start px-4" onClick={onBack}>All scrolls</button>
      <p className="text-xs opacity-60">Time limit per test {kit.timeLimitMs} ms · judged by a real clang→WASM compiler in your browser.</p>
    </section>
  );
}

/** The Forge (GDD §6.4): scroll list with status, and the four-tier inscription flow for the open scroll. */
export default function ForgeScreen() {
  const [open, setOpen] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, ScrollProgress>>({});
  const [ready, setReady] = useState(false);
  const svc = useRef<SaveService | null>(null);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then((core) => setProgress(core.forge)).catch(() => {}).finally(() => setReady(true));
  }, []);

  const update = (id: string, p: ScrollProgress) => {
    const next = { ...progress, [id]: p };
    setProgress(next);
    const s = svc.current;
    if (s) s.load().then((core) => s.save({ ...core, forge: next })).catch(() => {});
  };

  const scroll = allScrolls.find((s) => s.id === open);
  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex pr-14 max-w-3xl items-baseline justify-between">
        <h1 className="font-display text-2xl text-[var(--gold)]">The Forge</h1>
        <a href="/play/" className="text-sm underline opacity-80">Back to the map</a>
      </header>
      {scroll ? (
        <ScrollView key={scroll.id} scroll={scroll} progress={progress[scroll.id] ?? emptyProgress()} onProgress={(p) => update(scroll.id, p)} onBack={() => setOpen(null)} />
      ) : (
        <ul className="mx-auto flex max-w-3xl flex-col gap-2" aria-label="Scrolls">
          {allScrolls.map((s) => {
            const p = progress[s.id] ?? emptyProgress();
            const st = scrollStatus(p, scrollKits[s.id].parSeconds);
            return (
              <li key={s.id}>
                <button className="panel flex min-h-16 w-full items-center justify-between gap-3 p-3 text-left" disabled={!ready} onClick={() => setOpen(s.id)}>
                  <span>
                    <span className="block font-display text-base text-[var(--gold)]">{s.title}</span>
                    <span className="block text-sm opacity-80">{s.blurb}</span>
                    <span className="mt-1 flex gap-1" aria-hidden>{FORGE_TIERS.map((t) => <span key={t} className={`h-2 w-6 rounded-sm ${p.passed.includes(t) ? "bg-emerald-400" : "bg-white/20"}`} />)}</span>
                  </span>
                  <span className={`shrink-0 rounded border px-2 py-1 text-xs ${STATUS_CLS[st]}`}>{STATUS_LABEL[st]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
