"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { audio } from "@/lib/audio/engine";
import { DEFAULT_AUDIO_PREFS, loadPrefs, savePrefs, type AudioPrefs } from "@/lib/audio/prefs";

type Volume = "master" | "music" | "sfx";
const SLIDERS: [Volume, string][] = [["master", "Master"], ["music", "Music"], ["sfx", "Effects"]];

/** The preferences live in a tiny external store so SSR renders the defaults and the client then reads localStorage. */
let current: AudioPrefs | null = null;
const listeners = new Set<() => void>();
function snapshot(): AudioPrefs {
  if (!current) {
    current = loadPrefs(window.localStorage);
    audio.setPrefs(current);
  }
  return current;
}
function setStored(next: AudioPrefs): void {
  current = next;
  audio.setPrefs(next);
  savePrefs(window.localStorage, next);
  listeners.forEach((l) => l());
}
function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

/**
 * Global audio controls: a speaker button (always reachable, 44 px) with a small panel of volume sliders.
 * Also unlocks WebAudio on the first user gesture and plays the menu blip for every `.px-btn` press.
 */
export function AudioDock() {
  const prefs = useSyncExternalStore(subscribe, snapshot, () => DEFAULT_AUDIO_PREFS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unlock = () => audio.unlock();
    const click = (e: Event) => {
      const el = e.target instanceof Element ? e.target.closest(".px-btn, [data-sfx='menu']") : null;
      if (el && !(el as HTMLButtonElement).disabled) audio.playSfx("menu");
    };
    document.addEventListener("pointerdown", unlock, { passive: true });
    document.addEventListener("keydown", unlock);
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("click", click);
    };
  }, []);

  const update = setStored;

  return (
    <div className="pointer-events-none fixed right-2 top-[max(0.5rem,env(safe-area-inset-top))] z-50 flex flex-col items-end gap-2">
      <button
        type="button"
        className="px-btn pointer-events-auto flex min-h-11 min-w-11 items-center justify-center text-lg"
        aria-label={prefs.muted ? "Sound off. Open sound settings" : "Sound on. Open sound settings"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden>{prefs.muted ? "🔇" : "🔊"}</span>
      </button>
      {open && (
        <div role="group" aria-label="Sound settings" style={{ background: "#0e1430" }} className="panel pointer-events-auto w-60 max-w-[calc(100vw-1rem)] space-y-3 p-3 text-sm">
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span>Sound</span>
            <input type="checkbox" className="h-6 w-6 accent-[var(--accent)]" checked={!prefs.muted} onChange={(e) => update({ ...prefs, muted: !e.target.checked })} />
          </label>
          {SLIDERS.map(([key, label]) => (
            <label key={key} className="block">
              <span className="flex justify-between text-xs text-white/70">
                {label}
                <span>{Math.round(prefs[key] * 100)}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(prefs[key] * 100)}
                disabled={prefs.muted}
                className="h-11 w-full accent-[var(--accent)]"
                onChange={(e) => update({ ...prefs, [key]: Number(e.target.value) / 100 })}
                onPointerUp={() => audio.playSfx(key === "music" ? "menu" : "hit")}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
