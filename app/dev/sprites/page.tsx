"use client";

import { useMemo } from "react";
import { SpriteCanvas } from "@/components/SpriteCanvas";
import { buildArrayling } from "@/game/sprites/arrayling";
import { IOTA, TRAINER, buildCharacter, buildPortrait } from "@/game/sprites/character";

const ANIMS = ["idle", "attack", "hurt", "faint", "evolve"];
const WALKS = ["down", "up", "left", "right"];

export default function SpritesDev() {
  const sheets = useMemo(() => ({ front: buildArrayling("front"), back: buildArrayling("back") }), []);
  const chars = useMemo(() => [TRAINER, IOTA].map((l) => ({ l, sheet: buildCharacter(l), portrait: buildPortrait(l) })), []);
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-1 text-xl font-bold">Sprites</h1>
      <p className="mb-4 text-sm opacity-70">Arrayling (starter), trainer and Professor Iota.</p>
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
      {chars.map(({ l, sheet, portrait }) => (
        <section key={l.name} className="mb-6">
          <h2 className="mb-2 font-semibold capitalize">{l.name}: overworld walk cycles and portrait</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {WALKS.map((d) => (
              <figure key={d} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
                <SpriteCanvas sheet={sheet} anim={`walk-${d}`} scale={6} />
                <figcaption className="text-xs text-black">walk-{d}</figcaption>
              </figure>
            ))}
            {["idle", "talk"].map((a) => (
              <figure key={a} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
                <SpriteCanvas sheet={portrait} anim={a} scale={3} />
                <figcaption className="text-xs text-black">portrait {a}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
