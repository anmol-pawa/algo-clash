import { describe, expect, it } from "vitest";
import { parseMap } from "@/lib/overworld/map";
import { MAINVILLE } from "@/lib/overworld/mainville";
import { ROUTE_1 } from "@/lib/overworld/route1";
import { STEP_MS, newWorld, playerDrawPos, press, tapTo, tickWorld } from "@/lib/overworld/mover";

import { ARRAY_ATOLL } from "@/lib/overworld/atoll";
const maps = { mainville: parseMap(MAINVILLE), "route-1": parseMap(ROUTE_1), "array-atoll": parseMap(ARRAY_ATOLL) };
const never = () => 1;

describe("overworld mover", () => {
  it("both maps parse and warps link to real tiles", () => {
    for (const m of Object.values(maps))
      for (const w of m.warps) {
        const dest = maps[w.to as keyof typeof maps];
        expect(dest, `${m.id} -> ${w.to}`).toBeDefined();
        expect(dest.tiles[w.ty][w.tx]).toBeDefined();
      }
  });
  it("walks one tile in STEP_MS and interpolates the draw position", () => {
    const s = newWorld(maps.mainville);
    s.held = "left";
    tickWorld(s, 1, never, maps);
    expect(s.moving).not.toBeNull();
    tickWorld(s, STEP_MS / 2, never, maps);
    const p = playerDrawPos(s);
    expect(p.x).toBeGreaterThan(s.player.x);
    expect(p.x).toBeLessThan(s.player.x + 1);
    s.held = null;
    tickWorld(s, STEP_MS, never, maps);
    expect(s.moving).toBeNull();
    expect(s.player).toMatchObject({ x: 7, y: 3 });
  });
  it("bumps into solid tiles without moving", () => {
    const s = newWorld(maps.mainville);
    s.player = { x: 1, y: 1, facing: "up" };
    s.held = "up";
    const ev = tickWorld(s, 50, never, maps);
    expect(ev).toEqual([{ type: "bump" }]);
    expect(s.player).toMatchObject({ x: 1, y: 1 });
  });
  it("tap-to-move follows the path and stops at the target", () => {
    const s = newWorld(maps.mainville);
    tapTo(s, 8, 7);
    for (let i = 0; i < 40; i++) tickWorld(s, 100, never, maps);
    expect(s.player).toMatchObject({ x: 8, y: 7 });
    expect(s.moving).toBeNull();
  });
  it("warps to the next map after the step and back again", () => {
    const s = newWorld(maps.mainville);
    s.player = { x: 8, y: 9, facing: "down" };
    s.held = "down";
    const ev = tickWorld(s, STEP_MS, never, maps);
    expect(ev).toContainEqual({ type: "map", id: "route-1" });
    expect(s.map.id).toBe("route-1");
    expect(s.player).toMatchObject({ x: 8, y: 1, facing: "down" });
    s.held = "up";
    const back = tickWorld(s, STEP_MS, never, maps);
    expect(back).toContainEqual({ type: "map", id: "mainville" });
    expect(s.player).toMatchObject({ x: 8, y: 9, facing: "up" });
  });
  it("rolls encounters on tall grass and stops queued walking", () => {
    const s = newWorld(maps.mainville);
    s.player = { x: 9, y: 6, facing: "down" };
    s.held = "down";
    const ev = tickWorld(s, 10, () => 0, maps);
    expect(ev).toContainEqual({ type: "encounter", pool: "mainville-grass" });
  });
  it("action button talks to the NPC being faced but not mid-step", () => {
    const s = newWorld(maps.mainville);
    s.player = { x: 8, y: 3, facing: "right" };
    expect(press(s)).toMatchObject({ type: "npc", npcId: "iota" });
    s.moving = { fromX: 8, fromY: 3, t: 0.5 };
    expect(press(s)).toEqual({ type: "none" });
  });
  it("a large dt never skips collisions or loops forever", () => {
    const s = newWorld(maps.mainville);
    s.held = "right";
    tickWorld(s, 5000, never, maps);
    expect(maps.mainville.tiles[s.player.y][s.player.x]).not.toBe("tree");
  });
});

describe("NPC facing and dialogue flags", () => {
  it("faceNpc turns the NPC back toward the player", async () => {
    const { faceNpc } = await import("@/lib/overworld/mover");
    const s = newWorld(parseMap(MAINVILLE));
    s.player.facing = "right";
    const r = press(s);
    expect(r.type).toBe("npc");
    if (r.type !== "npc") return;
    expect(r.faceBack).toBe("left");
    expect(faceNpc(s, r.npcId, r.faceBack)).toBe(true);
    expect(s.map.npcs.find((n) => n.id === r.npcId)!.facing).toBe("left");
    expect(faceNpc(s, "nobody", "up")).toBe(false);
  });
  it("raiseFlags merges without mutating and flagSet only reads true flags", async () => {
    const { flagSet, raiseFlags } = await import("@/lib/dialogue/flags");
    const base = { "iota.met": false, coins: 3 };
    const next = raiseFlags(base, ["iota.met", "x"]);
    expect(base["iota.met"]).toBe(false);
    expect([...flagSet(next)].sort()).toEqual(["iota.met", "x"]);
    expect(raiseFlags(base, [])).toBe(base);
  });
});

describe("door events", () => {
  it("stepping onto a door raises a door event once the step finishes", async () => {
    const { MAINVILLE } = await import("@/lib/overworld/mainville");
    const { parseMap } = await import("@/lib/overworld/map");
    const m = parseMap(MAINVILLE);
    const w = newWorld(m);
    w.player = { x: 8, y: 3, facing: "up" };
    w.held = "up";
    const ev = tickWorld(w, 1000, () => 0.99, { mainville: m });
    expect(ev.find((e) => e.type === "door")).toMatchObject({ href: "/forge/" });
    expect(w.held).toBeNull();
  });
});
