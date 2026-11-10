import { starterFor } from "@/lib/judge/starter";
import { problemCatalog } from "./catalog";
import type { GymKit } from "./kits";

/** Gym kits built from the generated problem catalog, so statement, starter and tests can never drift from the package. */
export function kitFromCatalog(id: string, foeName: string, foeLevel: number): GymKit {
  const p = problemCatalog[id];
  if (!p) throw new Error(`unknown problem ${id}`);
  return {
    title: p.meta.title, difficulty: p.meta.difficulty, foeName, foeLevel,
    statement: p.statement, starter: starterFor(p.meta.spec), spec: p.meta.spec, timeLimitMs: p.meta.timeLimitMs, loadTests: p.loadTests,
  };
}

/** Tidecaller Mira's two battles: a medium (prefix sums + hash map) and a hard (two pointers, Dry tide twist). */
export const atollGymKits: Record<string, GymKit> = {
  "exact-stretches": kitFromCatalog("exact-stretches", "Tidecaller Mira", 18),
  "tide-pools": kitFromCatalog("tide-pools", "Tidecaller Mira", 22),
};
