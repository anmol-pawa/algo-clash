import type { Card } from "../cards/types";
import type { ProblemMeta } from "../content/types";
import type { Scroll } from "../forge/types";
import type { RiftPool } from "./types";

/** Builds the planner's pool from the content catalogues. Debug encounters arrive with Team Undefined content. */
export function buildPool(problems: readonly ProblemMeta[], scrolls: readonly Pick<Scroll, "id" | "region">[], cards: readonly Card[]): RiftPool {
  return {
    problems: problems.map((p) => ({ id: p.id, kind: "problem", region: p.region, difficulty: p.difficulty, prerequisites: p.prerequisites })),
    scrolls: scrolls.map((s) => ({ id: s.id, kind: "scroll", region: s.region })),
    cards: cards.map((c) => ({ id: c.id, kind: "card", region: c.region })),
    debug: [],
  };
}
