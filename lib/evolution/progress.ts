/** Evolution stage per species, kept in the core save's `flags` (no schema change). Pure and idempotent. */
import type { CoreSave } from "../save/schema";

export const stageFlag = (speciesId: string): string => `stage:${speciesId}`;

export function speciesStage(core: CoreSave, speciesId: string): number {
  const v = core.flags[stageFlag(speciesId)];
  return typeof v === "number" && v >= 1 ? Math.floor(v) : 1;
}

/** Raises the stage to at least `stage`; never lowers it. */
export function applyEvolution(core: CoreSave, speciesId: string, stage: number): CoreSave {
  if (speciesStage(core, speciesId) >= stage) return core;
  return { ...core, flags: { ...core.flags, [stageFlag(speciesId)]: stage } };
}
