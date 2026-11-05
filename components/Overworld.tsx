"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadOverworldAssets, type OverworldAssets } from "@/game/overworld/assets";
import { drawWorld, tileAtPixel } from "@/game/overworld/render";
import { TILE } from "@/game/sprites/tiles";
import type { Dir } from "@/lib/overworld/map";
import { MAPS, START_MAP } from "@/lib/overworld/maps";
import { action, createWorld, tick, tapMove, type World } from "@/lib/overworld/world";
import type { Interaction } from "@/lib/overworld/walk";

const KEYS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
};

/** Overworld canvas with keyboard, on-screen d-pad and tap-to-move. Dialogue UI arrives in B2c. */
export function Overworld() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<World | null>(null);
  const held = useRef<Dir[]>([]);
  const [mapName, setMapName] = useState("");
  const [note, setNote] = useState("");
  const noteTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [view, setView] = useState({ w: 11, h: 9 });

  const say = useCallback((text: string) => {
    setNote(text);
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(""), 2200);
  }, []);

  // Wider view on desktop, taller on phones.
  useEffect(() => {
    const pick = () => setView(window.innerWidth >= 700 ? { w: 15, h: 10 } : { w: 11, h: 11 });
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  const doAction = useCallback(() => {
    const w = world.current;
    if (!w) return;
    const r: Interaction = action(w);
    if (r.type === "npc") say(`Talking to ${r.npcId}… (dialogue boxes arrive next)`);
    else if (r.type === "sign") say("A sign. (dialogue boxes arrive next)");
  }, [say]);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const assets: OverworldAssets = loadOverworldAssets();
    const w = world.current ?? createWorld(MAPS, START_MAP);
    world.current = w;
    setMapName(w.map.name);
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const dir = held.current[held.current.length - 1] ?? null;
      for (const e of tick(w, dt, dir, Math.random)) {
        if (e.type === "mapChanged") setMapName(w.map.name);
        if (e.type === "encounter") say("A wild Structling appeared! (battles arrive in a later update)");
      }
      drawWorld(ctx, assets, w, view.w, view.h, now);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    (window as unknown as { __world?: World }).__world = w;
    return () => cancelAnimationFrame(raf);
  }, [view, say]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const d = KEYS[e.key];
      if (d) {
        e.preventDefault();
        if (!held.current.includes(d)) held.current.push(d);
      } else if (e.key === "z" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!e.repeat) doAction();
      }
    };
    const up = (e: KeyboardEvent) => {
      const d = KEYS[e.key];
      if (d) held.current = held.current.filter((x) => x !== d);
    };
    const blur = () => (held.current = []);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [doAction]);

  const onTap = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const w = world.current;
    const cv = canvas.current;
    if (!w || !cv) return;
    const r = cv.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * cv.width;
    const py = ((e.clientY - r.top) / r.height) * cv.height;
    const t = tileAtPixel(w, view.w, view.h, px, py);
    tapMove(w, t.x, t.y);
  };

  const pad = (d: Dir, label: string, cls: string) => (
    <button
      aria-label={label}
      className={`px-btn flex h-14 w-14 touch-none select-none items-center justify-center text-xl ${cls}`}
      onPointerDown={(e) => { e.preventDefault(); held.current = [...held.current.filter((x) => x !== d), d]; }}
      onPointerUp={() => (held.current = held.current.filter((x) => x !== d))}
      onPointerLeave={() => (held.current = held.current.filter((x) => x !== d))}
      onPointerCancel={() => (held.current = [])}
    >
      {label}
    </button>
  );

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3">
      <div className="panel flex w-full items-center justify-between px-3 py-2">
        <span className="font-display whitespace-nowrap text-lg text-[var(--gold)]" data-testid="map-name">{mapName}</span>
        <span className="hidden text-xs text-white/50 sm:inline">Arrows / WASD move · Z or Enter talk · tap to walk</span>
      </div>
      <div className="relative w-full">
        <canvas
          ref={canvas}
          width={view.w * TILE}
          height={view.h * TILE}
          onPointerDown={onTap}
          className="panel w-full touch-none"
          style={{ imageRendering: "pixelated", aspectRatio: `${view.w} / ${view.h}`, maxHeight: "70dvh", objectFit: "contain" }}
          data-testid="overworld-canvas"
        />
        {note && (
          <div role="status" className="panel absolute inset-x-2 bottom-2 px-3 py-2 text-sm">
            {note}
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-between px-2 pb-2">
        <div className="grid grid-cols-3 grid-rows-3 gap-1">
          <span />{pad("up", "▲", "")}<span />
          {pad("left", "◀", "")}<span />{pad("right", "▶", "")}
          <span />{pad("down", "▼", "")}<span />
        </div>
        <button className="px-btn px-btn-primary h-16 w-16 touch-none select-none rounded-full text-lg" onClick={doAction} aria-label="Action">
          A
        </button>
      </div>
    </div>
  );
}
