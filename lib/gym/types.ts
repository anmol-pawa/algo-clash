/** Gym battles (GDD §5.5): a recognition blitz, a core medium and a signature mechanic. */
export interface BlitzItem {
  id: string;
  /** Original two-or-three sentence problem statement; the player names the tool or pattern. */
  statement: string;
  /** Option ids, exactly one correct. */
  options: string[];
  answer: string;
  /** One line shown after answering. */
  why: string;
  /** True for the interleaved items from earlier regions or earlier topics. */
  review?: boolean;
}

/** Unique per-gym rule (GDD §5.5). Data only here; the judge/battle UI applies it. */
export interface GymTwist {
  id: string;
  title: string;
  /** What the player is told before the signature phase. */
  rule: string;
  /** What real skill it teaches. */
  teaches: string;
}

export interface GymDef {
  id: string;
  region: string;
  name: string;
  /** The gym leader (sprite lives in game/sprites). */
  leader: { id: string; name: string; title: string; lines: { intro: string; win: string; lose: string } };
  badge: { id: string; name: string };
  blitz: BlitzItem[];
  /** Seconds allowed per blitz item. */
  blitzSeconds: number;
  /** Phase 2: a judged problem package (`content/problems/<region>/<id>`). */
  coreProblemId: string;
  /** Phase 3: a harder problem or a follow-up variant of the core one. */
  signatureProblemId: string;
  twist: GymTwist;
}

export type GymPhase = "blitz" | "core" | "signature" | "won" | "abandoned";

export interface BlitzAnswer {
  itemId: string;
  choice: string | null;
  seconds: number;
  correct: boolean;
}

export interface GymState {
  gymId: string;
  phase: GymPhase;
  blitzIndex: number;
  /** The foe's shield: a correct blitz answer breaks a point, a miss regenerates one. */
  shield: number;
  answers: BlitzAnswer[];
  /** Fainted attempts per battle phase (the phase can be retried; the blitz is kept). */
  coreFaints: number;
  signatureFaints: number;
  /** Set when the gym is won. */
  reward: { badge: string; shards: number } | null;
}
