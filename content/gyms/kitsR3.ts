import { kitFromCatalog } from "./kitsR2";
import type { GymKit } from "./kits";

/** Pane Warden Sorrel's two battles: a medium (variable window) and a hard (monotonic deque, Shrinking pane twist). */
export const woodsGymKits: Record<string, GymKit> = {
  "tidy-tape": kitFromCatalog("tidy-tape", "Pane Warden Sorrel", 26),
  "pane-peaks": kitFromCatalog("pane-peaks", "Pane Warden Sorrel", 30),
};
