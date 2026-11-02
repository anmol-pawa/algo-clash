"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MAINVILLE } from "@/lib/overworld/mainville";
import { ROUTE_1 } from "@/lib/overworld/route1";
import { Dir, GameMap, parseMap } from "@/lib/overworld/map";
import { newWorld, playerDrawPos, press, tapTo, tickWorld, WorldState } from "@/lib/overworld/mover";
import { MAINVILLE_DIALOGUES } from "@/lib/dialogue/mainville";
import { DialogueState, advance, awaitingChoice, choose, currentNode, startDialogue } from "@/lib/dialogue/script";
import { IOTA, TRAINER, VILLAGER, buildCharacter } from "@/game/sprites/character";
import { buildTileset, TILE } from "@/game/sprites/tiles";
import { sheetToCanvases } from "@/game/sprites/canvasFrames";

const VIEW_W = 11;
const VIEW_H = 9;
const KEYS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right",
};

/** The overworld scene: smooth tile-to-tile walking, camera, NPCs, warps. Renders with 2D canvas. */
export function WorldCanvas() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const maps = useMemo<Record<string, GameMap>>(() => ({ mainville: parseMap(MAINVILLE), "route-1": parseMap(ROUTE_1) }), []);
  const world = useRef<WorldState>(newWorld(maps.mainville));
  const keys = useRef<Dir[]>([]);
  const [mapName, setMapName] = useState(maps.mainville.name);
  const [talk, setTalk] = useState<DialogueState | null>(null);
  const talkRef = useRef<DialogueState | null>(null);
  useEffect(() => {
    talkRef.current = talk;
    world.current.held = talk ? null : keys.current[keys.current.length - 1] ?? null;
  }, [talk]);
  const [note, setNote] = useState("");

  const syncHeld = useCallback(() => {
    world.current.held = talkRef.current ? null : keys.current[keys.current.length - 1] ?? null;
  }, []);
  const hold = useCallback((d: Dir, on: boolean) => {
    keys.current = keys.current.filter((k) => k !== d);
    if (on) keys.current.push(d);
    syncHeld();
  }, [syncHeld]);

  const action = useCallback(() => {
    if (talkRef.current) {
      const next = advance(talkRef.current);
      setTalk(next.done ? null : next);
      return;
    }
    const r = press(world.current);
    if ((r.type === "npc" || r.type === "sign") && MAINVILLE_DIALOGUES[r.dialogue]) {
      keys.current = [];
      syncHeld();
      setTalk(startDialogue(MAINVILLE_DIALOGUES[r.dialogue]));
    }
  }, [syncHeld]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const d = KEYS[e.key];
      if (d) { e.preventDefault(); hold(d, true); }
      else if (e.key === "z" || e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!e.repeat) action(); }
    };
    const up = (e: KeyboardEvent) => { const d = KEYS[e.key]; if (d) hold(d, false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [hold, action]);

  useEffect(() => {
    const cv = cvRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    ctx.imageSmoothingEnabled = false;
    const tiles = sheetToCanvases(buildTileset());
    const tileMs = 350;
    const people: Record<string, Record<string, HTMLCanvasElement[]>> = {
      trainer: sheetToCanvases(buildCharacter(TRAINER)),
      iota: sheetToCanvases(buildCharacter(IOTA)),
      villager: sheetToCanvases(buildCharacter(VILLAGER)),
    };
    let raf = 0;
    let last = performance.now();
    let clock = 0;
    const draw = () => {
      const w = world.current;
      const m = w.map;
      const pos = playerDrawPos(w);
      const camX = m.width <= VIEW_W ? (m.width - VIEW_W) / 2 : Math.min(Math.max(pos.x + 0.5 - VIEW_W / 2, 0), m.width - VIEW_W);
      const camY = m.height <= VIEW_H ? (m.height - VIEW_H) / 2 : Math.min(Math.max(pos.y + 0.5 - VIEW_H / 2, 0), m.height - VIEW_H);
      const ox = Math.round(-camX * TILE), oy = Math.round(-camY * TILE);
      ctx.fillStyle = "#14101c";
      ctx.fillRect(0, 0, cv.width, cv.height);
      for (let y = 0; y < m.height; y++)
        for (let x = 0; x < m.width; x++) {
          const fr = tiles[m.tiles[y][x]];
          ctx.drawImage(fr[Math.floor(clock / tileMs) % fr.length], ox + x * TILE, oy + y * TILE);
        }
      const sprites: Array<{ y: number; draw: () => void }> = [];
      for (const n of m.npcs) {
        const sheet = people[n.sprite] ?? people.villager;
        sprites.push({ y: n.y, draw: () => ctx.drawImage(sheet[`idle-${n.facing}`][0], ox + n.x * TILE, oy + n.y * TILE - 8) });
      }
      const walking = w.moving !== null;
      const pf = people.trainer[`${walking ? "walk" : "idle"}-${w.player.facing}`];
      const frame = walking ? pf[(w.steps * 2 + (w.moving!.t > 0.5 ? 1 : 0)) % pf.length] : pf[0];
      sprites.push({ y: pos.y, draw: () => ctx.drawImage(frame, Math.round(ox + pos.x * TILE), Math.round(oy + pos.y * TILE - 8)) });
      sprites.sort((a, b) => a.y - b.y).forEach((s) => s.draw());
    };
    const loop = (now: number) => {
      const dt = Math.max(0, Math.min(now - last, 100));
      last = now;
      clock += dt;
      const events = tickWorld(world.current, dt, Math.random, maps);
      for (const e of events) {
        if (e.type === "map") setMapName(world.current.map.name);
        if (e.type === "encounter") setNote("A wild Structling rustles in the grass… (battles arrive in B3)");
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [maps]);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(""), 2500);
    return () => clearTimeout(t);
  }, [note]);

  const onTap = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (talk) { action(); return; }
    const cv = e.currentTarget;
    const r = cv.getBoundingClientRect();
    const w = world.current;
    const pos = playerDrawPos(w);
    const m = w.map;
    const camX = m.width <= VIEW_W ? (m.width - VIEW_W) / 2 : Math.min(Math.max(pos.x + 0.5 - VIEW_W / 2, 0), m.width - VIEW_W);
    const camY = m.height <= VIEW_H ? (m.height - VIEW_H) / 2 : Math.min(Math.max(pos.y + 0.5 - VIEW_H / 2, 0), m.height - VIEW_H);
    const tx = Math.floor(camX + ((e.clientX - r.left) / r.width) * VIEW_W);
    const ty = Math.floor(camY + ((e.clientY - r.top) / r.height) * VIEW_H);
    tapTo(w, tx, ty);
  };

  const node = talk ? currentNode(talk) : null;
  const pad = (d: Dir, label: string, cls: string) => (
    <button
      aria-label={d}
      className={`px-btn absolute flex h-14 w-14 touch-none select-none items-center justify-center text-xl ${cls}`}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); hold(d, true); }}
      onPointerUp={() => hold(d, false)}
      onPointerCancel={() => hold(d, false)}
    >
      {label}
    </button>
  );
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
      <div className="panel flex items-center justify-between px-3 py-2 text-sm">
        <span className="whitespace-nowrap font-display text-[var(--gold)]">{mapName}</span>
        <span className="hidden text-white/50 sm:inline">Arrows/WASD move · Z or Enter talk · tap to walk</span>
      </div>
      <div className="relative">
        <canvas
          ref={cvRef}
          width={VIEW_W * TILE}
          height={VIEW_H * TILE}
          onPointerDown={onTap}
          className="block w-full touch-none rounded border-4 border-[#2a2540]"
          style={{ imageRendering: "pixelated", aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        />
        {node && talk && (
          <div role="dialog" onPointerDown={action} className="panel absolute inset-x-2 bottom-2 min-h-20 cursor-pointer px-3 py-2 text-sm">
            <p className="font-display text-[var(--gold)]">{node.speaker}</p>
            <p>{node.pages[talk.page]}</p>
            {awaitingChoice(talk) ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {node.choices!.map((c, i) => (
                  <button key={c.text} className="px-btn px-3 text-sm"
                    onPointerDown={(e) => { e.stopPropagation(); const n = choose(talk, i); setTalk(n.done ? null : n); }}>
                    {c.text}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-right text-xs text-white/40">tap ▶</p>
            )}
          </div>
        )}
        {note && <div className="panel absolute inset-x-2 top-2 px-3 py-2 text-center text-sm">{note}</div>}
      </div>
      <div className="relative mx-auto h-44 w-full max-w-sm select-none">
        {pad("up", "▲", "left-[5.5rem] top-0")}
        {pad("left", "◀", "left-[1.5rem] top-14")}
        {pad("right", "▶", "left-[9.5rem] top-14")}
        {pad("down", "▼", "left-[5.5rem] top-28")}
        <button className="px-btn px-btn-primary absolute right-4 top-14 flex h-16 w-16 items-center justify-center rounded-full text-lg" onClick={action}>A</button>
      </div>
    </div>
  );
}
