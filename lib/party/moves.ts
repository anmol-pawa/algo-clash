import type { CoreSave } from "../save/schema";
import { emptyProgress, scrollStatus } from "../forge/progress";
import { isLessonDone } from "../lessons/progress";
import { patternMastery, type PatternItem } from "../srs/aggregate";
import { MAX_LOADOUT, MAX_PARTY, type MoveDef, type MoveStatus, type SpeciesDef } from "./types";
import { speciesStage } from "../evolution/progress";

export const loadoutFlag = (structlingId: string): string => `loadout:${structlingId}`;

/**
 * Where a move stands. A move is *known* once its lesson is read and its scroll inscribed (Blank tier passed once);
 * starters are always known. Both requirements are checked, lesson first, so the player is told what is missing.
 */
export function moveStatus(core: Pick<CoreSave, "flags" | "forge">, move: MoveDef, parOf: (scrollId: string) => number): MoveStatus {
  if (move.starter) return "known";
  if (!move.scrollId) return "sealed";
  if (move.lessonId && !isLessonDone(core, move.lessonId)) return "needs-lesson";
  const status = scrollStatus(core.forge[move.scrollId] ?? emptyProgress(), parOf(move.scrollId));
  return status === "inscribed" || status === "ingrained" ? "known" : "needs-scroll";
}

export function knownMoves(core: Pick<CoreSave, "flags" | "forge">, moves: readonly MoveDef[], parOf: (scrollId: string) => number): MoveDef[] {
  return moves.filter((m) => moveStatus(core, m, parOf) === "known");
}

/** The party the player actually has: the saved list, or the starter alone for a fresh save. */
export function effectiveParty(core: Pick<CoreSave, "party">, starterId = "arrayling"): string[] {
  return core.party.length > 0 ? core.party.slice(0, MAX_PARTY) : [starterId];
}

function parseLoadout(v: unknown): string[] {
  return typeof v === "string" && v ? v.split(",").filter(Boolean) : [];
}

/** The equipped move ids of a Structling: known, distinct, at most four, in slot order. Stale entries drop out silently. */
export function getLoadout(core: Pick<CoreSave, "flags">, structlingId: string, known: ReadonlySet<string>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of parseLoadout(core.flags[loadoutFlag(structlingId)])) {
    if (!known.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length === MAX_LOADOUT) break;
  }
  return out;
}

function withLoadout(core: CoreSave, structlingId: string, ids: string[]): CoreSave {
  return { ...core, flags: { ...core.flags, [loadoutFlag(structlingId)]: ids.join(",") } };
}

/** Equips a known move into the next free slot. Returns the same save when it cannot (unknown, duplicate or all four slots full). */
export function equipMove(core: CoreSave, structlingId: string, moveId: string, known: ReadonlySet<string>): CoreSave {
  if (!known.has(moveId)) return core;
  const cur = getLoadout(core, structlingId, known);
  if (cur.includes(moveId) || cur.length >= MAX_LOADOUT) return core;
  return withLoadout(core, structlingId, [...cur, moveId]);
}

export function unequipMove(core: CoreSave, structlingId: string, moveId: string, known: ReadonlySet<string>): CoreSave {
  const cur = getLoadout(core, structlingId, known);
  if (!cur.includes(moveId)) return core;
  return withLoadout(core, structlingId, cur.filter((m) => m !== moveId));
}

/** A new Structling starts with every known move it can carry, so a fresh player is never empty-handed. */
export function autoLoadout(core: CoreSave, structlingId: string, known: readonly MoveDef[]): CoreSave {
  if (core.flags[loadoutFlag(structlingId)] !== undefined) return core;
  return withLoadout(core, structlingId, known.slice(0, MAX_LOADOUT).map((m) => m.id));
}

/** Mastery of a move (0..1): the weighted mean over catalog problems that carry its pattern. */
export function moveMastery(move: MoveDef, items: ReadonlyArray<PatternItem & { patterns: readonly string[] }>, core: Pick<CoreSave, "mastery">, now: number): number {
  return patternMastery(items.filter((i) => i.patterns.includes(move.patternId)), core.mastery, now);
}

/** Structling level = average mastery of its equipped moves × 10 (GDD §6.1), one decimal. No moves means level 0. */
export function partyLevel(masteries: readonly number[]): number {
  if (masteries.length === 0) return 0;
  return Math.round((masteries.reduce((a, b) => a + b, 0) / masteries.length) * 100) / 10;
}

export type DexState = "owned" | "seen" | "unknown";

/** Structdex entry state. Evolved forms count as owned once the player's line reaches that stage. */
export function dexState(core: CoreSave, sp: SpeciesDef, byId: ReadonlyMap<string, SpeciesDef>): DexState {
  if (!sp.evolvesFrom) return sp.hasSprite ? "owned" : "unknown";
  const base = byId.get(sp.evolvesFrom);
  if (!base) return "unknown";
  if (speciesStage(core, base.id) >= (sp.stage ?? 2)) return "owned";
  return dexState(core, base, byId) === "owned" ? "seen" : "unknown";
}
