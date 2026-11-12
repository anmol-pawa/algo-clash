import { describe, expect, it } from "vitest";
import { ARRAY_ATOLL } from "@/lib/overworld/atoll";
import { MAINVILLE } from "@/lib/overworld/mainville";
import { ROUTE_1 } from "@/lib/overworld/route1";
import { WINDOW_WOODS } from "@/lib/overworld/woods";
import { HASHWOOD_HARBOR } from "@/lib/overworld/harbor";
import { parseMap, tileAt } from "@/lib/overworld/map";
import { newWorld, tickWorld, STEP_MS } from "@/lib/overworld/mover";
import { HARBOR_DIALOGUES } from "@/lib/dialogue/harbor";
import { WORLD_DIALOGUES } from "@/lib/dialogue/world";
import { validateScript } from "@/lib/dialogue/script";
import { SONGS } from "@/lib/audio/songs";

const maps = {
  mainville: parseMap(MAINVILLE), "route-1": parseMap(ROUTE_1), "array-atoll": parseMap(ARRAY_ATOLL),
  "window-woods": parseMap(WINDOW_WOODS), "hashwood-harbor": parseMap(HASHWOOD_HARBOR),
};

describe("Hashwood Harbor in the world", () => {
  it("every warp lands on a walkable tile of a known map", () => {
    for (const m of Object.values(maps))
      for (const w of m.warps) {
        const dest = maps[w.to as keyof typeof maps];
        expect(dest, `${m.id} -> ${w.to}`).toBeDefined();
        expect(dest.solid.has(tileAt(dest, w.tx, w.ty)!)).toBe(false);
        expect(m.solid.has(tileAt(m, w.x, w.y)!), `${m.id} warp tile`).toBe(false);
      }
  });
  it("the woods' east gap leads to the harbor and back", () => {
    const s = newWorld(maps["window-woods"]);
    s.player = { x: 20, y: 12, facing: "right" };
    s.held = "right";
    expect(tickWorld(s, STEP_MS, () => 0.99, maps)).toContainEqual({ type: "map", id: "hashwood-harbor" });
    expect(s.player).toMatchObject({ x: 1, y: 3 });
    s.player = { x: 1, y: 3, facing: "left" };
    s.held = "left";
    expect(tickWorld(s, STEP_MS, () => 0.99, maps)).toContainEqual({ type: "map", id: "window-woods" });
    expect(s.player).toMatchObject({ x: 20, y: 12 });
  });
  it("the tide line triggers the harbor encounter pool", () => {
    const s = newWorld(maps["hashwood-harbor"]);
    s.player = { x: 8, y: 7, facing: "down" }; // shore at 8,8
    s.held = "down";
    expect(tickWorld(s, 5, () => 0, maps)).toContainEqual({ type: "encounter", pool: "harbor-tide" });
  });
  it("NPCs stand on walkable tiles and teach the hash-flood rule", () => {
    for (const s of Object.values(HARBOR_DIALOGUES)) expect(validateScript(s)).toEqual([]);
    for (const n of HASHWOOD_HARBOR.npcs ?? []) {
      expect(WORLD_DIALOGUES[n.dialogue]).toBeDefined();
      expect(maps["hashwood-harbor"].solid.has(tileAt(maps["hashwood-harbor"], n.x, n.y)!)).toBe(false);
    }
    const text = JSON.stringify(HARBOR_DIALOGUES);
    expect(text).toMatch(/hash flood/);
    expect(text).toMatch(/O\(n\)/);
    expect(text).toMatch(/long long/);
  });
  it("has region music", () => {
    expect(SONGS.harbor.id).toBe("harbor");
  });
});
