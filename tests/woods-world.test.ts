import { describe, expect, it } from "vitest";
import { ARRAY_ATOLL } from "@/lib/overworld/atoll";
import { MAINVILLE } from "@/lib/overworld/mainville";
import { ROUTE_1 } from "@/lib/overworld/route1";
import { WINDOW_WOODS } from "@/lib/overworld/woods";
import { HASHWOOD_HARBOR } from "@/lib/overworld/harbor";
import { parseMap, tileAt } from "@/lib/overworld/map";
import { newWorld, tickWorld, STEP_MS } from "@/lib/overworld/mover";
import { WOODS_DIALOGUES } from "@/lib/dialogue/woods";
import { WORLD_DIALOGUES } from "@/lib/dialogue/world";
import { validateScript } from "@/lib/dialogue/script";
import { SONGS } from "@/lib/audio/songs";

const maps = {
  mainville: parseMap(MAINVILLE), "route-1": parseMap(ROUTE_1),
  "array-atoll": parseMap(ARRAY_ATOLL), "window-woods": parseMap(WINDOW_WOODS), "hashwood-harbor": parseMap(HASHWOOD_HARBOR),
};

describe("Window Woods in the world", () => {
  it("every warp lands on a walkable tile of a known map", () => {
    for (const m of Object.values(maps))
      for (const w of m.warps) {
        const dest = maps[w.to as keyof typeof maps];
        expect(dest, `${m.id} -> ${w.to}`).toBeDefined();
        expect(dest.solid.has(tileAt(dest, w.tx, w.ty)!)).toBe(false);
      }
  });
  it("the atoll's east shore leads into the woods and back", () => {
    const s = newWorld(maps["array-atoll"]);
    s.player = { x: 20, y: 8, facing: "right" };
    s.held = "right";
    expect(tickWorld(s, STEP_MS, () => 0.99, maps)).toContainEqual({ type: "map", id: "window-woods" });
    expect(s.player).toMatchObject({ x: 1, y: 12 });
    s.held = "left";
    expect(tickWorld(s, STEP_MS, () => 0.99, maps)).toContainEqual({ type: "map", id: "array-atoll" });
    expect(s.player).toMatchObject({ x: 20, y: 8 });
  });
  it("ferns trigger the woods encounter pool", () => {
    const s = newWorld(maps["window-woods"]);
    s.player = { x: 1, y: 5, facing: "right" }; // fern at 2,5
    s.held = "right";
    expect(tickWorld(s, 5, () => 0, maps)).toContainEqual({ type: "encounter", pool: "woods-fern" });
  });
  it("NPCs stand on walkable tiles and have valid dialogue with the shrinking-pane hint", () => {
    for (const s of Object.values(WOODS_DIALOGUES)) expect(validateScript(s)).toEqual([]);
    for (const n of WINDOW_WOODS.npcs ?? []) {
      expect(WORLD_DIALOGUES[n.dialogue]).toBeDefined();
      expect(maps["window-woods"].solid.has(tileAt(maps["window-woods"], n.x, n.y)!)).toBe(false);
    }
    const text = JSON.stringify(WOODS_DIALOGUES);
    expect(text).toMatch(/shrinking pane/);
    expect(text).toMatch(/deque/);
    expect(text).toMatch(/long long/);
  });
  it("has region music", () => {
    expect(SONGS.woods.id).toBe("woods");
  });
});
