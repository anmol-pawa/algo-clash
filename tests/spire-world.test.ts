import { describe, expect, it } from "vitest";
import { ARRAY_ATOLL } from "@/lib/overworld/atoll";
import { MAINVILLE } from "@/lib/overworld/mainville";
import { ROUTE_1 } from "@/lib/overworld/route1";
import { WINDOW_WOODS } from "@/lib/overworld/woods";
import { HASHWOOD_HARBOR } from "@/lib/overworld/harbor";
import { STACKSPIRE } from "@/lib/overworld/spire";
import { parseMap, tileAt } from "@/lib/overworld/map";
import { newWorld, tickWorld, STEP_MS } from "@/lib/overworld/mover";
import { SPIRE_DIALOGUES } from "@/lib/dialogue/spire";
import { WORLD_DIALOGUES } from "@/lib/dialogue/world";
import { validateScript } from "@/lib/dialogue/script";
import { SONGS } from "@/lib/audio/songs";

const maps = {
  mainville: parseMap(MAINVILLE), "route-1": parseMap(ROUTE_1), "array-atoll": parseMap(ARRAY_ATOLL),
  "window-woods": parseMap(WINDOW_WOODS), "hashwood-harbor": parseMap(HASHWOOD_HARBOR), stackspire: parseMap(STACKSPIRE),
};

describe("Stackspire in the world", () => {
  it("every warp lands on a walkable tile of a known map", () => {
    for (const m of Object.values(maps))
      for (const w of m.warps) {
        const dest = maps[w.to as keyof typeof maps];
        expect(dest, `${m.id} -> ${w.to}`).toBeDefined();
        expect(dest.solid.has(tileAt(dest, w.tx, w.ty)!)).toBe(false);
        expect(m.solid.has(tileAt(m, w.x, w.y)!), `${m.id} warp tile`).toBe(false);
      }
  });
  it("the harbor's east end leads to the spire and back", () => {
    const s = newWorld(maps["hashwood-harbor"]);
    s.player = { x: 20, y: 7, facing: "right" };
    s.held = "right";
    expect(tickWorld(s, STEP_MS, () => 0.99, maps)).toContainEqual({ type: "map", id: "stackspire" });
    expect(s.player).toMatchObject({ x: 1, y: 11 });
    s.player = { x: 1, y: 11, facing: "left" };
    s.held = "left";
    expect(tickWorld(s, STEP_MS, () => 0.99, maps)).toContainEqual({ type: "map", id: "hashwood-harbor" });
    expect(s.player).toMatchObject({ x: 20, y: 7 });
  });
  it("rune pads trigger the spire encounter pool", () => {
    const s = newWorld(maps.stackspire);
    s.player = { x: 2, y: 10, facing: "right" }; // rune at 3,10
    s.held = "right";
    expect(tickWorld(s, 5, () => 0, maps)).toContainEqual({ type: "encounter", pool: "spire-rune" });
  });
  it("NPCs stand on walkable tiles and teach the Iron stack rule", () => {
    for (const s of Object.values(SPIRE_DIALOGUES)) expect(validateScript(s)).toEqual([]);
    for (const n of STACKSPIRE.npcs ?? []) {
      expect(WORLD_DIALOGUES[n.dialogue]).toBeDefined();
      expect(maps.stackspire.solid.has(tileAt(maps.stackspire, n.x, n.y)!)).toBe(false);
    }
    const text = JSON.stringify(SPIRE_DIALOGUES);
    expect(text).toMatch(/Iron stack/);
    expect(text).toMatch(/O\(n\)/);
    expect(text).toMatch(/long long/);
  });
  it("has region music", () => {
    expect(SONGS.spire.id).toBe("spire");
  });
});
