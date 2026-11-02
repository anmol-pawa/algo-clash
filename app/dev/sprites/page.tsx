"use client";

import { useMemo } from "react";
import { SpriteCanvas } from "@/components/SpriteCanvas";
import { buildArrayling } from "@/game/sprites/arrayling";

const ANIMS = ["idle", "attack", "hurt", "faint", "evolve"];

export default function SpritesDev() {
  const sheets = useMemo(() => ({ front: buildArrayling("front"), back: buildArrayling("back") }), []);
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-1 text-xl font-bold">Sprites</h1>
      <p className="mb-4 text-sm opacity-70">Arrayling (starter). Every animation, front and back.</p>
      {(["front", "back"] as const).map((v) => (
        <section key={v} className="mb-6">
          <h2 className="mb-2 font-semibold capitalize">Arrayling {v}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {ANIMS.map((a) => (
              <figure key={a} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
                <SpriteCanvas sheet={sheets[v]} anim={a} scale={3} />
                <figcaption className="text-xs text-black">{a}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
