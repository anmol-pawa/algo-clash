import { TILE } from "@/game/sprites/tiles";
import { cameraFor, loopFrame, walkPose } from "@/lib/overworld/view";
import { fadeAlpha, renderPos, type World } from "@/lib/overworld/world";
import type { Atlas, OverworldAssets } from "./assets";

/** Draw the overworld at native pixel resolution (the canvas is scaled up with nearest-neighbour by CSS). */
export function drawWorld(
  ctx: CanvasRenderingContext2D, a: OverworldAssets, w: World, viewW: number, viewH: number, timeMs: number,
): void {
  const { map } = w;
  const pos = renderPos(w);
  const cam = cameraFor(map, pos.x, pos.y, viewW, viewH);
  const ox = Math.round(cam.x * TILE);
  const oy = Math.round(cam.y * TILE);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#0b0f1e";
  ctx.fillRect(0, 0, viewW * TILE, viewH * TILE);

  const x0 = Math.max(0, Math.floor(cam.x));
  const y0 = Math.max(0, Math.floor(cam.y));
  const x1 = Math.min(map.width - 1, Math.ceil(cam.x + viewW));
  const y1 = Math.min(map.height - 1, Math.ceil(cam.y + viewH));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const name = map.tiles[y][x];
      const fs = a.tiles.frames[name];
      ctx.drawImage(fs[loopFrame(fs.length, a.tiles.frameMs[name] ?? 500, timeMs)], x * TILE - ox, y * TILE - oy);
    }
  }

  // Characters, back to front so lower ones overlap higher ones.
  const draws: Array<{ y: number; draw: () => void }> = [];
  const put = (atlas: Atlas, anim: string, frame: number, tx: number, ty: number) =>
    draws.push({ y: ty, draw: () => ctx.drawImage(atlas.frames[anim][frame], Math.round(tx * TILE - ox), Math.round(ty * TILE - oy - (atlas.h - TILE))) });
  for (const n of map.npcs) {
    const atlas = a.characters[n.sprite];
    if (atlas) put(atlas, `idle-${w.npcFacing[n.id] ?? n.facing}`, 0, n.x, n.y);
  }
  const pose = walkPose(w.player.facing, w.walk !== null, pos.progress, w.parity);
  put(a.characters.trainer, pose.anim, pose.frame, pos.x, pos.y);
  draws.sort((p, q) => p.y - q.y).forEach((d) => d.draw());

  const f = fadeAlpha(w);
  if (f > 0) {
    ctx.fillStyle = `rgba(6,9,18,${f})`;
    ctx.fillRect(0, 0, viewW * TILE, viewH * TILE);
  }
}

/** Tile under a canvas pixel (for tap-to-move). */
export function tileAtPixel(w: World, viewW: number, viewH: number, px: number, py: number): { x: number; y: number } {
  const pos = renderPos(w);
  const cam = cameraFor(w.map, pos.x, pos.y, viewW, viewH);
  return {
    x: Math.floor((px + Math.round(cam.x * TILE)) / TILE),
    y: Math.floor((py + Math.round(cam.y * TILE)) / TILE),
  };
}
