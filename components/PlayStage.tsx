"use client";
import { Application, Graphics } from "pixi.js";
import { useEffect, useRef } from "react";

const TILE = 16;

/** Placeholder PixiJS stage: proves the renderer boots. The overworld replaces it (ROADMAP B2). */
export function PlayStage() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    const app = new Application();
    app
      .init({ resizeTo: el, background: 0x0f1a24, antialias: false, roundPixels: true, resolution: 1 })
      .then(() => {
        if (disposed) {
          app.destroy(true);
          return;
        }
        el.appendChild(app.canvas);
        app.canvas.style.imageRendering = "pixelated";
        const g = new Graphics();
        for (let y = 0; y * TILE < 2000; y++)
          for (let x = 0; x * TILE < 3000; x++) g.rect(x * TILE, y * TILE, TILE, TILE).fill((x + y) % 2 ? 0x1c3a2c : 0x20432f);
        app.stage.addChild(g);
      })
      .catch((e) => console.warn("pixi init:", e));
    return () => {
      disposed = true;
      if (app.renderer) app.destroy(true);
    };
  }, []);

  return <div ref={host} className="absolute inset-0" data-testid="play-stage" />;
}
