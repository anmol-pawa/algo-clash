"use client";

import { useEffect, useRef } from "react";
import type { SpriteSheet } from "@/game/sprites/grid";
import { toRGBA } from "@/game/sprites/grid";

/** Plays one animation of a sprite sheet on a canvas with nearest-neighbour scaling. */
export function SpriteCanvas({ sheet, anim, scale = 4, loop = true }: {
  sheet: SpriteSheet; anim: string; scale?: number; loop?: boolean;
}) {
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
    let i = 0;
    const draw = () => {
      const f = frames[i];
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.globalAlpha = f.alpha;
      ctx.drawImage(imgs[i], f.ox * scale, f.oy * scale, sheet.w * scale, sheet.h * scale);
    };
    draw();
    const t = setInterval(() => {
      i = i + 1 >= frames.length ? (loop ? 0 : i) : i + 1;
      draw();
    }, sheet.frameMs[anim] ?? 200);
    return () => clearInterval(t);
  }, [sheet, anim, scale, loop]);
  return <canvas ref={ref} width={sheet.w * scale} height={sheet.h * scale}
    style={{ imageRendering: "pixelated", maxWidth: "100%", height: "auto" }} />;
}
