import { SpriteSheet, toRGBA } from "./grid";

/** Rasterise every frame of a sheet into offscreen canvases (browser only). */
export function sheetToCanvases(sheet: SpriteSheet): Record<string, HTMLCanvasElement[]> {
  const out: Record<string, HTMLCanvasElement[]> = {};
  for (const [name, frames] of Object.entries(sheet.anims))
    out[name] = frames.map((f) => {
      const c = document.createElement("canvas");
      c.width = sheet.w;
      c.height = sheet.h;
      const rgba = toRGBA(f.grid, sheet.palette) as unknown as Uint8ClampedArray<ArrayBuffer>;
      c.getContext("2d")!.putImageData(new ImageData(rgba, sheet.w, sheet.h), 0, 0);
      return c;
    });
  return out;
}
