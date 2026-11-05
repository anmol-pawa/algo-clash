/** Camera and sprite-frame choice for the overworld renderer. Pure. */
import type { Dir } from "./map";

/** Top-left of the camera in tiles so the player stays centred, clamped to the map (centred if smaller than the view). */
export function cameraFor(
  map: { width: number; height: number }, px: number, py: number, viewW: number, viewH: number,
): { x: number; y: number } {
  const axis = (p: number, size: number, view: number) =>
    size <= view ? (size - view) / 2 : Math.min(Math.max(p + 0.5 - view / 2, 0), size - view);
  return { x: axis(px, map.width, viewW), y: axis(py, map.height, viewH) };
}

/** Sheet animation name + frame index for a walker. Foot alternates per tile; mid-step shows the stride. */
export function walkPose(dir: Dir, walking: boolean, progress: number, parity: 0 | 1): { anim: string; frame: number } {
  if (!walking) return { anim: `idle-${dir}`, frame: 0 };
  const stride = progress > 0.12 && progress < 0.88;
  return { anim: `walk-${dir}`, frame: stride ? (parity === 1 ? 1 : 3) : 0 };
}

/** Frame index of a looping animation at time `ms`. */
export function loopFrame(frames: number, frameMs: number, ms: number): number {
  return frames <= 1 ? 0 : Math.floor(ms / frameMs) % frames;
}
