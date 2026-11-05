"use client";

import { MODES, modeDef, type ModeId } from "@/lib/modes/modes";

/** Scaffolding-mode selector (GDD §6.5). Locked once the first Run/Submit has happened. */
export default function ModePicker({ mode, locked, onPick }: { mode: ModeId; locked: boolean; onPick: (m: ModeId) => void }) {
  const def = modeDef(mode);
  return (
    <div className="px-win p-2" data-testid="mode-picker">
      <div role="radiogroup" aria-label="Mode" className="flex gap-1">
        {MODES.map((m) => (
          <button key={m.id} role="radio" aria-checked={m.id === mode} disabled={locked && m.id !== mode} onClick={() => onPick(m.id)}
            className={`px-btn min-h-11 flex-1 px-1 text-xs ${m.id === mode ? "px-btn-primary" : ""}`}>{m.label}</button>
        ))}
      </div>
      <p className="mt-1 text-xs opacity-80">{def.blurb}{locked ? " (locked for this fight)" : ""}</p>
    </div>
  );
}
