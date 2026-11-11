"use client";

import { useMemo } from "react";
import { SpriteCanvas } from "@/components/SpriteCanvas";
import { buildArrayling } from "@/game/sprites/arrayling";
import { buildVectorling } from "@/game/sprites/vectorling";
import { EvolutionScene } from "@/components/EvolutionScene";
import { TileScene } from "@/components/TileScene";
import { ARRAY_ATOLL } from "@/lib/overworld/atoll";
import { GymScene } from "@/components/GymScene";
import { buildWarden } from "@/game/sprites/warden";
import { buildTidecaller } from "@/game/sprites/tidecaller";
import { buildPaneWarden } from "@/game/sprites/paneWarden";
import { TILE_NAMES, buildTileset } from "@/game/sprites/tiles";
import { ATOLL_TILE_NAMES, buildAtollTileset } from "@/game/sprites/atollTiles";
import { WOODS_TILE_NAMES, buildWoodsTileset } from "@/game/sprites/woodsTiles";
import { IOTA, TRAINER, buildCharacter, buildPortrait } from "@/game/sprites/character";

const ANIMS = ["idle", "attack", "hurt", "faint", "evolve"];
const WALKS = ["down", "up", "left", "right"];

const WOODS_LEGEND: Record<string, string> = {
  g: "grass", G: "grass2", p: "path", e: "pathEdge", P: "pine", w: "glassPane", s: "stump", f: "fern",
  r: "stream", b: "bridge", m: "mushroom", o: "boulder", l: "leafPile", F: "fence",
};
const WOODS_SAMPLE = [
  "PPPPPPPPPPPPPPPPPPPP",
  "PgGgPwwgGgPgwwgGgPgP",
  "PGgmgggeeepegggoGgPP",
  "PgfffgGpppppgsgggGgP",
  "PGfffggpppppggglllgP",
  "PgfffggepepegGllllgP",
  "rrrrrrrrbbrrrrrrrrrr",
  "rrrrrrrrbbrrrrrrrrrr",
  "PgGgFFFFpppFFFFgGgPP",
  "PPgGgggGpppgGgGgggPP",
];

export default function SpritesDev() {
  const sheets = useMemo(() => ({ front: buildArrayling("front"), back: buildArrayling("back") }), []);
  const chars = useMemo(() => [TRAINER, IOTA].map((l) => ({ l, sheet: buildCharacter(l), portrait: buildPortrait(l) })), []);
  const vec = useMemo(() => ({ front: buildVectorling("front"), back: buildVectorling("back") }), []);
  const warden = useMemo(() => buildWarden(), []);
  const tidecaller = useMemo(() => buildTidecaller(), []);
  const paneWarden = useMemo(() => buildPaneWarden(), []);
  const tiles = useMemo(() => buildTileset(), []);
  const atoll = useMemo(() => buildAtollTileset(), []);
  const woods = useMemo(() => buildWoodsTileset(), []);
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
      {(["front", "back"] as const).map((v) => (
        <section key={"v" + v} className="mb-6">
          <h2 className="mb-2 font-semibold capitalize">Vectorling {v} (Arrayling stage 2)</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {ANIMS.map((a) => (
              <figure key={a} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
                <SpriteCanvas sheet={vec[v]} anim={a} scale={3} />
                <figcaption className="text-xs text-black">{a}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Evolution scene</h2>
        <div className="max-w-md"><EvolutionScene onDone={() => {}} /></div>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Warden Brace (96x96 gym leader)</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["idle", "attack", "hurt", "faint"].map((a) => (
            <figure key={a} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
              <SpriteCanvas sheet={warden} anim={a} scale={3} />
              <figcaption className="text-xs text-black">{a}</figcaption>
            </figure>
          ))}
        </div>
        <h3 className="mb-1 mt-3 text-sm font-semibold">Gym backdrop (idle / attack)</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <GymScene sheet={warden} anim="idle" scale={3} />
          <GymScene sheet={warden} anim="attack" scale={3} />
        </div>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Tidecaller Mira (96x96 gym leader, Array Atoll)</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["idle", "attack", "hurt", "faint"].map((a) => (
            <figure key={a} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
              <SpriteCanvas sheet={tidecaller} anim={a} scale={3} />
              <figcaption className="text-xs text-black">{a}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Pane Warden Sorrel (96x96 gym leader, Window Woods)</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["idle", "attack", "hurt", "faint"].map((a) => (
            <figure key={a} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
              <SpriteCanvas sheet={paneWarden} anim={a} scale={3} />
              <figcaption className="text-xs text-black">{a}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Mainville tileset (16x16)</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-9">
          {TILE_NAMES.map((n) => (
            <figure key={n} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
              <SpriteCanvas sheet={tiles} anim={n} scale={4} />
              <figcaption className="text-xs text-black">{n}</figcaption>
            </figure>
          ))}
        </div>
        <h3 className="mb-1 mt-3 text-sm font-semibold">Sample scene</h3>
        <TileScene sheet={tiles} />
      </section>
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Array Atoll tileset (16x16)</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-9">
          {ATOLL_TILE_NAMES.map((n) => (
            <figure key={n} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
              <SpriteCanvas sheet={atoll} anim={n} scale={4} />
              <figcaption className="truncate text-xs text-black">{n}</figcaption>
            </figure>
          ))}
        </div>
        <h3 className="mb-1 mt-3 text-sm font-semibold">Array Atoll map (22x15) and gym backdrop</h3>
        <TileScene sheet={atoll} scale={2} rows={ARRAY_ATOLL.rows} legend={ARRAY_ATOLL.legend} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <GymScene sheet={tidecaller} anim="idle" scale={3} region="array-atoll" />
          <GymScene sheet={tidecaller} anim="attack" scale={3} region="array-atoll" />
        </div>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Window Woods tileset (16x16)</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-9">
          {WOODS_TILE_NAMES.map((n) => (
            <figure key={n} className="min-w-0 rounded bg-[#cfe8c4] p-2 text-center">
              <SpriteCanvas sheet={woods} anim={n} scale={4} />
              <figcaption className="truncate text-xs text-black">{n}</figcaption>
            </figure>
          ))}
        </div>
        <h3 className="mb-1 mt-3 text-sm font-semibold">Sample woods scene</h3>
        <TileScene sheet={woods} scale={2} rows={WOODS_SAMPLE} legend={WOODS_LEGEND} />
      </section>
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
