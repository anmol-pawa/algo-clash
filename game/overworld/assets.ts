import { LOOKS, buildCharacter } from "@/game/sprites/character";
import { type SpriteSheet, toRGBA } from "@/game/sprites/grid";
import { buildTileset } from "@/game/sprites/tiles";

export interface Atlas {
  w: number;
  h: number;
  frames: Record<string, HTMLCanvasElement[]>;
  frameMs: Record<string, number>;
}

/** Rasterise every animation frame of a sheet to its own canvas (browser only). */
export function rasterise(sheet: SpriteSheet): Atlas {
  const frames: Record<string, HTMLCanvasElement[]> = {};
  for (const [name, fs] of Object.entries(sheet.anims)) {
    frames[name] = fs.map((f) => {
      const c = document.createElement("canvas");
      c.width = sheet.w;
      c.height = sheet.h;
      const data = toRGBA(f.grid, sheet.palette) as unknown as Uint8ClampedArray<ArrayBuffer>;
      c.getContext("2d")!.putImageData(new ImageData(data, sheet.w, sheet.h), 0, 0);
      return c;
    });
  }
  return { w: sheet.w, h: sheet.h, frames, frameMs: sheet.frameMs };
}

export interface OverworldAssets {
  tiles: Atlas;
  /** keyed by sprite id: "trainer", "iota", "villager" */
  characters: Record<string, Atlas>;
}

export function loadOverworldAssets(): OverworldAssets {
  return {
    tiles: rasterise(buildTileset()),
    characters: Object.fromEntries(Object.entries(LOOKS).map(([k, look]) => [k, rasterise(buildCharacter(look))])),
  };
}
