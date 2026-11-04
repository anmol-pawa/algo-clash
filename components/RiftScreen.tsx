"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CardBattle from "@/components/CardBattle";
import { allCards, computed } from "@/content/cards";
import { allProblemMetas, problemMetaById } from "@/content/problems";
import { allScrolls } from "@/content/scrolls";
import { buildPool } from "@/lib/rift/pool";
import { dayKey } from "@/lib/rift/day";
import { buildRift } from "@/lib/rift/plan";
import { BLITZ_PASS, clearRoom, currentStreak, effectiveMask, isRiftComplete, ROOM_BITS, type RiftReward } from "@/lib/rift/progress";
import type { RiftItem } from "@/lib/rift/types";
import { IdbBackend } from "@/lib/save/idb";
import { newCoreSave, type CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";

const POOL = buildPool(allProblemMetas, allScrolls, allCards);

function itemLabel(it: RiftItem): string {
  if (it.kind === "problem") {
    const m = problemMetaById(it.id);
    return m ? `${m.title} (${m.difficulty})` : it.id;
  }
  if (it.kind === "scroll") return `Scroll: ${allScrolls.find((s) => s.id === it.id)?.title ?? it.id}`;
  if (it.kind === "card") return allCards.find((c) => c.id === it.id)?.prompt ?? it.id;
  return it.id;
}

/** The Daily Rift (`/rift`, GDD §6.3): five seeded rooms, a streak that only ever resets, and Bits for clearing them. */
export default function RiftScreen() {
  const [core, setCore] = useState<CoreSave | null>(null);
  const [now] = useState(() => Date.now());
  const [open, setOpen] = useState<number | null>(null);
  const [gain, setGain] = useState<(RiftReward & { done: boolean }) | null>(null);
  const [blitzMiss, setBlitzMiss] = useState<number | null>(null);
  const svc = useRef<SaveService | null>(null);

  const day = useMemo(() => dayKey(now, -new Date(now).getTimezoneOffset()), [now]);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then(setCore).catch(() => setCore(newCoreSave(Date.now())));
  }, []);

  const plan = useMemo(() => (core ? buildRift(day, now, core.mastery, POOL) : null), [core, day, now]);

  const finishRoom = useCallback((index: number) => {
    const s = svc.current;
    if (!s || !plan) return;
    s.load().then((fresh) => {
      const r = clearRoom(fresh, plan, index);
      setCore(r.core);
      setGain({ ...r.reward, done: r.completed });
      return r.core === fresh ? undefined : s.save(r.core);
    }).catch(() => {});
  }, [plan]);

  const room = plan && open !== null ? plan.rooms[open] : null;
  const mask = core && plan ? effectiveMask(core, plan) : 0;
  const streak = core ? currentStreak(core.profile, day) : 0;
  const complete = core && plan ? isRiftComplete(core, plan) : false;

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">The Daily Rift</h1>
        <a href="/play/" className="text-sm underline opacity-80">Back to the map</a>
      </header>
      {!core || !plan ? (
        <p className="mx-auto max-w-3xl text-sm opacity-70">Opening the Rift…</p>
      ) : room && open !== null ? (
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <button className="px-btn min-h-11 w-full px-4 text-left text-sm" onClick={() => setOpen(null)}>← The Rift</button>
          <h2 className="font-display text-xl text-[var(--gold)]">{room.title}</h2>
          {room.id === "blitz" ? (
            <CardBattle
              cards={allCards.filter((c) => room.items.some((i) => i.id === c.id))}
              computed={computed}
              size={room.items.length}
              seed={plan.seed}
              onFinish={(r) => { if (r.correct >= BLITZ_PASS) { setBlitzMiss(null); finishRoom(open); } else setBlitzMiss(r.correct); }}
            />
          ) : (
            <div className="panel flex flex-col gap-2 p-4 text-sm">
              <p>{room.blurb}</p>
              <ul className="list-disc pl-5" aria-label="Items in this room">
                {room.items.map((it) => <li key={it.id}>{itemLabel(it)}</li>)}
              </ul>
              <p className="opacity-70">Problem battles inside the Rift open once the in-game problem catalogue lands; for now this room only previews its draw.</p>
            </div>
          )}
          {blitzMiss !== null && (
            <p className="panel p-3 text-sm text-rose-300" role="status" data-testid="rift-blitz-miss">
              {blitzMiss} of {room.items.length} right. Get {BLITZ_PASS} to open the next room: tap Again to retry.
            </p>
          )}
          {gain && gain.bits > 0 && (
            <p className="panel p-3 text-sm text-emerald-300" role="status" data-testid="rift-reward">
              +{gain.bits} Bits · +{gain.xp} XP{gain.done ? " · The Rift is clear! Your streak grew." : ""}
            </p>
          )}
        </div>
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <div className="panel flex flex-wrap items-center justify-between gap-2 p-3 text-sm" data-testid="rift-status">
            <span>Streak <strong className="text-[var(--gold)]">{streak}</strong> {streak === 1 ? "day" : "days"}</span>
            <span>{core.profile.bits} Bits</span>
            <span className={complete ? "text-emerald-300" : "opacity-70"}>{complete ? "Rift clear for today" : `${plan.day}: clear the four main rooms`}</span>
          </div>
          <ol className="flex flex-col gap-2" aria-label="Rift rooms">
            {plan.rooms.map((r) => {
              const cleared = !r.empty && (mask & (1 << r.index)) !== 0;
              const playable = !r.empty;
              return (
                <li key={r.id}>
                  <button
                    className="panel flex min-h-16 w-full items-center justify-between gap-3 p-3 text-left"
                    disabled={!playable}
                    onClick={() => { setGain(null); setBlitzMiss(null); setOpen(r.index); }}
                  >
                    <span>
                      <span className="block font-display text-[10px] uppercase tracking-wider opacity-60">Room {r.index + 1}{r.optional ? " · optional" : ""}</span>
                      <span className="block font-display text-base text-[var(--gold)]">{r.title}</span>
                      <span className="block text-sm opacity-80">{r.empty ? "Quiet today: nothing to do here yet." : r.blurb}</span>
                    </span>
                    <span className={`shrink-0 rounded border px-2 py-1 font-display text-[10px] uppercase ${cleared ? "border-emerald-400/60 bg-emerald-500/15" : playable ? "border-amber-400/60 bg-amber-500/15" : "border-white/20 bg-black/30"}`}>
                      {cleared ? "Clear" : playable ? `+${ROOM_BITS[r.index]} Bits` : "Quiet"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </main>
  );
}
