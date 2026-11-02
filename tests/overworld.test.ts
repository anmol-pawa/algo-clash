import { describe, expect, it } from "vitest";
import { SOLID } from "@/game/sprites/tiles";
import { MAINVILLE } from "@/lib/overworld/mainville";
import { SOLID_TILES, parseMap, isBlocked, type MapDef } from "@/lib/overworld/map";
import { arrive, findPath, interact, step, type Player } from "@/lib/overworld/walk";
import { MAINVILLE_DIALOGUES } from "@/lib/dialogue/mainville";
import { advance, awaitingChoice, choose, startDialogue, validateScript, visibleText } from "@/lib/dialogue/script";

const map = parseMap(MAINVILLE);
const never = () => 0.99;
const always = () => 0;

describe("map format", () => {
  it("keeps SOLID_TILES in sync with the tileset", () => {
    expect([...SOLID_TILES].sort()).toEqual([...SOLID].sort());
  });
  it("parses Mainville", () => {
    expect(map.width).toBe(16);
    expect(map.height).toBe(11);
    expect(map.tiles[3][8]).toBe("path");
  });
  it("rejects authoring mistakes", () => {
    const bad = (patch: Partial<MapDef>) => () => parseMap({ ...MAINVILLE, ...patch });
    expect(bad({ rows: ["TT", "T"] })).toThrow(/row 1/);
    expect(bad({ rows: ["T?"] , spawn: { x: 0, y: 0, facing: "up" } })).toThrow(/unknown tile/);
    expect(bad({ spawn: { x: 0, y: 0, facing: "up" } })).toThrow(/spawn/);
    expect(bad({ signs: [{ x: 8, y: 3, dialogue: "x" }] })).toThrow(/sign/);
    expect(bad({ npcs: [{ id: "a", x: 0, y: 0, facing: "up", sprite: "s", dialogue: "d" }] })).toThrow(/solid/);
    expect(bad({ encounterRate: 2 })).toThrow(/encounterRate/);
  });
  it("blocks solids, NPCs and the outside", () => {
    expect(isBlocked(map, 0, 0)).toBe(true);
    expect(isBlocked(map, 9, 3)).toBe(true); // Professor Iota
    expect(isBlocked(map, 8, 3)).toBe(false);
    expect(isBlocked(map, -1, 3)).toBe(true);
    expect(isBlocked(map, 99, 3)).toBe(true);
  });
});

describe("walking", () => {
  const p: Player = { x: 8, y: 3, facing: "down" };
  it("turns first, then walks", () => {
    const a = step(map, p, "left", never);
    expect(a.events).toEqual([{ type: "turn" }]);
    expect(a.player).toEqual({ x: 8, y: 3, facing: "left" });
    const b = step(map, a.player, "left", never);
    expect(b.player).toEqual({ x: 7, y: 3, facing: "left" });
    expect(b.events[0]).toEqual({ type: "move", from: { x: 8, y: 3 } });
  });
  it("running skips the turn", () => {
    expect(step(map, p, "left", never, true).player.x).toBe(7);
  });
  it("bumps into NPCs and trees", () => {
    const r = step(map, { x: 8, y: 3, facing: "right" }, "right", never);
    expect(r.events).toEqual([{ type: "bump" }]);
    expect(r.player.x).toBe(8);
  });
  it("warps on a warp tile", () => {
    const r = step(map, { x: 8, y: 9, facing: "down" }, "down", never);
    const w = r.events.find((e) => e.type === "warp");
    if (w?.type !== "warp") throw new Error("expected a warp event");
    expect(arrive(w.warp, "down")).toEqual({ x: 8, y: 0, facing: "down" });
  });
  it("rolls encounters only on tall grass", () => {
    const grass = step(map, { x: 9, y: 6, facing: "down" }, "down", always);
    expect(grass.events.map((e) => e.type)).toEqual(["move", "encounter"]);
    expect(step(map, { x: 9, y: 6, facing: "down" }, "down", never).events.map((e) => e.type)).toEqual(["move"]);
    expect(step(map, { x: 8, y: 3, facing: "down" }, "down", always).events.map((e) => e.type)).toEqual(["move"]);
  });
  it("is deterministic and never leaves the map", () => {
    let seed = 7;
    const rng = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    let pl: Player = { ...MAINVILLE.spawn };
    for (let i = 0; i < 2000; i++) {
      const dir = (["up", "down", "left", "right"] as const)[Math.floor(rng() * 4)];
      pl = step(map, pl, dir, rng, true).player;
      expect(isBlocked(map, pl.x, pl.y)).toBe(false);
    }
  });
});

describe("interaction", () => {
  it("talks to the NPC faced", () => {
    const r = interact(map, { x: 8, y: 3, facing: "right" });
    expect(r).toEqual({ type: "npc", npcId: "iota", dialogue: "iota-intro", faceBack: "left" });
  });
  it("reads signs and ignores empty ground", () => {
    expect(interact(map, { x: 13, y: 8, facing: "down" })).toEqual({ type: "sign", dialogue: "sign-welcome" });
    expect(interact(map, { x: 8, y: 3, facing: "up" })).toEqual({ type: "none" });
  });
});

describe("tap-to-move pathfinding", () => {
  const walk = (from: Player, dirs: string[]) => {
    let pl = from;
    for (const d of dirs) pl = step(map, pl, d as never, never, true).player;
    return pl;
  };
  it("finds a path and arrives", () => {
    const from = { x: 8, y: 3, facing: "down" as const };
    const path = findPath(map, from, { x: 5, y: 7 });
    expect(path.length).toBeGreaterThan(0);
    const end = walk(from, path);
    expect([end.x, end.y]).toEqual([5, 7]);
  });
  it("is shortest on open ground", () => {
    expect(findPath(map, { x: 7, y: 3 }, { x: 7, y: 6 })).toHaveLength(3);
  });
  it("stops next to an NPC and faces it", () => {
    const path = findPath(map, { x: 7, y: 5 }, { x: 9, y: 3 });
    const end = walk({ x: 7, y: 5, facing: "down" }, path);
    expect(interact(map, end)).toMatchObject({ type: "npc", npcId: "iota" });
  });
  it("returns [] when already there or unreachable", () => {
    expect(findPath(map, { x: 8, y: 3 }, { x: 8, y: 3 })).toEqual([]);
    expect(findPath(map, { x: 8, y: 3 }, { x: 2, y: 9 })).toEqual([]); // water pocket with no walkable neighbour
  });
});

describe("dialogue", () => {
  it("every script is valid", () => {
    for (const s of Object.values(MAINVILLE_DIALOGUES)) expect(validateScript(s)).toEqual([]);
  });
  it("every map reference resolves to a script", () => {
    for (const n of MAINVILLE.npcs ?? []) expect(MAINVILLE_DIALOGUES[n.dialogue]).toBeDefined();
    for (const s of MAINVILLE.signs ?? []) expect(MAINVILLE_DIALOGUES[s.dialogue]).toBeDefined();
  });
  it("pages, choices, flags and the re-visit variant", () => {
    const script = MAINVILLE_DIALOGUES["iota-intro"];
    let st = startDialogue(script);
    expect(st.page).toBe(0);
    st = advance(st);
    expect(st.page).toBe(1);
    expect(awaitingChoice(st)).toBe(true);
    expect(advance(st)).toBe(st); // blocked until a choice
    st = choose(st, 0);
    expect(st.nodeId).toBe("more");
    expect(st.raised).toContain("iota.met");
    st = advance(advance(st));
    expect(st.done).toBe(true);
    expect(startDialogue(script, new Set(["iota.met"])).nodeId).toBe("again");
  });
  it("ending choices raise their flags and finish", () => {
    let st = advance(startDialogue(MAINVILLE_DIALOGUES["iota-intro"]));
    st = choose(st, 1);
    expect(st.done).toBe(true);
    expect(st.raised).toEqual(["iota.met"]);
  });
  it("detects broken scripts", () => {
    expect(validateScript({ id: "x", start: "a", nodes: { a: { pages: [], next: "zz" } } })).toEqual(["a: no pages", 'a: next "zz" missing']);
  });
  it("typewriter reveals by time", () => {
    expect(visibleText("hello", 0)).toBe("");
    expect(visibleText("hello", 40, 50)).toBe("he");
    expect(visibleText("hello", 10000)).toBe("hello");
  });
});
