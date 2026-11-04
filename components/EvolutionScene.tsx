"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildArrayling } from "@/game/sprites/arrayling";
import { sheetToCanvases } from "@/game/sprites/canvasFrames";
import { buildVectorling } from "@/game/sprites/vectorling";
import { EVOLVE_TOTAL_MS, evolveState } from "@/lib/evolution/timeline";

const W = 160, H = 120; // logical pixels, drawn with nearest-neighbour scaling
const prefersReduced = (): boolean => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Plays the Arrayling → Vectorling evolution (white-silhouette morph, rings, flash, reveal). */
export function EvolutionScene({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [finished, setFinished] = useState(false);
  const sheets = useMemo(() => ({ old: buildArrayling("front"), next: buildVectorling("front") }), []);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const old = sheetToCanvases(sheets.old);
    const next = sheetToCanvases(sheets.next);
    ctx.imageSmoothingEnabled = false;
    const reduced = prefersReduced();
    const t0 = performance.now();
    let raf = 0, done = false;
    const draw = (now: number) => {
      const t = Math.max(0, now - t0);
      const s = evolveState(t, reduced);
      // backdrop: night sky with a soft floor
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0d1b2a"); sky.addColorStop(1, "#27506b");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 24; i++) { // twinkling stars
        const on = (Math.floor(t / 300) + i) % 5 !== 0;
        if (on) { ctx.fillStyle = "#cfe8ff"; ctx.fillRect((i * 37) % W, (i * 23) % 60, 1, 1); }
      }
      ctx.fillStyle = "#16301f"; ctx.fillRect(0, 96, W, H - 96);
      ctx.fillStyle = "#245a35"; ctx.fillRect(0, 96, W, 2);
      // rings
      if (s.burst > 0 && s.phase !== "intro") {
        for (let k = 0; k < 3; k++) {
          const r = ((s.burst * 70 + k * 22) % 66) + 6;
          ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, 0.7 - r / 90)})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(W / 2, 62, r, 0, Math.PI * 2); ctx.stroke();
        }
      }
      // sprite
      const set = s.sprite === "old" ? old : next;
      const sheet = s.sprite === "old" ? sheets.old : sheets.next;
      const idle = set.idle;
      const frames = s.white ? set.evolve : idle;
      const f = frames[Math.floor(t / (s.white ? 90 : sheet.frameMs.idle)) % frames.length];
      const size = 64 * s.scale;
      const bob = s.phase === "intro" || s.phase === "done" ? Math.round(Math.sin(t / 280)) : 0;
      ctx.drawImage(f, Math.round(W / 2 - size / 2), Math.round(97 - size + bob), size, size);
      // sparkles after reveal
      if (s.phase === "reveal" || s.phase === "done") {
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2 + t / 900;
          const rr = 34 + 6 * Math.sin(t / 200 + i);
          ctx.fillStyle = i % 2 ? "#ffe07a" : "#ffffff";
          ctx.fillRect(Math.round(W / 2 + Math.cos(a) * rr), Math.round(62 + Math.sin(a) * rr * 0.7), 2, 2);
        }
      }
      if (s.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${s.flash})`; ctx.fillRect(0, 0, W, H); }
      if (t >= EVOLVE_TOTAL_MS || reduced) {
        if (!done) { done = true; setFinished(true); }
        if (reduced) return; // static final frame
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [sheets]);

  return (
    <section className="panel flex flex-col gap-3 p-3" data-testid="evolution">
      <canvas ref={ref} width={W} height={H} aria-label="Arrayling evolving into Vectorling"
        className="w-full" style={{ imageRendering: "pixelated" }} />
      <p role="status" className="text-center font-display text-lg" data-testid="evolution-text">
        {finished ? "Your Arrayling evolved into Vectorling!" : "What? Your Arrayling is changing…"}
      </p>
      {finished && <p className="text-center text-sm text-white/80">A vector keeps spare capacity so push_back stays amortised O(1). It grew a ghost slot to match.</p>}
      <button className="px-btn px-btn-primary min-h-11" onClick={onDone} data-testid="evolution-continue">
        {finished ? "Continue ▶" : "Skip ▶"}
      </button>
    </section>
  );
}
