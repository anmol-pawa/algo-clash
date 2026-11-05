"use client";

import { useEffect, useRef, useState } from "react";
import { problemCatalog } from "@/content/gyms/catalog";
import { buy, countOf, grantStarterKit, ITEMS, consume, rematchNow } from "@/lib/items/items";
import { IdbBackend } from "@/lib/save/idb";
import { newCoreSave, type CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";

const REASON = { bits: "Not enough Bits.", cap: "You can't carry any more of those.", unknown: "The Mart doesn't sell that.", qty: "Invalid quantity." } as const;
const titleOf = (id: string) => problemCatalog[id]?.meta.title ?? id;

/** The Mart: spend Bits on items, see the inventory, use a Rematch Ticket (GDD §6.6). */
export default function MartScreen() {
  const [core, setCore] = useState<CoreSave>(() => newCoreSave(0));
  const [msg, setMsg] = useState("");
  const [now, setNow] = useState(0);
  const svc = useRef<SaveService | null>(null);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then(async (c) => {
      const kit = grantStarterKit(c);
      if (kit !== c) await s.save(kit);
      setCore(kit);
      setNow(Date.now());
    }).catch(() => {});
  }, []);

  /** Writes only the fields the Mart owns on top of a fresh load, so other screens' writes survive. */
  const persist = (next: CoreSave) => {
    setCore(next);
    const s = svc.current;
    if (s) s.load().then((c) => s.save({ ...c, profile: { ...c.profile, bits: next.profile.bits }, inventory: next.inventory, mastery: next.mastery, flags: { ...c.flags, ...next.flags } })).catch(() => {});
  };

  const doBuy = (id: string) => {
    const r = buy(core, id);
    if (!r.ok) { setMsg(REASON[r.reason]); return; }
    setMsg("");
    persist(r.core);
  };

  const rematchable = Object.entries(core.mastery).filter(([id, m]) => problemCatalog[id] && m.due > now);
  const doRematch = (id: string) => {
    const used = consume(core, "rematch-ticket");
    const next = used && rematchNow(used, id, now);
    if (!next) { setMsg("You need a Rematch Ticket."); return; }
    setMsg(`${titleOf(id)} is due now. Find it in the Rift or Gym.`);
    persist(next);
  };

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Mart</h1>
        <a href="/play/" className="text-sm underline opacity-80">Back to the map</a>
      </header>
      <section className="panel mx-auto flex max-w-3xl flex-col gap-3 p-4" aria-label="Shop">
        <p className="text-lg" data-testid="bits">Bits: <strong className="text-[var(--gold)]">{core.profile.bits}</strong></p>
        <p className="text-sm opacity-80">Nothing here skips the work: items help you think, and the cost to mastery is always shown.</p>
        <ul className="flex flex-col gap-2" aria-label="Items">
          {ITEMS.map((it) => (
            <li key={it.id} data-testid={`item-${it.id}`} className="flex flex-col gap-2 rounded border border-white/15 bg-black/30 p-3 sm:flex-row sm:items-center sm:justify-between">
              <span>
                <strong>{it.name}</strong> <span className="text-xs opacity-70">(own {countOf(core, it.id)}/{it.cap})</span>
                <span className="block text-sm">{it.blurb}</span>
                <span className="block text-xs opacity-70">Cost: {it.cost}</span>
              </span>
              <button className="px-btn min-h-11 px-4 text-sm" disabled={core.profile.bits < it.price || countOf(core, it.id) >= it.cap} onClick={() => doBuy(it.id)}>
                Buy · {it.price} Bits
              </button>
            </li>
          ))}
        </ul>
        <p role="status" className="min-h-5 text-sm text-[var(--gold)]" data-testid="msg">{msg}</p>
        <h2 className="font-display text-base">Use a Rematch Ticket</h2>
        {rematchable.length === 0 ? (
          <p className="text-sm opacity-60">No scheduled reviews to bring forward yet.</p>
        ) : (
          <ul className="flex flex-col gap-2" aria-label="Rematch">
            {rematchable.map(([id]) => (
              <li key={id} className="flex items-center justify-between gap-2 rounded border border-white/15 bg-black/30 px-3">
                <span className="text-sm">{titleOf(id)}</span>
                <button className="px-btn min-h-11 px-3 text-sm" disabled={countOf(core, "rematch-ticket") < 1} onClick={() => doRematch(id)}>Rematch now</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
