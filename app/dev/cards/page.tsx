"use client";

import CardBattle from "@/components/CardBattle";
import { computed } from "@/content/cards";
import { syntaxCards } from "@/content/cards/R0/syntax";

/** Concept-card playground (B5b): a 5-card deck from the Syntax Shores seed set. */
export default function DevCards() {
  return (
    <main className="min-h-dvh p-3 sm:p-6">
      <CardBattle cards={syntaxCards} computed={computed} size={syntaxCards.length} seed={7} />
    </main>
  );
}
