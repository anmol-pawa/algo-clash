import type { CoreSave } from "@/lib/save/schema";

type Flags = CoreSave["flags"];

/** Dialogue flags are stored in the save as `flag: true`. Returns the set of raised dialogue flags. */
export function flagSet(flags: Flags): Set<string> {
  return new Set(Object.entries(flags).filter(([, v]) => v === true).map(([k]) => k));
}

/** Merge flags raised by a conversation into the save flags without mutating the input. */
export function raiseFlags(flags: Flags, raised: readonly string[]): Flags {
  if (raised.length === 0) return flags;
  const next = { ...flags };
  for (const f of raised) next[f] = true;
  return next;
}
