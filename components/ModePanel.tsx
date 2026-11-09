"use client";

import { MODES, type ModeDef, type ModeId } from "@/lib/modes/modes";

interface Props {
  mode: ModeDef;
  onPick: (id: ModeId) => void;
  /** The mode is fixed once the first Run or Submit happens. */
  locked: boolean;
  runsLeft: number | null;
  /** Contest countdown in seconds, or null. */
  timeLeft: number | null;
  /** Guided: the approach card text. */
  approach?: string;
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Scaffolding-mode picker (GDD §6.5) with the live Run counter and Contest clock. */
export default function ModePanel({ mode, onPick, locked, runsLeft, timeLeft, approach }: Props) {
  return (
    <div className="space-y-1" data-testid="mode-panel">
      <div className="flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Scaffolding mode">
        {MODES.map((m) => (
          <button key={m.id} role="radio" aria-checked={m.id === mode.id} disabled={locked && m.id !== mode.id}
            className={`px-btn min-h-11 px-2 text-xs ${m.id === mode.id ? "px-btn-primary" : ""}`} onClick={() => onPick(m.id)}>
            {m.name}
          </button>
        ))}
        {runsLeft !== null && <span className="ml-auto text-xs" data-testid="runs-left">Runs left: {runsLeft}</span>}
        {timeLeft !== null && <span className="text-xs" data-testid="timer">⏱ {mmss(timeLeft)}</span>}
      </div>
      <p className="text-xs opacity-70">{mode.blurb}{locked ? " (locked for this fight)" : ""}</p>
      {mode.approachCard && approach && <p className="px-btn p-2 text-xs" data-testid="approach-card">Approach: {approach}</p>}
    </div>
  );
}
