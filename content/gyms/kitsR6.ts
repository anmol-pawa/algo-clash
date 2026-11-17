import { kitFromCatalog } from "./kitsR2";
import type { GymKit } from "./kits";

/** The Sentinel's two battles: a medium (monotonic stack of waiting days) and a hard (expression folding under the Iron stack twist). */
export const spireGymKits: Record<string, GymKit> = {
  "heat-wave": kitFromCatalog("heat-wave", "Stackspire Sentinel", 38),
  "ledger-fold": kitFromCatalog("ledger-fold", "Stackspire Sentinel", 42),
};
