import { kitFromCatalog } from "./kitsR2";
import type { GymKit } from "./kits";

/** The Hydra's two battles: a medium (rolling 2-bit key) and its hard follow-up (binary search + verified rolling hash, Hash flood twist). */
export const harborGymKits: Record<string, GymKit> = {
  "echo-strand": kitFromCatalog("echo-strand", "Hydra of Hashwood", 30),
  "longest-echo": kitFromCatalog("longest-echo", "Hydra of Hashwood", 34),
};
