"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BattleArena, { type ArenaProblem, type ArenaResult } from "@/components/BattleArena";
import CardBattle from "@/components/CardBattle";
import { useMusic } from "@/components/Music";
import { allCards, computed } from "@/content/cards";
import { gymKits } from "@/content/gyms/kits";
import { riftCatalog, riftMetas } from "@/content/rift";
import { claimRift, clearedRooms, dayKey, markRoomCleared, planRift, playableRooms, recordProblemAttempt, riftComplete, visibleStreak, type RiftPlan, type RiftReward, type RoomKind } from "@/lib/rift";
import { IdbBackend } from "@/lib/save/idb";
import type { CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";

const ROOM_INFO: Record<RoomKind, { name: string; blurb: string }> = {
  reviews: { name: "Echo Hall", blurb: "Problems that are due for review." },
  blitz: { name: "Blitz Corridor", blurb: "Five quick recognition cards." },
  fresh: { name: "Frontier Gate", blurb: "One new problem at your frontier." },
  debug: { name: "Team Undefined Den", blurb: "Read the compiler's complaint and find the bug." },
  bonus: { name: "Bonus Vault", blurb: "Optional hard problem for extra Bits." },
};

type Run = { room: number; item: number; startedAt: number } | null;

/** The Daily Rift (GDD §6.3): today's five rooms, played through the existing card and battle screens. */
export default function RiftScreen() {
  useMusic("battle");
  const svc = useRef<SaveService | null>(null);
  const [core, setCore] = useState<CoreSave | null>(null);
  const [run, setRun] = useState<Run>(null);
  const [reward, setReward] = useState<RiftReward | null>(null);
  const [problem, setProblem] = useState<ArenaProblem | null>(null);
  const [note, setNote] = useState("");
  // The plan is frozen at load, so playing never reshuffles the remaining rooms.
  const [active, setActive] = useState<RiftPlan | null>(null);
  const [cardsDone, setCardsDone] = useState(false);
  const [now] = useState(() => Date.now());
  const day = dayKey(now);

  useEffect(() => {
    svc.current = new SaveService(new IdbBackend());
    svc.current.load().then((c) => { setCore(c); setActive(planRift(day, c.mastery, riftCatalog, now)); }).catch(() => setNote("Could not read your save."));
  }, [day, now]);

  const commit = useCallback(async (next: CoreSave) => {
    setCore(next);
    try { await (svc.current ?? new SaveService(new IdbBackend())).save(next); } catch { setNote("Progress could not be saved."); }
  }, []);

  const finishRoom = useCallback((c: CoreSave, p: RiftPlan, room: number) => {
    const cleared = markRoomCleared(c, p.day, room);
    const paid = claimRift(cleared, p);
    if (paid.reward) setReward(paid.reward);
    setRun(null);
    setProblem(null);
    void commit(paid.core);
  }, [commit]);

  // Load the tests of the problem being played.
  const runItem = active && run ? active.rooms[run.room].items[run.item] : undefined;
  useEffect(() => {
    if (!runItem || runItem.type !== "problem") return;
    let alive = true;
    const kit = gymKits[runItem.id];
    kit.loadTests().then((tests) => alive && setProblem({ id: runItem.id, title: kit.title, difficulty: kit.difficulty, statement: kit.statement, starter: kit.starter, spec: kit.spec, timeLimitMs: kit.timeLimitMs, tests, foeName: kit.foeName, foeLevel: kit.foeLevel })).catch(() => alive && setNote("Could not load the battle."));
    return () => { alive = false; };
  }, [runItem]);

  const shell = "mx-auto flex w-full max-w-3xl flex-col gap-3 p-3";
  if (!core || !active) return <main className={shell}><p role="status">Opening the Rift…</p></main>;

  const cleared = clearedRooms(core, day);

  function onProblem(r: ArenaResult) {
    if (!run || !active || !core) return;
    const id = active.rooms[run.room].items[run.item].id;
    const meta = riftMetas[id];
    const won = r === "won";
    const seconds = Math.round((Date.now() - run.startedAt) / 1000);
    const updated = recordProblemAttempt(core, id, { at: Date.now(), solved: won, assisted: false, seconds, parSeconds: meta.parSeconds });
    if (!won) { setRun(null); setProblem(null); void commit(updated); setNote("The rift pushes you back. Try the room again."); return; }
    const last = run.item + 1 >= active.rooms[run.room].items.length;
    if (last) finishRoom(updated, active, run.room);
    else { setCore(updated); setProblem(null); setRun({ room: run.room, item: run.item + 1, startedAt: Date.now() }); }
  }

  if (run && runItem?.type === "problem") {
    return problem && problem.id === runItem.id
      ? <BattleArena key={`${run.room}-${run.item}`} problem={problem} onResult={onProblem} />
      : <main className={shell}><p role="status">Loading the battle…</p></main>;
  }
  if (run && active.rooms[run.room].items[0]?.type === "card") {
    const ids = new Set(active.rooms[run.room].items.map((i) => i.id));
    const cards = allCards.filter((c) => ids.has(c.id));
    return (
      <main className={shell}>
        <header className="flex items-center justify-between pr-14">
          <h1 className="font-display text-xl text-[var(--gold)]">{ROOM_INFO[active.rooms[run.room].kind].name}</h1>
          <button className="px-btn min-h-11 px-3 text-sm" onClick={() => { setCardsDone(false); setRun(null); }}>Leave room</button>
        </header>
        <CardBattle cards={cards} computed={computed} size={cards.length} seed={active.seed + run.room} onFinish={() => setCardsDone(true)} />
        {cardsDone && <button className="px-btn px-btn-primary min-h-11" data-testid="room-done" onClick={() => { setCardsDone(false); finishRoom(core, active, run.room); }}>Clear the room ▶</button>}
      </main>
    );
  }

  const playable = playableRooms(active);
  const done = riftComplete(active, cleared);
  const streak = visibleStreak({ streakDays: core.profile.streakDays, lastPlayedDay: core.profile.lastPlayedDay }, day);

  return (
    <main className={shell}>
      <header className="flex items-center justify-between gap-2 pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Daily Rift</h1>
        <Link href="/" className="px-btn flex min-h-11 items-center px-3 text-sm">Leave</Link>
      </header>
      <p className="text-sm text-white/70" data-testid="rift-streak">{day} · streak {streak} day{streak === 1 ? "" : "s"} · {core.profile.bits} Bits</p>
      {reward && <p className="panel p-3 text-emerald-300" role="status" data-testid="rift-reward">Rift cleared! +{reward.bits} Bits, +{reward.xp} XP.</p>}
      {!reward && done && <p className="panel p-3 text-emerald-300" data-testid="rift-done">Today&apos;s Rift is cleared. Come back tomorrow.</p>}
      {note && <p className="text-sm text-amber-300" role="status">{note}</p>}
      <ol className="flex flex-col gap-2" data-testid="rift-rooms">
        {active.rooms.map((r, i) => {
          const info = ROOM_INFO[r.kind];
          const empty = r.items.length === 0;
          const isCleared = cleared.includes(i);
          return (
            <li key={r.kind} className="panel flex items-center justify-between gap-3 p-3">
              <div>
                <p className="font-display">{i + 1}. {info.name}{r.optional ? " (optional)" : ""}</p>
                <p className="text-xs text-white/70">{empty ? "Nothing here today." : `${info.blurb} ${r.items.length} item${r.items.length === 1 ? "" : "s"}.`}</p>
              </div>
              {empty ? <span className="text-xs text-white/50">skipped</span>
                : isCleared ? <span className="text-emerald-300" aria-label="cleared">✔ cleared</span>
                : <button className="px-btn px-btn-primary min-h-11 px-3 text-sm" data-testid={`room-${i}`} onClick={() => { setNote(""); setRun({ room: i, item: 0, startedAt: Date.now() }); }}>Enter ▶</button>}
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-white/50">{playable.length} rooms today. Rooms with no problems yet are skipped and never cost your streak.</p>
    </main>
  );
}
