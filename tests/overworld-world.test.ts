import { describe, expect, it } from "vitest";
import { MAPS, START_MAP } from "@/lib/overworld/maps";
import { SOLID_TILES, isBlocked } from "@/lib/overworld/map";
import { MAINVILLE_DIALOGUES } from "@/lib/dialogue/mainville";
import { LOOKS } from "@/game/sprites/character";
import { FADE_MS, STEP_MS, action, createWorld, fadeAlpha, renderPos, tapMove, tick, type World } from "@/lib/overworld/world";
import { cameraFor, loopFrame, walkPose } from "@/lib/overworld/view";

const never = () => 0.99;
const always = () => 0;
const run = (w: World, ms: number, held: Parameters<typeof tick>[2], rng = never) => {
  const ev: ReturnType<typeof tick> = [];
  for (let t = 0; t < ms; t += 10) ev.push(...tick(w, 10, held, rng));
  return ev;
};

describe("map registry", () => {
  it("has every warp pointing at a real, walkable tile", () => {
    for (const m of Object.values(MAPS)) {
      for (const warp of m.warps) {
        const dest = MAPS[warp.to];
        expect(dest, `${m.id} -> ${warp.to}`).toBeDefined();
        expect(isBlocked(dest, warp.tx, warp.ty), `${m.id} warp lands on blocked tile`).toBe(false);
        // Arriving must not land on a warp tile, or the player would bounce.
        expect(dest.warps.some((x) => x.x === warp.tx && x.y === warp.ty)).toBe(false);
      }
    }
  });
  it("has a sprite look and dialogue for every npc and sign", () => {
    for (const m of Object.values(MAPS)) {
      for (const n of m.npcs) {
        expect(LOOKS[n.sprite], n.id).toBeDefined();
        expect(MAINVILLE_DIALOGUES[n.dialogue], n.id).toBeDefined();
      }
      for (const s of m.signs) expect(MAINVILLE_DIALOGUES[s.dialogue]).toBeDefined();
    }
  });
  it("keeps every map's spawn off solid tiles", () => {
    for (const m of Object.values(MAPS)) expect(SOLID_TILES.has(m.tiles[m.spawn.y][m.spawn.x])).toBe(false);
  });
});

describe("world simulation", () => {
  it("turns first, then walks smoothly one tile per STEP_MS", () => {
    const w = createWorld(MAPS, START_MAP);
    expect(w.player.facing).toBe("down");
    run(w, 30, "left");
    expect(w.player.x).toBe(8 - 0); // turning only, no move yet
    run(w, 400, "left");
    expect(w.player.x).toBeLessThan(8);
    const mid = createWorld(MAPS, START_MAP);
    run(mid, 10, "down");
    run(mid, STEP_MS / 2, "down");
    const p = renderPos(mid);
    expect(p.y).toBeGreaterThan(3);
    expect(p.y).toBeLessThan(4);
  });
  it("bumps into solid tiles without moving", () => {
    const w = createWorld(MAPS, START_MAP, { x: 1, y: 1, facing: "up" });
    const ev = run(w, 100, "up");
    expect(ev.some((e) => e.type === "bump")).toBe(true);
    expect(w.player).toEqual({ x: 1, y: 1, facing: "up" });
  });
  it("follows a tap path and stops facing a blocked target", () => {
    const w = createWorld(MAPS, START_MAP, { x: 8, y: 4, facing: "down" });
    tapMove(w, 13, 9); // the sign
    run(w, 5000, null);
    expect(w.path).toEqual([]);
    expect(action(w).type).toBe("sign");
  });
  it("cancels a tap path when a key is held", () => {
    const w = createWorld(MAPS, START_MAP, { x: 8, y: 4, facing: "down" });
    tapMove(w, 13, 4);
    run(w, 20, "up");
    expect(w.path).toEqual([]);
  });
  it("warps through a fade and arrives on the other map", () => {
    const w = createWorld(MAPS, START_MAP, { x: 8, y: 9, facing: "down" });
    const ev = run(w, STEP_MS + 10, "down");
    ev.push(...run(w, 2 * FADE_MS + 50, null));
    expect(w.map.id).toBe("route-1");
    expect(ev).toContainEqual({ type: "mapChanged", mapId: "route-1" });
    expect(w.player).toEqual({ x: 8, y: 1, facing: "down" });
    expect(w.fade).toBeNull();
    // and back again
    const back = [...run(w, STEP_MS + 10, "up"), ...run(w, 2 * FADE_MS + 50, null)];
    expect(back).toContainEqual({ type: "mapChanged", mapId: "mainville" });
    expect(w.map.id).toBe("mainville");
    expect(w.player.y).toBe(9);
  });
  it("fades out then in, and ignores the action button while fading", () => {
    const w = createWorld(MAPS, START_MAP, { x: 8, y: 9, facing: "down" });
    run(w, STEP_MS + 5, "down");
    expect(w.fade?.phase).toBe("out");
    expect(action(w).type).toBe("none");
    run(w, FADE_MS / 2, null);
    expect(fadeAlpha(w)).toBeGreaterThan(0);
  });
  it("emits an encounter on tall grass and stops queued movement", () => {
    const w = createWorld(MAPS, START_MAP, { x: 9, y: 6, facing: "down" });
    const ev = run(w, STEP_MS * 2, "down", always);
    expect(ev.find((e) => e.type === "encounter")).toEqual({ type: "encounter", pool: "mainville-grass" });
  });
  it("makes an npc face the player when talked to", () => {
    const w = createWorld(MAPS, START_MAP, { x: 8, y: 3, facing: "right" });
    const r = action(w);
    expect(r.type).toBe("npc");
    expect(w.npcFacing.iota).toBe("left");
  });
});

describe("view helpers", () => {
  it("clamps the camera to the map and centres small maps", () => {
    const m = { width: 16, height: 11 };
    expect(cameraFor(m, 0, 0, 11, 9)).toEqual({ x: 0, y: 0 });
    expect(cameraFor(m, 15, 10, 11, 9)).toEqual({ x: 5, y: 2 });
    expect(cameraFor(m, 8, 5, 11, 9)).toEqual({ x: 3, y: 1 });
    expect(cameraFor({ width: 6, height: 5 }, 2, 2, 11, 9)).toEqual({ x: -2.5, y: -2 });
  });
  it("picks idle and alternating stride frames", () => {
    expect(walkPose("left", false, 0, 0)).toEqual({ anim: "idle-left", frame: 0 });
    expect(walkPose("down", true, 0.5, 1)).toEqual({ anim: "walk-down", frame: 1 });
    expect(walkPose("down", true, 0.5, 0)).toEqual({ anim: "walk-down", frame: 3 });
    expect(walkPose("up", true, 0.05, 1).frame).toBe(0);
  });
  it("loops animation frames by time", () => {
    expect(loopFrame(4, 350, 0)).toBe(0);
    expect(loopFrame(4, 350, 700)).toBe(2);
    expect(loopFrame(1, 350, 9999)).toBe(0);
  });
});
