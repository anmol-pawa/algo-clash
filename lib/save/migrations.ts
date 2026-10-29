import { SAVE_VERSION, sanitizeCore, type CoreSave } from "./schema";

type Json = Record<string, unknown>;

/**
 * Each entry upgrades a save from version `n` to `n + 1`. Add a new entry (never edit an old one)
 * whenever `SAVE_VERSION` is bumped, and add a fixture test.
 */
const MIGRATIONS: Record<number, (save: Json) => Json> = {
  // v0 (pre-release prototype) kept `player`, `coins` and a plain `solved` id list.
  0: (s) => {
    const player = (s.player && typeof s.player === "object" ? s.player : {}) as Json;
    const mastery: Record<string, unknown> = {};
    if (Array.isArray(s.solved)) {
      for (const id of s.solved) {
        if (typeof id === "string") mastery[id] = { state: "solved", solves: 1 };
      }
    }
    return {
      version: 1,
      profile: { name: player.name, level: player.level, xp: player.xp, bits: s.coins },
      party: s.party,
      mastery,
      settings: s.settings,
      flags: s.flags,
    };
  },
};

export class SaveVersionError extends Error {}

/** Upgrades any known-version save to the current schema, then sanitises it. Throws on a newer version. */
export function migrateCore(raw: unknown, now: number): CoreSave {
  if (!raw || typeof raw !== "object") throw new Error("Save data is not an object");
  let save = raw as Json;
  let v = typeof save.version === "number" && Number.isInteger(save.version) ? save.version : 0;
  if (v > SAVE_VERSION) throw new SaveVersionError(`Save is from a newer game version (${v} > ${SAVE_VERSION})`);
  if (v < 0) v = 0;
  for (; v < SAVE_VERSION; v++) {
    const step = MIGRATIONS[v];
    if (!step) throw new SaveVersionError(`No migration from save version ${v}`);
    save = step(save);
  }
  return sanitizeCore(save, now);
}
