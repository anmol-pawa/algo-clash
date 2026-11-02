import { describe, expect, it } from "vitest";
import { SOLID } from "@/game/sprites/tiles";
import {
  type Dir,
  type MapData,
  facingNpc,
  findPath,
  rollEncounter,
  step,
  validateMap,
  walkable,
} from "@/lib/overworld/map";
import {
  advance,
  choose,
  currentNode,
  startDialogue,
  validateScript,
  visibleChars,
  type DialogueScript,
} from "@/lib/dialogue/script";

const map: MapData = {
  id: "t",
  name: "Test",
  rows: ["gggggg", "gtttgg", "gg..gg", "ggwwgg", "gggggg"],
  legend: { g: "grass", t: "tree", ".": "path", w: "tallGrass" },
  solid: SOLID,
  npcs: [{ id: "n", x: 4, y: 2, facing: "left", dialogue: "d" }],
  warps: [{ x: 2, y: 4, toMap: "lab", toX: 1, toY: 1 }],
  encounter: { tile: "tallGrass", rate: 0.5, table: [{ id: "a", weight: 1 }, { id: "b", weight: 3 }] },
};

describe("overworld map", () => {
  it("validates, and flags broken maps", () => {
    expect(validateMap(map)).toEqual([]);
    expect(validateMap({ ...map, rows: ["gg", "g"] }).length).toBeGreaterThan(0);
    expect(validateMap({ ...map, rows: ["gz"] })[0]).toContain("legend");
    expect(validateMap({ ...map, npcs: [{ id: "n", x: 1, y: 1, facing: "up", dialogue: "d" }] })[0]).toContain("solid");
  });
  it("blocks trees, NPCs and edges", () => {
    expect(walkable(map, 1, 1)).toBe(false);
    expect(walkable(map, 4, 2)).toBe(false);
    expect(walkable(map, -1, 0)).toBe(false);
    expect(walkable(map, 0, 0)).toBe(true);
  });
  it("turns before walking, then moves; blocked keeps facing", () => {
    const p = { x: 0, y: 0, facing: "down" as const };
    expect(step(map, p, "right").kind).toBe("turned");
    const r = step(map, { ...p, facing: "right" }, "right");
    expect(r).toMatchObject({ kind: "moved", player: { x: 1, y: 0 } });
    expect(step(map, { x: 1, y: 0, facing: "down" }, "down")).toMatchObject({ kind: "blocked", player: { x: 1, y: 0 } });
    expect(step(map, p, "right", false).kind).toBe("moved");
  });
  it("reports warps and finds the NPC in front", () => {
    const r = step(map, { x: 2, y: 3, facing: "down" }, "down");
    expect(r.kind === "moved" && r.warp?.toMap).toBe("lab");
    expect(facingNpc(map, { x: 3, y: 2, facing: "right" })?.id).toBe("n");
    expect(facingNpc(map, { x: 3, y: 2, facing: "up" })).toBeUndefined();
  });
  it("rolls encounters only in tall grass, deterministically by weight", () => {
    const seq = (...v: number[]) => { let i = 0; return () => v[i++ % v.length]; };
    expect(rollEncounter(map, { x: 0, y: 0, facing: "up" }, seq(0))).toBeNull();
    expect(rollEncounter(map, { x: 2, y: 3, facing: "up" }, seq(0.9))).toBeNull();
    expect(rollEncounter(map, { x: 2, y: 3, facing: "up" }, seq(0.1, 0.1))).toBe("a");
    expect(rollEncounter(map, { x: 2, y: 3, facing: "up" }, seq(0.1, 0.9))).toBe("b");
  });
  it("finds shortest tap-to-move paths, avoids warps and unreachable goals", () => {
    const path = findPath(map, { x: 0, y: 0 }, { x: 3, y: 2 }) as Dir[];
    expect(path).not.toBeNull();
    let p = { x: 0, y: 0, facing: "down" as const };
    for (const d of path) {
      const r = step(map, p, d, false);
      expect(r.kind).toBe("moved");
      p = r.player as typeof p;
    }
    expect([p.x, p.y]).toEqual([3, 2]);
    expect(findPath(map, { x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
    expect(findPath(map, { x: 0, y: 0 }, { x: 0, y: 0 })).toEqual([]);
    const viaWarp = findPath(map, { x: 2, y: 3 }, { x: 2, y: 4 });
    expect(viaWarp).toEqual(["down"]);
  });
});

const script: DialogueScript = {
  id: "iota",
  start: "a",
  nodes: {
    a: { speaker: "Iota", portrait: "iota", text: "Hi", next: "q" },
    q: { text: "Ready?", choices: [{ text: "Yes", goto: "y", setFlags: ["ready"] }, { text: "No", goto: "n" }] },
    y: { text: "Go!", setFlags: ["met"], branches: [{ when: { flag: "ready" }, goto: "end" }], next: "n" },
    n: { text: "Later" },
    end: { text: "Bye" },
  },
};

describe("dialogue", () => {
  it("validates scripts", () => {
    expect(validateScript(script)).toEqual([]);
    expect(validateScript({ ...script, start: "zz" })[0]).toContain("start");
    expect(validateScript({ ...script, nodes: { a: { text: "x", next: "q" } } }).length).toBeGreaterThan(0);
  });
  it("walks nodes, choices set flags, branches read them", () => {
    let s = startDialogue(script, new Set());
    expect(currentNode(s).portrait).toBe("iota");
    s = advance(s);
    expect(() => advance(s)).toThrow();
    s = choose(s, 0);
    expect(s.flags.has("ready")).toBe(true);
    s = advance(s);
    expect(s.node).toBe("end");
    expect(s.flags.has("met")).toBe(true);
    s = advance(s);
    expect(s.done).toBe(true);
  });
  it("falls through to next when no branch matches", () => {
    let s = startDialogue(script, new Set());
    s = choose(advance(s), 1);
    expect(s.node).toBe("n");
  });
  it("typewriter reveals text over time and clamps", () => {
    expect(visibleChars("hello", 0)).toBe(0);
    expect(visibleChars("hello", 40, 50)).toBe(2);
    expect(visibleChars("hello", 10000)).toBe(5);
  });
});
