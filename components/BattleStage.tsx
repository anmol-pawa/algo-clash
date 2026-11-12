"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { GYM_PLATFORMS, LH, LW, PLATFORMS, drawAtollBackdrop, drawBackdrop, drawGymBackdrop, drawHarborBackdrop, drawWoodsBackdrop } from "@/game/battle/backdrop";
import { buildWarden } from "@/game/sprites/warden";
import { buildTidecaller } from "@/game/sprites/tidecaller";
import { buildHydra } from "@/game/sprites/hydra";
import { buildPaneWarden } from "@/game/sprites/paneWarden";
import { sheetToCanvases } from "@/game/sprites/canvasFrames";
import { buildArrayling } from "@/game/sprites/arrayling";
import type { SpriteSheet } from "@/game/sprites/grid";
import { toRGBA } from "@/game/sprites/grid";
import { EFFECT_PALETTES, EFFECT_SIZE, effectFrames } from "@/game/battle/effects";
import {
  type Verdict, type EffectKind, EFFECT_FRAME_MS, STINGER_MS, advanceMessage, createFx, evolve, faint, hitFoe, hitPlayer, messageView, say,
  shakeOffset, showVerdict, slideOffset, tick, type StageFx,
} from "@/lib/battle/stagefx";

const SCALE = 3; // backing-store pixels per logical pixel (crisp text, nearest-neighbour sprites)

export interface BattleStageHandle {
  hitFoe(damage: number, crit?: boolean, kind?: EffectKind): void;
  hitPlayer(hearts?: number): void;
  verdict(v: Verdict): void;
  say(text: string): void;
  advance(): void;
  faint(side: "player" | "foe"): void;
  evolve(side: "player" | "foe"): void;
  restart(): void;
}

const STINGERS: Record<Verdict, { text: string; color: string; sub: string }> = {
  AC: { text: "ACCEPTED", color: "#6be28a", sub: "All tests passed" },
  WA: { text: "WRONG ANSWER", color: "#ff7a6b", sub: "Output differs" },
  TLE: { text: "TIME LIMIT", color: "#ffc857", sub: "Too slow" },
  RE: { text: "RUNTIME ERROR", color: "#ff7a6b", sub: "Crashed" },
  CE: { text: "COMPILE ERROR", color: "#c58bff", sub: "Does not build" },
};

/** Recolour the arrayling into a foe by remapping its green ramp to purple. */
function foeSheet(): SpriteSheet {
  const s = buildArrayling("front");
  const map: Record<number, string> = { 2: "#3b2a5a", 3: "#5b3f94", 4: "#7e5ac2", 5: "#a283e3", 6: "#cbb4f5" };
  return { ...s, palette: s.palette.map((c, i) => map[i] ?? c) };
}

/** A fresh stage state; `foeStart` (default full) lets a gym foe begin the fight already bitten by the blitz. */
function freshFx(foeMax: number, foeStart?: number): StageFx {
  const f = createFx(5, foeMax);
  if (foeStart !== undefined) f.hp.foe.shown = f.hp.foe.target = Math.max(1, Math.min(foeMax, foeStart));
  return f;
}

export const BattleStage = forwardRef<BattleStageHandle, { scene?: "meadow" | "gym" | "atoll-gym" | "woods-gym" | "harbor-gym"; foeName?: string; foeLevel?: number; playerName?: string; foeMax?: number; foeStart?: number; font?: string }>(
  function BattleStage({ scene = "meadow", foeName = "Bracketeer", foeLevel = 4, playerName = "Arrayling", foeMax = 100, foeStart, font = "monospace" }, ref) {
    const cv = useRef<HTMLCanvasElement>(null);
    const fx = useRef<StageFx>(freshFx(foeMax, foeStart));
    useImperativeHandle(ref, () => ({
      hitFoe: (d, crit, kind) => hitFoe(fx.current, d, crit, kind),
      say: (t) => say(fx.current, t),
      advance: () => advanceMessage(fx.current),
      faint: (side) => faint(fx.current, side),
      evolve: (side) => evolve(fx.current, side),
      hitPlayer: (h) => hitPlayer(fx.current, h),
      verdict: (v) => showVerdict(fx.current, v),
      restart: () => { fx.current = freshFx(foeMax, foeStart); },
    }), [foeMax, foeStart]);
    const sheets = useMemo(() => ({ player: buildArrayling("back"), foe: scene === "gym" ? buildWarden() : scene === "atoll-gym" ? buildTidecaller() : scene === "woods-gym" ? buildPaneWarden() : scene === "harbor-gym" ? buildHydra() : foeSheet() }), [scene]);
    const isGym = scene !== "meadow";
    const plat = isGym ? GYM_PLATFORMS : PLATFORMS;

    useEffect(() => {
      const canvas = cv.current, ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const frames = { player: sheetToCanvases(sheets.player), foe: sheetToCanvases(sheets.foe) };
      const effects = Object.fromEntries((Object.keys(EFFECT_PALETTES) as EffectKind[]).map((k) => [k,
        effectFrames(k).map((g) => {
          const c = document.createElement("canvas");
          c.width = c.height = EFFECT_SIZE;
          const rgba = toRGBA(g, EFFECT_PALETTES[k]) as unknown as Uint8ClampedArray<ArrayBuffer>;
          c.getContext("2d")!.putImageData(new ImageData(rgba, EFFECT_SIZE, EFFECT_SIZE), 0, 0);
          return c;
        })])) as Record<EffectKind, HTMLCanvasElement[]>;
      let raf = 0, last = performance.now();
      const frameOf = (side: "player" | "foe", f: StageFx) => {
        const p = f.pose[side], sheet = sheets[side];
        // a leader has no evolve/other poses: fall back to idle
        const name = frames[side][p.name] ? p.name : "idle", list = frames[side][name];
        const ms = sheet.frameMs[name] ?? 200;
        const i = name === "idle" ? Math.floor(f.time / ms) % list.length : Math.min(list.length - 1, Math.floor(p.age / ms));
        return { img: list[i], meta: sheet.anims[name][i] };
      };
      const hpBox = (x: number, y: number, name: string, lvl: string, frac: number, hearts: string | null) => {
        const h = hearts === null ? 28 : 38;
        ctx.fillStyle = "#1c2433"; ctx.fillRect(x, y, 104, h);
        ctx.fillStyle = "#f4efdc"; ctx.fillRect(x + 1, y + 1, 102, h - 2);
        ctx.fillStyle = "#1c2433"; ctx.font = `8px ${font}`; ctx.textBaseline = "top";
        ctx.fillText(name, x + 5, y + 4); ctx.fillText(lvl, x + 78, y + 4);
        ctx.fillStyle = "#1c2433"; ctx.fillRect(x + 5, y + 16, 94, 7);
        ctx.fillStyle = "#3a4256"; ctx.fillRect(x + 6, y + 17, 92, 5);
        ctx.fillStyle = frac > 0.5 ? "#4fd16b" : frac > 0.2 ? "#f2c744" : "#e5534b";
        ctx.fillRect(x + 6, y + 17, Math.round(92 * Math.max(0, Math.min(1, frac))), 5);
        if (hearts !== null) { ctx.fillStyle = "#e5534b"; ctx.fillText(hearts, x + 5, y + 26); }
      };
      const loop = (now: number) => {
        const dt = Math.max(0, Math.min(64, now - last)); last = now;
        const f = fx.current;
        tick(f, dt);
        ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        ctx.imageSmoothingEnabled = false;
        const sh = shakeOffset(f);
        ctx.save();
        ctx.translate(sh.x, sh.y);
        if (scene === "gym") drawGymBackdrop(ctx, f.time); else if (scene === "atoll-gym") drawAtollBackdrop(ctx, f.time, true); else if (scene === "woods-gym") drawWoodsBackdrop(ctx, f.time, true); else if (scene === "harbor-gym") drawHarborBackdrop(ctx, f.time, true); else drawBackdrop(ctx, f.time);
        // foe slides in from the right, player from the left
        const foe = frameOf("foe", f), pl = frameOf("player", f);
        const fxOff = Math.round(slideOffset(f.intro, 0) * 140), plOff = Math.round(slideOffset(f.intro, 0.15) * -140);
        const lunge = (side: "player" | "foe") => {
          const p = f.pose[side];
          if (p.name !== "attack") return 0;
          const t = Math.min(1, p.age / 360);
          return Math.round(Math.sin(t * Math.PI) * 14) * (side === "player" ? 1 : -1);
        };
        const draw = (s: { img: HTMLCanvasElement; meta: { ox: number; oy: number; alpha: number } }, x: number, y: number) => {
          ctx.globalAlpha = s.meta.alpha;
          ctx.drawImage(s.img, Math.round(x + s.meta.ox), Math.round(y + s.meta.oy));
          ctx.globalAlpha = 1;
        };
        // soft contact shadows
        ctx.fillStyle = "rgba(20,50,30,.28)";
        const foeW = sheets.foe.w, foeH = sheets.foe.h;
        ctx.fillRect(plat.foe.cx - foeW / 3 + fxOff, plat.foe.cy - 1, Math.round(foeW * 0.66), 3);
        ctx.fillRect(plat.player.cx - 26 + plOff, plat.player.cy - 1, 52, 3);
        // leaders stand slightly into the ledge (feet 6px below its centre line), wild creatures on it
        const footDrop = isGym ? 6 : 0;
        draw(foe, plat.foe.cx - foeW / 2 + fxOff + lunge("foe"), plat.foe.cy + footDrop - foeH);
        draw(pl, plat.player.cx - 32 + plOff + lunge("player"), plat.player.cy - 58);
        // sprite move effects over the target
        for (const e of f.effects) {
          const anchor = e.side === "foe" ? plat.foe : plat.player;
          const list = effects[e.kind], i = Math.min(list.length - 1, Math.floor(e.age / EFFECT_FRAME_MS));
          const sc = e.kind === "burst" ? 2 : 1.5;
          const sz = EFFECT_SIZE * sc;
          ctx.drawImage(list[i], Math.round(anchor.cx - sz / 2), Math.round(anchor.cy - 34 - sz / 2), sz, sz);
        }
        // damage numbers
        ctx.font = `10px ${font}`; ctx.textAlign = "center";
        for (const n of f.numbers) {
          const anchor = n.side === "foe" ? plat.foe : plat.player;
          const y = anchor.cy - (n.side === "foe" ? sheets.foe.h : 64) + 4 - n.age / 30;
          ctx.globalAlpha = Math.max(0, 1 - n.age / 900);
          ctx.fillStyle = "#1c2433"; ctx.fillText(n.text, anchor.cx + 1, y + 1);
          ctx.fillStyle = n.crit ? "#ffd84a" : n.side === "foe" ? "#ffffff" : "#ff7a6b";
          ctx.fillText(n.text, anchor.cx, y);
        }
        ctx.globalAlpha = 1; ctx.textAlign = "left";
        ctx.restore();
        // HP boxes (not shaken, so they stay readable)
        const slideHud = slideOffset(f.intro, 0.4);
        hpBox(6 - Math.round(slideHud * 120), 6, foeName, `Lv${foeLevel}`, f.hp.foe.shown / f.hp.foe.max, null);
        const hearts = "♥".repeat(Math.max(0, Math.ceil(f.hp.player.target))), pFrac = f.hp.player.shown / f.hp.player.max;
        // gym: the 96px leader fills the right side, so the player's box sits under the foe's on the left
        if (isGym) hpBox(6 - Math.round(slideHud * 120), 38, playerName, "Lv5", pFrac, hearts);
        else hpBox(LW - 110 + Math.round(slideHud * 120), 70, playerName, "Lv5", pFrac, hearts);
        // verdict stinger
        if (f.stinger) {
          const st = STINGERS[f.stinger.verdict], a = f.stinger.age;
          const pop = Math.min(1, a / 160), fade = Math.min(1, (STINGER_MS - a) / 300);
          ctx.globalAlpha = Math.max(0, Math.min(1, fade));
          ctx.fillStyle = "rgba(16,22,34,.82)"; ctx.fillRect(0, LH / 2 - 18, LW, 36);
          ctx.fillStyle = st.color; ctx.fillRect(0, LH / 2 - 18, LW, 1); ctx.fillRect(0, LH / 2 + 17, LW, 1);
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.font = `${Math.round(10 + 8 * pop)}px ${font}`;
          ctx.fillText(st.text, LW / 2, LH / 2 - 4);
          ctx.fillStyle = "#e9edf5"; ctx.font = `8px ${font}`;
          ctx.fillText(st.sub, LW / 2, LH / 2 + 10);
          ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.globalAlpha = 1;
        }
        // typewriter text box along the bottom
        const msg = messageView(f);
        if (msg) {
          const bx = 4, by = LH - 27, bw = LW - 8, bh = 24;
          ctx.fillStyle = "#1c2433"; ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = "#f4efdc"; ctx.fillRect(bx + 2, by + 2, bw - 4, bh - 4);
          ctx.fillStyle = "#1c2433"; ctx.font = `8px ${font}`; ctx.textBaseline = "top";
          const words = msg.text.split(" "); let row = "", y = by + 4;
          for (const w of words) {
            const t = row ? `${row} ${w}` : w;
            if (ctx.measureText(t).width > bw - 16 && row) { ctx.fillText(row, bx + 7, y); y += 9; row = w; } else row = t;
          }
          ctx.fillText(row, bx + 7, y);
          if (msg.done && Math.floor(f.time / 350) % 2 === 0) { ctx.fillStyle = "#e5534b"; ctx.fillRect(bx + bw - 12, by + bh - 9, 5, 3); }
        }
        // battle wipe: black bars open from the middle
        if (f.wipe < 1) {
          const open = f.wipe * f.wipe * (3 - 2 * f.wipe), half = (LH / 2) * (1 - open);
          ctx.fillStyle = "#0b0f1a";
          ctx.fillRect(0, 0, LW, Math.ceil(half)); ctx.fillRect(0, LH - Math.ceil(half), LW, Math.ceil(half));
          ctx.fillStyle = "#e9edf5"; ctx.fillRect(0, Math.ceil(half), LW, 1); ctx.fillRect(0, LH - Math.ceil(half) - 1, LW, 1);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }, [sheets, plat, scene, foeName, foeLevel, playerName, font]);

    return (
      <canvas ref={cv} width={LW * SCALE} height={LH * SCALE} aria-label="Battle stage"
        style={{ imageRendering: "pixelated", width: "100%", height: "auto", display: "block", aspectRatio: `${LW} / ${LH}` }} />
    );
  },
);
