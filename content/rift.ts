import type { RiftCatalog } from "@/lib/rift";
import { gymKits } from "./gyms/kits";
import { allCards } from "./cards";
import { meta as squash } from "./problems/R0/run-squash/meta";
import { meta as step } from "./problems/R0/step-counter/meta";
import type { ProblemMeta } from "@/lib/content/types";

/** Problems that have a playable battle kit (the Rift only schedules what it can run). */
const metas: ProblemMeta[] = [squash, step];
export const riftMetas: Record<string, ProblemMeta> = Object.fromEntries(metas.filter((m) => gymKits[m.id]).map((m) => [m.id, m]));

export const riftCatalog: RiftCatalog = {
  problems: Object.values(riftMetas).map((m) => ({ id: m.id, region: m.region, difficulty: m.difficulty, prerequisites: m.prerequisites })),
  // Compiler-error cards are Team Undefined's bug-hunt encounters (room 4).
  cards: allCards.map((c) => ({ id: c.id, region: c.region, debug: c.kind === "compilerError" })),
};
