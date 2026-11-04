/** Structdex helpers (GDD §5.1): pure, over species data passed in. */
import { speciesStage } from "../evolution/progress";
import type { CoreSave } from "../save/schema";

export interface SpeciesLike {
  id: string;
  stage: number;
  from?: string;
}

/** The forms of an evolution line, root first. */
export function lineOf<T extends SpeciesLike>(rootId: string, all: readonly T[]): T[] {
  const out: T[] = [];
  let cur = all.find((s) => s.id === rootId);
  while (cur) {
    out.push(cur);
    const id: string = cur.id;
    cur = all.find((s) => s.from === id);
  }
  return out;
}

/** The form a party member currently shows: the highest stage of its line that it has reached. */
export function currentForm<T extends SpeciesLike>(core: CoreSave, rootId: string, all: readonly T[]): T | undefined {
  const stage = speciesStage(core, rootId);
  const line = lineOf(rootId, all);
  return [...line].reverse().find((s) => s.stage <= stage) ?? line[0];
}

export type DexStatus = "seen" | "unseen";

/** A species is entered in the Structdex once the player has held that form. */
export function dexStatus<T extends SpeciesLike>(core: CoreSave, species: T, all: readonly T[]): DexStatus {
  const root = lineOf(species.from ? rootOf(species, all).id : species.id, all);
  const rootId = root[0]?.id ?? species.id;
  const owned = (core.party.length > 0 ? core.party : ["arrayling"]).includes(rootId);
  return owned && speciesStage(core, rootId) >= species.stage ? "seen" : "unseen";
}

function rootOf<T extends SpeciesLike>(s: T, all: readonly T[]): T {
  let cur = s;
  while (cur.from) {
    const p = all.find((x) => x.id === cur.from);
    if (!p) break;
    cur = p;
  }
  return cur;
}
