"use client";

import { useEffect, useRef, useState } from "react";
import { buildArrayling } from "@/game/sprites/arrayling";
import { buildVectorling } from "@/game/sprites/vectorling";
import { evolutionSteps } from "@/game/sprites/morph";
import { toRGBA } from "@/game/sprites/grid";

const S = 64, SCALE = 4;

/** Arrayling -> Vectorling: white-silhouette morph on a glowing stage, with captions. */
export function EvolutionScene({ onDone }: { onDone?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [caption, setCaption] = useState("What? Your Arrayling is glowing…");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const cv = ref.current, ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const a = buildArrayling("front"), v = buildVectorling("front");
    const steps = evolutionSteps(a.anims.idle[0].grid, v.anims.idle[0].grid);
    const imgs = steps.map((s) => {
      const c = document.createElement("canvas");
      c.width = S; c.height = S;
      c.getContext("2d")!.putImageData(new ImageData(toRGBA(s.grid, v.palette) as unknown as Uint8ClampedArray<ArrayBuffer>, S, S), 0, 0);
      return c;
    });
    const total = steps.reduce((n, s) => n + s.ms, 0);
    let raf = 0, finished = false;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = now - t0;
      let acc = 0, i = steps.length - 1;
      for (let k = 0; k < steps.length; k++) { acc += steps[k].ms; if (t < acc) { i = k; break; } }
      const W = cv.width, H = cv.height;
      ctx.imageSmoothingEnabled = false;
      const g = ctx.createRadialGradient(W / 2, H * 0.6, 10, W / 2, H * 0.6, W * 0.6);
      const glow = Math.min(1, t / (total * 0.55));
      g.addColorStop(0, `rgba(255,232,150,${0.15 + 0.55 * glow})`);
      g.addColorStop(1, "#0d1b2a");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // rising pixel sparkles
      for (let k = 0; k < 14; k++) {
        const px = ((k * 53) % 97) / 97 * W, py = H - ((t * 0.04 + k * 37) % H);
        ctx.fillStyle = k % 2 ? "#ffe9a0" : "#ffffff";
        if (glow > 0.2) ctx.fillRect(Math.round(px / 4) * 4, Math.round(py / 4) * 4, 4, 4);
      }
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath(); ctx.ellipse(W / 2, H - 28, 90, 14, 0, 0, Math.PI * 2); ctx.fill();
      const bob = i === steps.length - 1 ? Math.round(Math.sin(t / 240) * 2) * SCALE : 0;
      ctx.drawImage(imgs[i], (W - S * SCALE) / 2, H - 28 - S * SCALE + 14 + bob, S * SCALE, S * SCALE);
      if (t > total * 0.5) setCaption((c) => (c.startsWith("Congrat") ? c : "Congratulations! Your Arrayling evolved into Vectorling!"));
      if (t >= total && !finished) { finished = true; setDone(true); onDone?.(); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <div className="flex flex-col items-center gap-2" data-testid="evolution-scene" data-done={done}>
      <canvas ref={ref} width={S * SCALE + 64} height={S * SCALE + 56}
        style={{ imageRendering: "pixelated", maxWidth: "100%", height: "auto", border: "3px solid #2f4057" }} />
      <p className="text-center text-sm text-[var(--gold)]" data-testid="evolution-caption">{caption}</p>
    </div>
  );
}
