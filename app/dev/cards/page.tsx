"use client";

import CardBattle from "@/components/CardBattle";
import { allCards, computed } from "@/content/cards";

/** Concept-card playground (B5b): a 5-card deck from the Syntax Shores seed set. */
export default function DevCards() {
  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <CardBattle cards={allCards} computed={computed} size={allCards.length} seed={7} />
    </main>
  );
}
