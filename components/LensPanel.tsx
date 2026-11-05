"use client";

import { useState } from "react";

/**
 * Debug Lens (GDD §6.6): after a failed run, spend one to see the input of the failing test.
 * The win then counts as assisted. Needs a failing test to point at; hidden when none is held and unused.
 */
export default function LensPanel({ input, used, count, disabled, onUse }: {
  input?: string; used: boolean; count: number; disabled?: boolean; onUse: () => void;
}) {
  const [sure, setSure] = useState(false);
  if (used) {
    return (
      <p className="panel p-2 text-sm" data-testid="lens-reading" aria-label="Debug Lens reading">
        <b className="text-[var(--gold)]">Lens:</b>{" "}
        {input === undefined ? "Run your code; the Lens will show the first failing input." : <code className="whitespace-pre-wrap break-words">{input.replace(/\n/g, " ⏎ ")}</code>}
      </p>
    );
  }
  if (count < 1) return null; // nothing in the bag: the Mart sells them, no nagging in the fight
  return (
    <button className="px-btn min-h-11 px-3 text-left text-sm" disabled={disabled} data-testid="lens-btn"
      onBlur={() => setSure(false)} onClick={() => (sure ? onUse() : setSure(true))}>
      {sure ? "Sure? This win will count as assisted (no mastery advance). Tap to use" : `Debug Lens (${count})`}
    </button>
  );
}
