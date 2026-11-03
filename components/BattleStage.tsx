"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { LH, LW, PLATFORMS, drawBackdrop } from "@/game/battle/backdrop";
import { sheetToCanvases } from "@/game/sprites/canvasFrames";
import { buildArrayling } from "@/game/sprites/arrayling";
import type { SpriteSheet } from "@/game/sprites/grid";
import {
  type Verdict, STINGER_MS, createFx, hitFoe, hitPlayer, shakeOffset, showVerdict, slideOffset, tick, type StageFx,
} from "@/lib/battle/stagefx";

const SCALE = 3; // backing-store pixels per logical pixel (crisp text, nearest-neighbour sprites)

export interface BattleStageHandle {
  hitFoe(damage: number, crit?: boolean): void;
  hitPlayer(hearts?: number): void;
  verdict(v: Verdict): void;
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

export const BattleStage = forwardRef<BattleStageHandle, { foeName?: string; foeLevel?: number; playerName?: string; foeMax?: number; font?: string }>(
  function BattleStage({ foeName = "Bracketeer", foeLevel = 4, playerName = "Arrayling", foeMax = 100, font = "monospace" }, ref) {
    const cv = useRef<HTMLCanvasElement>(null);
    const fx = useRef<StageFx>(createFx(5, foeMax));
    useImperativeHandle(ref, () => ({
      hitFoe: (d, crit) => hitFoe(fx.current, d, crit),
      hitPlayer: (h) => hitPlayer(fx.current, h),
      verdict: (v) => showVerdict(fx.current, v),
      restart: () => { fx.current = createFx(5, foeMax); },
    }), [foeMax]);
    const sheets = useMemo(() => ({ player: buildArrayling("back"), foe: foeSheet() }), []);

    useEffect(() => {
      const canvas = cv.current, ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const frames = { player: sheetToCanvases(sheets.player), foe: sheetToCanvases(sheets.foe) };
      let raf = 0, last = performance.now();
      const frameOf = (side: "player" | "foe", f: StageFx) => {
        const p = f.pose[side], sheet = sheets[side], list = frames[side][p.name];
        const ms = sheet.frameMs[p.name] ?? 200;
        const i = p.name === "idle" ? Math.floor(f.time / ms) % list.length : Math.min(list.length - 1, Math.floor(p.age / ms));
        return { img: list[i], meta: sheet.anims[p.name][i] };
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
        drawBackdrop(ctx, f.time);
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
        ctx.fillRect(PLATFORMS.foe.cx - 22 + fxOff, PLATFORMS.foe.cy - 1, 44, 3);
        ctx.fillRect(PLATFORMS.player.cx - 26 + plOff, PLATFORMS.player.cy - 1, 52, 3);
        draw(foe, PLATFORMS.foe.cx - 32 + fxOff + lunge("foe"), PLATFORMS.foe.cy - 58);
        draw(pl, PLATFORMS.player.cx - 32 + plOff + lunge("player"), PLATFORMS.player.cy - 58);
        // damage numbers
        ctx.font = `10px ${font}`; ctx.textAlign = "center";
        for (const n of f.numbers) {
          const anchor = n.side === "foe" ? PLATFORMS.foe : PLATFORMS.player;
          const y = anchor.cy - 60 - n.age / 30;
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
        hpBox(LW - 110 + Math.round(slideHud * 120), LH - 44, playerName, "Lv5",
          f.hp.player.shown / f.hp.player.max, "♥".repeat(Math.max(0, Math.ceil(f.hp.player.target))));
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
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }, [sheets, foeName, foeLevel, playerName, font]);

    return (
      <canvas ref={cv} width={LW * SCALE} height={LH * SCALE} aria-label="Battle stage"
        style={{ imageRendering: "pixelated", width: "100%", height: "auto", display: "block", aspectRatio: `${LW} / ${LH}` }} />
    );
  },
);
