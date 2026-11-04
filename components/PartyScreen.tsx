"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SpriteCanvas } from "@/components/SpriteCanvas";
import { allMoves, moveById } from "@/content/moves";
import { SPECIES, speciesById } from "@/content/structlings";
import { buildArrayling } from "@/game/sprites/arrayling";
import { buildVectorling } from "@/game/sprites/vectorling";
import { currentForm, dexStatus } from "@/lib/party/dex";
import { equipMove, equippedMoves, isLearned, MAX_MOVES, partyOf, unequipMove } from "@/lib/party/loadout";
import { IdbBackend } from "@/lib/save/idb";
import { newCoreSave, type CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";
import { structlingLevel } from "@/lib/srs";

const REASON = { unlearned: "Inscribe this scroll at the Forge first.", full: `A Structling carries at most ${MAX_MOVES} moves. Drop one first.`, "unknown-structling": "That Structling is not in your party." } as const;

/** Party, move loadouts and the Structdex (GDD §5.2). */
export default function PartyScreen() {
  const [core, setCore] = useState<CoreSave>(() => newCoreSave(0));
  const [tab, setTab] = useState<"party" | "dex">("party");
  const [msg, setMsg] = useState("");
  const [now, setNow] = useState(0);
  const [sel, setSel] = useState("arrayling");
  const svc = useRef<SaveService | null>(null);
  const sheets = useMemo(() => ({ arrayling: buildArrayling("front"), vectorling: buildVectorling("front") }), []);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then((c) => { setCore(c); setNow(Date.now()); }).catch(() => {});
  }, []);

  const persist = (next: CoreSave) => {
    setCore(next);
    const s = svc.current;
    if (s) s.load().then((c) => s.save({ ...c, loadouts: next.loadouts })).catch(() => {});
  };

  const party = partyOf(core);
  const sheetFor = (id: string) => sheets[id as keyof typeof sheets] ?? sheets.arrayling;
  const root = party.includes(sel) ? sel : party[0];
  const form = currentForm(core, root, SPECIES);
  const equipped = equippedMoves(core, root);
  const level = structlingLevel(equipped.map((m) => moveById(m)?.problemId ?? m), core.mastery, now);

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Party</h1>
        <a href="/play/" className="text-sm underline opacity-80">Back to the map</a>
      </header>
      <nav className="mx-auto mb-3 grid max-w-3xl grid-cols-2 gap-2" aria-label="Sections">
        {(["party", "dex"] as const).map((t) => (
          <button key={t} aria-pressed={tab === t} className={`min-h-11 rounded border px-2 text-sm ${tab === t ? "border-[var(--accent)] bg-[var(--accent)]/20" : "border-white/15 bg-black/30"}`} onClick={() => setTab(t)}>
            {t === "party" ? "Party & moves" : "Structdex"}
          </button>
        ))}
      </nav>
      {tab === "party" && form && (
        <section className="panel mx-auto flex max-w-3xl flex-col gap-3 p-4" aria-label="Party">
          {party.length > 1 && (
            <div className="flex gap-2">{party.map((id) => <button key={id} className="min-h-11 rounded border border-white/15 px-3 text-sm" aria-pressed={id === root} onClick={() => setSel(id)}>{speciesById(id)?.name ?? id}</button>)}</div>
          )}
          <div className="flex items-center gap-4">
            <SpriteCanvas sheet={sheetFor(form.id)} anim="idle" scale={2} />
            <div>
              <h2 className="font-display text-lg text-[var(--gold)]" data-testid="form-name">{form.name}</h2>
              <p className="text-sm opacity-80">{form.structure} · stage {form.stage}</p>
              <p className="text-sm" data-testid="level">Level {level.toFixed(1)} <span className="opacity-60">(average mastery of equipped moves × 10)</span></p>
            </div>
          </div>
          <h3 className="font-display text-base">Equipped ({equipped.length}/{MAX_MOVES})</h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Equipped moves">
            {Array.from({ length: MAX_MOVES }, (_, i) => {
              const m = moveById(equipped[i] ?? "");
              return (
                <li key={i} className="flex min-h-14 items-center justify-between gap-2 rounded border border-white/15 bg-black/30 px-3">
                  {m ? (<><span><strong>{m.name}</strong><span className="block text-xs opacity-70">{m.blurb}</span></span><button className="px-btn min-h-11 px-3 text-sm" onClick={() => { setMsg(""); persist(unequipMove(core, root, m.id)); }}>Drop</button></>) : <span className="text-sm opacity-50">Empty slot</span>}
                </li>
              );
            })}
          </ul>
          <h3 className="font-display text-base">Moves</h3>
          <ul className="flex flex-col gap-2" aria-label="Moves">
            {allMoves.map((m) => {
              const learned = isLearned(core.forge, m.id);
              const on = equipped.includes(m.id);
              return (
                <li key={m.id} className="flex min-h-14 items-center justify-between gap-2 rounded border border-white/15 bg-black/30 px-3">
                  <span><strong>{m.name}</strong><span className="block text-xs opacity-70">{learned ? m.blurb : "Not inscribed yet. Finish this scroll at the Forge."}</span></span>
                  {learned ? (
                    <button className="px-btn min-h-11 px-3 text-sm" disabled={on} onClick={() => { const r = equipMove(core, root, m.id); if (r.ok) { setMsg(""); persist(r.core); } else setMsg(REASON[r.reason]); }}>{on ? "Equipped" : "Equip"}</button>
                  ) : <a href="/forge/" className="px-btn flex min-h-11 items-center px-3 text-sm">Forge</a>}
                </li>
              );
            })}
          </ul>
          <p className="min-h-5 text-sm text-amber-300" role="status">{msg}</p>
        </section>
      )}
      {tab === "dex" && (
        <ul className="mx-auto flex max-w-3xl flex-col gap-2" aria-label="Structdex">
          {SPECIES.map((s, i) => {
            const seen = dexStatus(core, s, SPECIES) === "seen";
            return (
              <li key={s.id} className="panel flex items-center gap-3 p-3" data-testid={`dex-${s.id}`}>
                <span className="w-16 shrink-0 text-center text-xs opacity-60">No. {String(i + 1).padStart(3, "0")}</span>
                <div className={seen ? "" : "brightness-0"} aria-hidden={!seen}><SpriteCanvas sheet={sheetFor(s.id)} anim="idle" scale={1} /></div>
                <span>
                  <strong className="font-display text-[var(--gold)]">{seen ? s.name : "???"}</strong>
                  <span className="block text-xs opacity-70">{seen ? `${s.structure} · stage ${s.stage}` : "Not met yet."}</span>
                  {seen && <span className="block text-sm">{s.blurb}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
