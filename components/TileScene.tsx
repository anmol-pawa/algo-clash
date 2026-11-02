"use client";

import { useEffect, useRef } from "react";
import type { SpriteSheet } from "@/game/sprites/grid";
import { toRGBA } from "@/game/sprites/grid";
import type { TileName } from "@/game/sprites/tiles";

const MAP = [
  "TTTTTTTTTTTTTTTT",
  "Tg.g.RRRR.g.f.gT",
  "T.g.f.hWDW..g.gT",
  "T..g...pppp....T",
  "Tg.RRRR.pp.g.f.T",
  "T..hWDWpp..g...T",
  "Tf..g..pp.bb..gT",
  "T.g....ppEEg...T",
  "TwwwTT.ppEEg.f.T",
  "TwwwwT.pp..g.sgT",
  "TTwwTTTppTTFFFFT",
];
const LEGEND: Record<string, TileName> = {
  T: "tree", g: "grass", ".": "grass2", f: "flowers", p: "path", w: "water", b: "bush", s: "sign",
  R: "roofHouse", h: "wallHouse", W: "windowHouse", D: "doorHouse", E: "tallGrass", F: "fence",
};


/** Sample Mainville scene composed from the tileset, animated (water + tall grass). */
export function TileScene({ sheet, scale = 3 }: { sheet: SpriteSheet; scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    ctx.imageSmoothingEnabled = false;
    const imgs: Record<string, HTMLCanvasElement[]> = {};
    for (const [name, frames] of Object.entries(sheet.anims))
      imgs[name] = frames.map((f) => {
        const c = document.createElement("canvas");
        c.width = sheet.w; c.height = sheet.h;
        c.getContext("2d")!.putImageData(new ImageData(toRGBA(f.grid, sheet.palette) as unknown as Uint8ClampedArray<ArrayBuffer>, sheet.w, sheet.h), 0, 0);
        return c;
      });
    let tick = 0;
    const draw = () => {
      MAP.forEach((row, y) => [...row].forEach((ch, x) => {
        const n = LEGEND[ch] ?? "grass";
        const fr = imgs[n];
        ctx.drawImage(fr[tick % fr.length], x * sheet.w * scale, y * sheet.h * scale, sheet.w * scale, sheet.h * scale);
      }));
    };
    draw();
    const t = setInterval(() => { tick++; draw(); }, 400);
    return () => clearInterval(t);
  }, [sheet, scale]);
  return <canvas ref={ref} width={MAP[0].length * sheet.w * scale} height={MAP.length * sheet.h * scale}
    style={{ imageRendering: "pixelated", maxWidth: "100%", height: "auto" }} />;
}
