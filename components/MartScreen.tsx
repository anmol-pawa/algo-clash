"use client";

import { useEffect, useRef, useState } from "react";
import { buy, countOf, ITEMS, type ItemDef } from "@/lib/items/items";
import { IdbBackend } from "@/lib/save/idb";
import { newCoreSave, type CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";

const REFUSED = {
  bits: "Not enough Bits. Solve problems or clear Daily Rift rooms to earn more.",
  cap: "You are carrying the most you can of that item.",
  qty: "Pick a whole number of items.",
  unknown: "The Mart does not stock that.",
} as const;

/** The Mart (GDD §6.6): spend Bits on aids. Nothing here advances mastery or skips content. */
export default function MartScreen() {
  const [core, setCore] = useState<CoreSave>(() => newCoreSave(0));
  const [msg, setMsg] = useState("");
  const svc = useRef<SaveService | null>(null);

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then(setCore).catch(() => {});
  }, []);

  const purchase = async (item: ItemDef) => {
    const s = svc.current;
    if (!s) return;
    // Read-modify-write on a fresh load so a battle's changes elsewhere are never overwritten.
    const fresh = await s.load();
    const r = buy(fresh, item.id);
    if (!r.ok) {
      setCore(fresh);
      setMsg(REFUSED[r.reason]);
      return;
    }
    await s.save(r.core);
    setCore(r.core);
    setMsg(`Bought 1 ${item.name} for ${r.spent} Bits.`);
  };

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Mart</h1>
        <a href="/play/" className="text-sm underline opacity-80">Back to the map</a>
      </header>
      <section className="panel mx-auto flex max-w-3xl flex-col gap-3 p-4" aria-label="Mart">
        <p className="text-sm" data-testid="mart-bits">
          Bits: <strong className="text-[var(--gold)]">{core.profile.bits}</strong>
        </p>
        <p className="text-xs opacity-70">Aids make a fight easier, never the learning free: each one states what it costs your mastery.</p>
        <ul className="flex flex-col gap-2" aria-label="Items">
          {ITEMS.map((item) => {
            const have = countOf(core, item.id);
            const full = have >= item.cap;
            const poor = core.profile.bits < item.price;
            return (
              <li key={item.id} data-testid={`item-${item.id}`} className="flex flex-col gap-2 rounded border border-white/15 bg-black/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="min-w-0">
                  <strong>{item.name}</strong>
                  <span className="ml-2 text-xs opacity-70" data-testid={`have-${item.id}`}>
                    you have {have}/{item.cap}
                  </span>
                  <span className="block text-sm opacity-90">{item.blurb}</span>
                  <span className="block text-xs text-[var(--gold)]/80">Cost to mastery: {item.cost}</span>
                </span>
                <button
                  className="px-btn min-h-11 shrink-0 px-4 text-sm disabled:opacity-40"
                  disabled={full || poor}
                  aria-label={`Buy ${item.name} for ${item.price} Bits`}
                  onClick={() => void purchase(item)}
                >
                  {full ? "FULL" : `BUY · ${item.price}`}
                </button>
              </li>
            );
          })}
        </ul>
        <p role="status" className="min-h-5 text-sm" data-testid="mart-msg">{msg}</p>
      </section>
    </main>
  );
}
