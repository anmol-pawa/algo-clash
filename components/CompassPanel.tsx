"use client";

import { useState } from "react";

/** Complexity Compass (GDD §6.6): spend one to see the target complexity; the win gains one tier less. */
export default function CompassPanel({ complexity, used, count, disabled, onUse }: {
  complexity: { time: string; space: string }; used: boolean; count: number; disabled?: boolean; onUse: () => void;
}) {
  const [sure, setSure] = useState(false);
  if (used) {
    return (
      <p className="panel p-2 text-sm" data-testid="compass-reading" aria-label="Complexity Compass reading">
        <b className="text-[var(--gold)]">Compass:</b> aim for time <code>{complexity.time}</code>, space <code>{complexity.space}</code>.
      </p>
    );
  }
  if (count < 1) return null; // nothing in the bag: the Mart sells them, no nagging in the fight
  return (
    <button className="px-btn min-h-11 px-3 text-left text-sm" disabled={disabled} data-testid="compass-btn"
      onBlur={() => setSure(false)} onClick={() => (sure ? onUse() : setSure(true))}>
      {sure ? "Sure? This win gains one mastery tier less. Tap to use" : `Complexity Compass (${count})`}
    </button>
  );
}
