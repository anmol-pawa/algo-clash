/** Party, moves and the Structdex (GDD §5.2). Pure data and rules; the screen lives in components/PartyScreen.tsx. */

export const MAX_PARTY = 6;
export const MAX_LOADOUT = 4;

export interface SpeciesDef {
  id: string;
  name: string;
  /** The data structure it embodies (shown even before it is discovered, as a hint). */
  embodies: string;
  /** Region where it is first met (CUR §3). */
  region: string;
  /** Evolution line: the species this one evolves into / from, if any. */
  evolvesFrom?: string;
  /** Needs this stage (see lib/evolution) of `evolvesFrom` to count as discovered. */
  stage?: number;
  /** Has finished art in game/sprites. Others show as silhouettes. */
  hasSprite: boolean;
}

export interface MoveDef {
  /** Unique, kebab-case. */
  id: string;
  name: string;
  /** Pattern id in content/patterns.ts, used for mastery and the type chart. */
  patternId: string;
  blurb: string;
  /** Known from the start (no lesson, no scroll). */
  starter?: boolean;
  /** Lesson that must be read first (GDD §5.2). */
  lessonId?: string;
  /** Scroll to inscribe at the Forge. A move with neither starter nor scroll is "sealed" (not written yet). */
  scrollId?: string;
}

export type MoveStatus = "known" | "needs-lesson" | "needs-scroll" | "sealed";
