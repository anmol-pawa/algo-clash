import { starterFor } from "@/lib/judge/starter";
import type { GymDef } from "@/lib/gym/types";
import type { BattleScene } from "@/components/BattleStage";
import { problemCatalog } from "./catalog";
import { gymKits, type GymKit } from "./kits";
import { syntaxShoresGym } from "./r0";
import { arrayAtollGym } from "./r2";

/** Everything the gym screen needs to run one region's gym. */
export interface GymConfig {
  def: GymDef;
  /** Page slug under /gym/ ("" is the Syntax Shores gym at /gym/). */
  slug: string;
  scene: BattleScene;
  /** Battle kits by problem id (statement, starter, spec, lazy tests). */
  kits: Record<string, GymKit>;
  /** clang flags for the signature round (the gym twist). */
  signatureFlags: string[];
  /** Structling evolution checkpoint on the first win, if any. */
  evolveOnFirstWin: boolean;
  startLabel: string;
  /** Label of the button after the last blitz item. */
  doneLabel: string;
  /** Shown when the player retreats. */
  loseNote: string;
}

function kitFromCatalog(id: string, foeName: string, foeLevel: number): GymKit {
  const p = problemCatalog[id];
  return {
    title: p.meta.title, difficulty: p.meta.difficulty, foeName, foeLevel,
    statement: p.statement, starter: starterFor(p.meta.spec), spec: p.meta.spec, timeLimitMs: p.meta.timeLimitMs, loadTests: p.loadTests,
  };
}

export const gymConfigs: GymConfig[] = [
  {
    def: syntaxShoresGym, slug: "", scene: "gym", kits: gymKits, evolveOnFirstWin: true,
    signatureFlags: ["-O2", "-Wall", "-Wextra", "-Werror"],
    startLabel: "Challenge the Warden ▶", doneLabel: "To the lighthouse ▶",
    loseNote: "You retreated from the lighthouse. The badge waits; the blitz starts fresh next time.",
  },
  {
    def: arrayAtollGym, slug: "atoll", scene: "atoll-gym", evolveOnFirstWin: false,
    kits: {
      "exact-stretches": kitFromCatalog("exact-stretches", "Tidecaller Mira", 14),
      "tide-pools": kitFromCatalog("tide-pools", "Tidecaller Mira", 17),
    },
    signatureFlags: ["-O2", "-Wall", "-Wextra", "-Wshadow", "-Wconversion", "-Wno-sign-conversion", "-Werror"],
    startLabel: "Challenge Mira ▶", doneLabel: "To the tide staff ▶",
    loseNote: "You walked back along the boardwalk. The badge waits; the blitz starts fresh next time.",
  },
];

export const gymBySlug = (slug: string): GymConfig | undefined => gymConfigs.find((g) => g.slug === slug);
