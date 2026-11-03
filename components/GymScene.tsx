"use client";

import { useEffect, useRef } from "react";
import { LH, LW, GYM_PLATFORMS, drawGymBackdrop } from "@/game/battle/backdrop";
import type { SpriteSheet } from "@/game/sprites/grid";
import { toRGBA } from "@/game/sprites/grid";

/** The gym backdrop with a leader sprite standing on the foe platform (review + reuse by the gym UI). */
export function GymScene({ sheet, anim = "idle", scale = 3 }: { sheet: SpriteSheet; anim?: string; scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const frames = sheet.anims[anim];
    const imgs = frames.map((f) => {
      const c = document.createElement("canvas");
      c.width = sheet.w; c.height = sheet.h;
      c.getContext("2d")!.putImageData(new ImageData(toRGBA(f.grid, sheet.palette) as unknown as Uint8ClampedArray<ArrayBuffer>, sheet.w, sheet.h), 0, 0);
      return c;
    });
    ctx.imageSmoothingEnabled = false;
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = Math.max(0, now - t0);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.imageSmoothingEnabled = false;
      drawGymBackdrop(ctx, t);
      const i = Math.floor(t / (sheet.frameMs[anim] ?? 200)) % frames.length;
      const f = frames[i];
      ctx.globalAlpha = f.alpha;
      const p = GYM_PLATFORMS.foe;
      ctx.drawImage(imgs[i], Math.round(p.cx - sheet.w / 2 + f.ox), Math.round(p.cy + 6 - sheet.h + f.oy));
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [sheet, anim, scale]);
  return <canvas ref={ref} width={LW * scale} height={LH * scale}
    style={{ imageRendering: "pixelated", maxWidth: "100%", height: "auto" }} />;
}
