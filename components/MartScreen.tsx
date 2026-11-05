"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buy, countOf, grantStarterKit, ITEMS, type BuyResult } from "@/lib/items/items";
import { IdbBackend } from "@/lib/save/idb";
import type { CoreSave } from "@/lib/save/schema";
import { SaveService } from "@/lib/save/service";

const REASONS: Record<Extract<BuyResult, { ok: false }>["reason"], string> = {
  unknown: "That item is not for sale.",
  bits: "Not enough Bits yet. Clear a Rift room or win a battle.",
  cap: "You are carrying the most you can.",
  qty: "Pick a whole number of items.",
};

/** The Mart (GDD §6.6): spend Bits on hints and tools. Nothing here advances mastery or skips content. */
export default function MartScreen() {
  const svc = useRef<SaveService | null>(null);
  const [core, setCore] = useState<CoreSave | null>(null);
  const [note, setNote] = useState("Welcome! Everything here helps you think, never solves for you.");

  useEffect(() => {
    const s = new SaveService(new IdbBackend());
    svc.current = s;
    s.load().then(async (c) => {
      const kit = grantStarterKit(c);
      if (kit !== c) await s.save(kit); // persist the one-time kit so every screen agrees on it
      setCore(kit);
    }).catch(() => setNote("Could not open your save."));
  }, []);

  const purchase = async (id: string, name: string) => {
    const s = svc.current;
    if (!s || !core) return;
    try {
      // Re-read so a stale in-memory copy never overwrites tokens spent in a battle.
      const res = buy(grantStarterKit(await s.load()), id);
      if (!res.ok) return setNote(REASONS[res.reason]);
      await s.save(res.core);
      setCore(res.core);
      setNote(`Bought 1 ${name} for ${res.spent} Bits. Thank you!`);
    } catch {
      setNote("The purchase did not go through. Nothing was spent.");
    }
  };

  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <header className="mx-auto mb-3 flex max-w-3xl items-baseline justify-between pr-14">
        <h1 className="font-display text-2xl text-[var(--gold)]">Mart</h1>
        <Link href="/play/" className="text-sm underline opacity-80">Back to the map</Link>
      </header>
      <section className="panel mx-auto flex max-w-3xl flex-col gap-3 p-4" aria-label="Mart">
        <p className="flex items-baseline justify-between text-sm">
          <span>Your Bits</span>
          <strong className="text-[var(--gold)]" data-testid="mart-bits">{core ? core.profile.bits : "…"}</strong>
        </p>
        <p role="status" className="rounded border border-white/10 bg-black/30 p-2 text-sm" data-testid="mart-note">{note}</p>
        <ul className="flex flex-col gap-2" aria-label="Items" data-testid="mart-list">
          {ITEMS.map((it) => {
            const have = core ? countOf(core, it.id) : 0;
            const full = have >= it.cap;
            const poor = !!core && core.profile.bits < it.price;
            return (
              <li key={it.id} className="flex flex-col gap-2 rounded border border-white/15 bg-black/30 p-3" data-testid={`mart-item-${it.id}`}>
                <div className="flex items-baseline justify-between gap-2">
                  <strong>{it.name}</strong>
                  <span className="text-xs opacity-80">Owned {have}/{it.cap}</span>
                </div>
                <p className="text-sm">{it.blurb}</p>
                <p className="text-xs opacity-75">Cost to mastery: {it.cost}</p>
                <button
                  className="px-btn min-h-11 text-sm disabled:opacity-50"
                  disabled={!core || full || poor}
                  aria-label={`Buy ${it.name} for ${it.price} Bits`}
                  onClick={() => purchase(it.id, it.name)}
                >
                  {full ? "FULL" : poor ? `${it.price} Bits (too few)` : `BUY · ${it.price} Bits`}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
