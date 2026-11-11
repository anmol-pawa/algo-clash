import { describe, expect, it } from "vitest";
import { ARRAY_ATOLL } from "@/lib/overworld/atoll";
import { WINDOW_WOODS } from "@/lib/overworld/woods";
import { MAINVILLE } from "@/lib/overworld/mainville";
import { ROUTE_1 } from "@/lib/overworld/route1";
import { parseMap, tileAt } from "@/lib/overworld/map";
import { newWorld, tickWorld, STEP_MS } from "@/lib/overworld/mover";
import { ATOLL_DIALOGUES } from "@/lib/dialogue/atoll";
import { WORLD_DIALOGUES } from "@/lib/dialogue/world";
import { validateScript } from "@/lib/dialogue/script";
import { SONGS } from "@/lib/audio/songs";

const maps = { mainville: parseMap(MAINVILLE), "route-1": parseMap(ROUTE_1), "array-atoll": parseMap(ARRAY_ATOLL), "window-woods": parseMap(WINDOW_WOODS) };

describe("Array Atoll in the world", () => {
  it("every warp lands on a walkable tile of a known map", () => {
    for (const m of Object.values(maps))
      for (const w of m.warps) {
        const dest = maps[w.to as keyof typeof maps];
        expect(dest, `${m.id} -> ${w.to}`).toBeDefined();
        expect(dest.solid.has(tileAt(dest, w.tx, w.ty)!)).toBe(false);
      }
  });
  it("walking south from Route 1 reaches the atoll, and walking south from the atoll returns", () => {
    const s = newWorld(maps["route-1"]);
    s.player = { x: 7, y: 9, facing: "down" };
    s.held = "down";
    const ev = tickWorld(s, STEP_MS, () => 0.99, maps);
    expect(ev).toContainEqual({ type: "map", id: "array-atoll" });
    expect(s.map.id).toBe("array-atoll");
    expect(s.player).toMatchObject({ x: 10, y: 12 });
    s.held = "down";
    const back = tickWorld(s, STEP_MS, () => 0.99, maps);
    expect(back).toContainEqual({ type: "map", id: "route-1" });
    expect(s.player).toMatchObject({ x: 7, y: 9, facing: "up" });
  });
  it("seagrass triggers the atoll encounter pool", () => {
    const s = newWorld(maps["array-atoll"]);
    s.player = { x: 6, y: 6, facing: "right" }; // seagrass is at 7,6
    s.held = "right";
    const ev = tickWorld(s, 5, () => 0, maps);
    expect(ev).toContainEqual({ type: "encounter", pool: "atoll-seagrass" });
  });
  it("has valid, reachable NPC dialogue with the dry-tide hint", () => {
    for (const s of Object.values(ATOLL_DIALOGUES)) expect(validateScript(s)).toEqual([]);
    for (const n of ARRAY_ATOLL.npcs ?? []) expect(WORLD_DIALOGUES[n.dialogue]).toBeDefined();
    const text = JSON.stringify(ATOLL_DIALOGUES);
    expect(text).toMatch(/dry tide/);
    expect(text).toMatch(/long long/);
  });
  it("has region music", () => {
    expect(SONGS.atoll.id).toBe("atoll");
  });
});
