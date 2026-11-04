"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SpriteCanvas } from "@/components/SpriteCanvas";
import { MOVES, SPECIES } from "@/content/party";
import { problemCatalog } from "@/content/gyms/catalog";
import { scrollById } from "@/content/scrolls";
import { buildArrayling } from "@/game/sprites/arrayling";
import { buildVectorling } from "@/game/sprites/vectorling";
import { speciesStage } from "@/lib/evolution/progress";
import { autoLoadout, dexState, effectiveParty, equipMove, getLoadout, moveMastery, moveStatus, partyLevel, unequipMove } from "@/lib/party/moves";
import { MAX_LOADOUT, MAX_PARTY, type MoveStatus } from "@/lib/party/types";
import { IdbBackend } from "@/lib/save/idb";
import { newCoreSave, type CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";

const parOf = (scrollId: string): number => {
  const sc = scrollById(scrollId);
  return (sc && problemCatalog[sc.problemId]?.meta.parSeconds) || 300;
};

const items = Object.values(problemCatalog).map(({ meta: m }) => ({ id: m.id, difficulty: m.difficulty, patterns: m.patterns }));
const byId = new Map(SPECIES.map((s) => [s.id, s]));

const STATUS_TEXT: Record<MoveStatus, string> = {
  known: "Known",
  "needs-lesson": "Read the lesson first",
  "needs-scroll": "Inscribe the scroll at the Forge",
  sealed: "Sealed: its scroll is not written yet",
};

/** The Party screen (GDD §5.2): your Structlings, their four-move loadouts, the move book and the Structdex. */
export default function PartyScreen() {
  const [core, setCore] = useState<CoreSave | null>(null);
  const [tab, setTab] = useState<"party" | "dex">("party");
  const svc = useRef<SaveService | null>(null);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load()
      .then((c) => {
        // First visit: each Structling starts with the moves it already knows.
        const knownNow = MOVES.filter((m) => moveStatus(c, m, parOf) === "known");
        const next = effectiveParty(c).reduce((acc, id) => autoLoadout(acc, id, knownNow), c);
        setCore(next);
        if (next !== c) s.save(next).catch(() => {});
      })
      .catch(() => setCore(newCoreSave(Date.now())));
  }, []);

  const [now] = useState(() => Date.now());
  const sheets = useMemo(() => ({ arrayling: buildArrayling("front"), vectorling: buildVectorling("front") }), []);

  if (!core) return <main className="min-h-dvh p-3"><p className="text-sm opacity-80">Loading your party…</p></main>;

  const statuses = new Map(MOVES.map((m) => [m.id, moveStatus(core, m, parOf)]));
  const known = new Set(MOVES.filter((m) => statuses.get(m.id) === "known").map((m) => m.id));
  const party = effectiveParty(core);
  const change = (next: CoreSave) => {
    if (next === core) return;
    setCore(next);
    svc.current?.save(next).catch(() => {});
  };

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Party</h1>
        <Link href="/play/" className="text-sm underline opacity-80">Back to the map</Link>
      </header>
      <div className="mx-auto mb-3 flex max-w-3xl gap-2" role="tablist">
        {(["party", "dex"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={`px-btn min-h-11 flex-1 text-sm ${tab === t ? "px-btn-primary" : ""}`} onClick={() => setTab(t)}>
            {t === "party" ? `PARTY ${party.length}/${MAX_PARTY}` : "STRUCTDEX"}
          </button>
        ))}
      </div>

      {tab === "party" ? (
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {party.map((id) => {
            const sp = byId.get(id);
            if (!sp) return null;
            const form = speciesStage(core, id) >= 2 ? byId.get("vectorling")! : sp;
            const loadout = getLoadout(core, id, known);
            const level = partyLevel(loadout.map((mid) => moveMastery(MOVES.find((m) => m.id === mid)!, items, core, now)));
            return (
              <section key={id} className="panel p-3" aria-label={form.name}>
                <div className="flex items-center gap-3">
                  <div className="w-24 shrink-0">
                    <SpriteCanvas sheet={form.id === "vectorling" ? sheets.vectorling : sheets.arrayling} anim="idle" scale={2} />
                  </div>
                  <div>
                    <h2 className="font-display text-lg text-[var(--gold)]">{form.name}</h2>
                    <p className="text-sm opacity-80">Embodies: {form.embodies}</p>
                    <p className="text-sm" data-testid="level">Level {level.toFixed(1)} <span className="opacity-60">(moves’ average mastery × 10)</span></p>
                  </div>
                </div>
                <h3 className="mt-3 font-display text-xs uppercase tracking-wider opacity-70">Loadout {loadout.length}/{MAX_LOADOUT}</h3>
                <ul className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Equipped moves">
                  {Array.from({ length: MAX_LOADOUT }, (_, i) => {
                    const mv = MOVES.find((m) => m.id === loadout[i]);
                    return (
                      <li key={i}>
                        {mv ? (
                          <button className="panel flex min-h-11 w-full items-center justify-between gap-2 p-2 text-left" onClick={() => change(unequipMove(core, id, mv.id, known))} aria-label={`Unequip ${mv.name}`}>
                            <span className="font-display text-sm">{mv.name}</span><span className="text-xs opacity-70">Remove</span>
                          </button>
                        ) : (
                          <div className="flex min-h-11 items-center rounded border border-dashed border-white/20 p-2 text-sm opacity-50">Empty slot</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <h3 className="mt-3 font-display text-xs uppercase tracking-wider opacity-70">Move book</h3>
                <ul className="mt-1 flex flex-col gap-2" aria-label="Move book">
                  {MOVES.map((mv) => {
                    const st = statuses.get(mv.id)!;
                    const equipped = loadout.includes(mv.id);
                    const full = loadout.length >= MAX_LOADOUT;
                    return (
                      <li key={mv.id} className={`panel flex items-center justify-between gap-3 p-2 ${st === "known" ? "" : "opacity-60"}`}>
                        <span>
                          <span className="block font-display text-sm text-[var(--gold)]">{mv.name}</span>
                          <span className="block text-sm opacity-80">{mv.blurb}</span>
                          <span className="block text-xs opacity-70">{STATUS_TEXT[st]}</span>
                        </span>
                        {st === "known" ? (
                          <button className="px-btn min-h-11 min-w-20 px-3 text-sm" disabled={!equipped && full} onClick={() => change(equipped ? unequipMove(core, id, mv.id, known) : equipMove(core, id, mv.id, known))}>
                            {equipped ? "Unequip" : full ? "Full" : "Equip"}
                          </button>
                        ) : st === "needs-lesson" ? (
                          <Link href="/learn/" className="px-btn flex min-h-11 min-w-20 items-center justify-center px-3 text-sm">Learn</Link>
                        ) : st === "needs-scroll" ? (
                          <Link href="/forge/" className="px-btn flex min-h-11 min-w-20 items-center justify-center px-3 text-sm">Forge</Link>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Structdex">
          {SPECIES.map((sp, i) => {
            const st = dexState(core, sp, byId);
            return (
              <li key={sp.id} className={`panel flex items-center gap-3 p-2 ${st === "unknown" ? "opacity-60" : ""}`} data-state={st}>
                <span className="font-display text-xs opacity-60">#{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-sm text-[var(--gold)]">{st === "owned" ? sp.name : st === "seen" ? `${sp.name} (not yet evolved)` : "???"}</span>
                  <span className="block text-xs opacity-70">{st === "unknown" ? `Lives near region ${sp.region}` : `Embodies ${sp.embodies}`}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
