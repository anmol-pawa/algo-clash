/** Party and move loadouts (GDD §5.2): pure, immutable helpers over the core save. */
import type { ScrollProgress } from "../forge/types";
import type { CoreSave } from "../save/schema";

export const MAX_PARTY = 6;
export const MAX_MOVES = 4;
export const STARTER_ID = "arrayling";

/** An empty party means the starter has not been recorded yet; the player always has the starter. */
export const partyOf = (core: Pick<CoreSave, "party">): string[] => (core.party.length > 0 ? core.party : [STARTER_ID]);

/** A move can be equipped once its scroll's Blank tier has passed ("Inscribed", GDD §3). */
export const isLearned = (forge: Record<string, ScrollProgress>, moveId: string): boolean => forge[moveId]?.passed.includes("blank") === true;

export const learnedMoveIds = (forge: Record<string, ScrollProgress>, allMoveIds: readonly string[]): string[] => allMoveIds.filter((id) => isLearned(forge, id));

export type EquipResult = { ok: true; core: CoreSave } | { ok: false; reason: "unlearned" | "full" | "unknown-structling" };

export function equipMove(core: CoreSave, structlingId: string, moveId: string): EquipResult {
  if (!partyOf(core).includes(structlingId)) return { ok: false, reason: "unknown-structling" };
  if (!isLearned(core.forge, moveId)) return { ok: false, reason: "unlearned" };
  const cur = core.loadouts[structlingId] ?? [];
  if (cur.includes(moveId)) return { ok: true, core };
  if (cur.length >= MAX_MOVES) return { ok: false, reason: "full" };
  return { ok: true, core: { ...core, loadouts: { ...core.loadouts, [structlingId]: [...cur, moveId] } } };
}

export function unequipMove(core: CoreSave, structlingId: string, moveId: string): CoreSave {
  const cur = core.loadouts[structlingId];
  if (!cur || !cur.includes(moveId)) return core;
  return { ...core, loadouts: { ...core.loadouts, [structlingId]: cur.filter((m) => m !== moveId) } };
}

/** Equipped moves that are still learned (a reset forge can never leave a ghost move equipped). */
export const equippedMoves = (core: CoreSave, structlingId: string): string[] => (core.loadouts[structlingId] ?? []).filter((m) => isLearned(core.forge, m));
