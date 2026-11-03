"use client";

import { useMemo, useState } from "react";
import { cardXp, parsonsShuffle, pickDeck } from "@/lib/cards/deck";
import { gradeCard } from "@/lib/cards/grade";
import type { Card, ComputedMap, Grade, Response } from "@/lib/cards/types";
import { makeRng } from "@/lib/content/rng";

function Code({ code, numbered }: { code: string; numbered?: boolean }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono [font-variant-ligatures:none] text-[13px] leading-5" aria-label="code">
      {lines.map((l, i) => (
        <div key={i}>{numbered && <span className="mr-3 inline-block w-5 select-none text-right opacity-40">{i + 1}</span>}{l || " "}</div>
      ))}
    </pre>
  );
}

const choiceCls = (picked: boolean, state: "idle" | "right" | "wrong") =>
  `min-h-11 w-full rounded border px-3 py-2 text-left text-sm ${
    state === "right" ? "border-emerald-400 bg-emerald-500/20"
    : state === "wrong" ? "border-rose-400 bg-rose-500/20"
    : picked ? "border-[var(--accent)] bg-[var(--accent)]/15" : "border-white/15 bg-black/25"
  }`;

interface BodyProps { card: Card; computed: ComputedMap; seed: number; locked: boolean; grade: Grade | null; onChange: (r: Response | null) => void; onSubmit: () => void }

function Body({ card, computed, seed, locked, grade, onChange, onSubmit }: BodyProps) {
  const [choice, setChoice] = useState<number | null>(null);
  const [multi, setMulti] = useState<number[]>([]);
  const [text, setText] = useState("");
  const [blanks, setBlanks] = useState<string[]>(() => (card.kind === "cloze" ? card.blanks.map(() => "") : []));
  const pool = useMemo(() => (card.kind === "parsons" ? parsonsShuffle(card, makeRng(seed)) : []), [card, seed]);
  const [placed, setPlaced] = useState<number[]>([]); // indices into pool, in the order placed

  if (card.kind === "mcq" || card.kind === "compilerError") {
    const pick = (i: number) => { if (!locked) { setChoice(i); onChange({ kind: card.kind, choice: i }); } };
    return (
      <>
        {card.kind === "compilerError" && (
          <>
            <Code code={card.code} numbered />
            <div className="rounded border border-rose-400/40 bg-rose-500/10 p-2 font-mono text-xs" data-testid="diagnostic">
              <span className="opacity-60">g++ says: </span>{computed[card.id]?.diagnostic}
            </div>
          </>
        )}
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="choices">
          {card.choices.map((c, i) => (
            <button key={i} role="radio" aria-checked={choice === i} className={choiceCls(choice === i, locked ? (i === card.answer ? "right" : choice === i ? "wrong" : "idle") : "idle")} onClick={() => pick(i)}>{c}</button>
          ))}
        </div>
      </>
    );
  }
  if (card.kind === "multi") {
    const toggle = (i: number) => {
      if (locked) return;
      const next = multi.includes(i) ? multi.filter((x) => x !== i) : [...multi, i];
      setMulti(next);
      onChange(next.length ? { kind: "multi", choices: next } : null);
    };
    return (
      <div className="flex flex-col gap-2" role="group" aria-label="choices">
        <p className="text-xs opacity-60">Select all that apply.</p>
        {card.choices.map((c, i) => (
          <button key={i} role="checkbox" aria-checked={multi.includes(i)} className={choiceCls(multi.includes(i), locked ? (grade?.parts[i] ? "right" : "wrong") : "idle")} onClick={() => toggle(i)}>
            <span className="mr-2 font-mono">{multi.includes(i) ? "[x]" : "[ ]"}</span>{c}
          </button>
        ))}
      </div>
    );
  }
  if (card.kind === "predict" || card.kind === "trace") {
    return (
      <>
        <Code code={card.code} />
        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-70">Program output (one line per output line)</span>
          <textarea
            className="min-h-24 rounded border border-white/15 bg-black/40 p-2 font-mono text-sm"
            value={text}
            disabled={locked}
            rows={card.kind === "trace" ? 1 : 3}
            onChange={(e) => { setText(e.target.value); onChange(e.target.value.trim() ? { kind: card.kind, text: e.target.value } : null); }}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSubmit(); }}
          />
        </label>
        {locked && grade && !grade.correct && <div className="rounded border border-emerald-400/50 bg-emerald-500/10 p-2 font-mono text-xs" data-testid="expected">Real output: {computed[card.id]?.output?.trimEnd().replace(/\n/g, " ⏎ ")}</div>}
      </>
    );
  }
  if (card.kind === "parsons") {
    const place = (pi: number) => { if (locked || placed.includes(pi)) return; const n = [...placed, pi]; setPlaced(n); onChange(n.length === pool.length ? { kind: "parsons", lines: n.map((i) => pool[i]) } : null); };
    const unplace = (slot: number) => { if (locked) return; const n = placed.filter((_, i) => i !== slot); setPlaced(n); onChange(null); };
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <h4 className="mb-1 font-display text-xs uppercase tracking-wider opacity-70">Lines</h4>
          <div className="flex flex-col gap-1">
            {pool.map((l, pi) => (
              <button key={pi} disabled={placed.includes(pi) || locked} className="min-h-11 rounded border border-white/15 bg-black/30 px-2 text-left font-mono text-xs disabled:opacity-25" onClick={() => place(pi)}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-1 font-display text-xs uppercase tracking-wider opacity-70">Your program (tap a line to remove it)</h4>
          <div className="flex flex-col gap-1" data-testid="parsons-answer">
            {placed.map((pi, slot) => {
              const state = locked && grade ? (grade.parts[slot] ? "right" : "wrong") : "idle";
              return <button key={slot} className={`${choiceCls(false, state)} font-mono text-xs`} onClick={() => unplace(slot)}>{pool[pi]}</button>;
            })}
            {placed.length === 0 && <p className="rounded border border-dashed border-white/20 p-3 text-xs opacity-60">Tap lines on the left in the order they should run.</p>}
          </div>
        </div>
      </div>
    );
  }
  // cloze
  const parts = card.template.replace(/\n$/, "").split("___");
  const setBlank = (i: number, v: string) => { const n = blanks.slice(); n[i] = v; setBlanks(n); onChange(n.every((b) => b.trim()) ? { kind: "cloze", blanks: n } : null); };
  return (
    <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono [font-variant-ligatures:none] text-[12px] leading-6" aria-label="code with blanks">
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && (
            <input
              aria-label={`blank ${i + 1}`}
              className={`mx-0.5 h-7 w-10 rounded border bg-black/60 px-1 text-center font-mono [font-variant-ligatures:none] text-[13px] ${locked && grade ? (grade.parts[i] ? "border-emerald-400" : "border-rose-400") : "border-[var(--accent)]"}`}
              value={blanks[i]}
              disabled={locked}
              autoCapitalize="off" autoCorrect="off" spellCheck={false}
              onChange={(e) => setBlank(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
            />
          )}
        </span>
      ))}
    </pre>
  );
}

export interface CardRunResult { total: number; correct: number; xp: number; bestStreak: number }

/** Wild-encounter concept cards (GDD §5): a short deck, instant feedback, explanation after every answer. */
export default function CardBattle({ cards, computed, size = 5, seed = 1, onFinish }: { cards: Card[]; computed: ComputedMap; size?: number; seed?: number; onFinish?: (r: CardRunResult) => void }) {
  const deck = useMemo(() => pickDeck(cards, size, makeRng(seed)), [cards, size, seed]);
  const [idx, setIdx] = useState(0);
  const [response, setResponse] = useState<Response | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [stats, setStats] = useState<CardRunResult>({ total: 0, correct: 0, xp: 0, bestStreak: 0 });
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const card = deck[idx];

  const submit = () => {
    if (!response || grade) return;
    const g = gradeCard(card, response, computed);
    const nextStreak = g.correct ? streak + 1 : 0;
    setGrade(g);
    setStreak(nextStreak);
    setStats((s) => ({ total: s.total + 1, correct: s.correct + (g.correct ? 1 : 0), xp: s.xp + cardXp(g.correct, true, streak), bestStreak: Math.max(s.bestStreak, nextStreak) }));
  };
  const next = () => {
    if (idx + 1 >= deck.length) { setDone(true); onFinish?.(stats); return; }
    setIdx(idx + 1); setResponse(null); setGrade(null);
  };

  if (done) {
    return (
      <section className="panel mx-auto flex max-w-xl flex-col gap-3 p-4" aria-label="Card results" data-testid="card-results">
        <h2 className="font-display text-xl text-[var(--gold)]">{stats.correct === stats.total ? "Flawless!" : "Encounter cleared"}</h2>
        <p className="text-sm">{stats.correct} / {stats.total} correct · best streak {stats.bestStreak} · <strong className="text-[var(--gold)]">+{stats.xp} XP</strong></p>
        <button className="px-btn px-btn-primary min-h-11 px-4" onClick={() => { setIdx(0); setResponse(null); setGrade(null); setStats({ total: 0, correct: 0, xp: 0, bestStreak: 0 }); setStreak(0); setDone(false); }}>Again</button>
      </section>
    );
  }
  return (
    <section className="panel mx-auto flex max-w-2xl flex-col gap-3 p-4" aria-label="Concept card">
      <header className="flex items-center justify-between text-xs">
        <span className="font-display uppercase tracking-wider opacity-70">Card {idx + 1} / {deck.length}</span>
        <span>Streak {streak} · {stats.xp} XP</span>
      </header>
      <h2 className="font-display text-lg text-[var(--gold)]">{card.prompt}</h2>
      <Body key={card.id + idx} card={card} computed={computed} seed={seed * 131 + idx} locked={!!grade} grade={grade} onChange={setResponse} onSubmit={submit} />
      {grade ? (
        <div className={`rounded border p-3 text-sm ${grade.correct ? "border-emerald-400/60 bg-emerald-500/10" : "border-rose-400/60 bg-rose-500/10"}`} role="status" data-testid="feedback">
          <strong>{grade.correct ? "Correct!" : "Not quite."}</strong> {card.explanation}
        </div>
      ) : null}
      <div className="flex justify-end gap-2">
        {grade ? <button className="px-btn px-btn-primary min-h-11 px-5" onClick={next}>{idx + 1 >= deck.length ? "Finish" : "Next"}</button>
          : <button className="px-btn px-btn-primary min-h-11 px-5" disabled={!response} onClick={submit}>Check</button>}
      </div>
    </section>
  );
}
