"use client";

import { useEffect, useRef } from "react";
import { buildArrayling, drawArrayling } from "@/game/sprites/arrayling";
import { buildVectorling, drawVectorling } from "@/game/sprites/vectorling";
import { toRGBA, type Grid } from "@/game/sprites/grid";
import { EVOLUTION_MS, evolutionFrame } from "@/lib/evolution/timeline";

const SIZE = 64;
const VIEW_W = 96, VIEW_H = 80; // logical pixels of the scene

function toCanvas(g: Grid, palette: string[]): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = SIZE; c.height = SIZE;
  c.getContext("2d")!.putImageData(new ImageData(toRGBA(g, palette) as unknown as Uint8ClampedArray<ArrayBuffer>, SIZE, SIZE), 0, 0);
  return c;
}

/** Arrayling → Vectorling: charge, accelerating white-silhouette flicker, hold, colour reveal. */
export function EvolutionScene({ scale = 4, onDone, replayKey = 0 }: { scale?: number; onDone?: () => void; replayKey?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; });
  useEffect(() => {
    const cv = ref.current, ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const a = buildArrayling("front"), v = buildVectorling("front");
    const img = {
      old: toCanvas(drawArrayling({ view: "front" }), a.palette),
      oldW: toCanvas(drawArrayling({ view: "front", white: true }), a.palette),
      nu: toCanvas(drawVectorling({ view: "front" }), v.palette),
      nuW: toCanvas(drawVectorling({ view: "front", white: true }), v.palette),
    };
    let raf = 0, fired = false;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = now - t0;
      const f = evolutionFrame(t);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.imageSmoothingEnabled = false;
      // night-sky backdrop that brightens with the glow
      ctx.fillStyle = "#101a2e"; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.fillStyle = `rgba(255,240,200,${0.08 + f.glow * 0.22})`;
      for (let r = 40; r > 8; r -= 8) { ctx.beginPath(); ctx.arc(VIEW_W / 2, 44, r + Math.sin(t / 120) * 2, 0, Math.PI * 2); ctx.fill(); }
      // ground
      ctx.fillStyle = "#1d3a2c"; ctx.fillRect(0, 66, VIEW_W, 14);
      ctx.fillStyle = "#2a5a43"; ctx.fillRect(0, 66, VIEW_W, 1);
      // rising sparkles (deterministic from t)
      for (let i = 0; i < 18; i++) {
        const phase = ((t / 1400) + i * 0.173) % 1;
        const x = 8 + ((i * 37) % 80), y = 70 - phase * 66;
        if (f.glow * 18 > i) { ctx.fillStyle = i % 3 ? "#ffd56b" : "#ffffff"; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); }
      }
      const src = f.form === "old" ? (f.white ? img.oldW : img.old) : f.white ? img.nuW : img.nu;
      const bob = f.form === "old" && !f.white ? Math.round(Math.sin(t / 140)) : 0;
      ctx.drawImage(src, (VIEW_W - SIZE) / 2, 12 + bob);
      if (f.done && !fired) { fired = true; doneRef.current?.(); }
      if (t < EVOLUTION_MS + 4000) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scale, replayKey]);
  return <canvas ref={ref} width={VIEW_W * scale} height={VIEW_H * scale} data-testid="evolution-canvas"
    style={{ imageRendering: "pixelated", maxWidth: "100%", height: "auto" }} />;
}
