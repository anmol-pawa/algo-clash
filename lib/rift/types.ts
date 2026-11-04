import type { Difficulty } from "../content/types";

/** One thing the player can be asked to do inside a room. */
export type RiftItemKind = "problem" | "scroll" | "card" | "debug";

export interface RiftItem {
  id: string;
  kind: RiftItemKind;
  region: string;
  /** Problems and debug encounters carry a difficulty; cards and scrolls usually do not. */
  difficulty?: Difficulty;
  /** Problem ids that should be learned first (from the problem's meta). */
  prerequisites?: string[];
}

/** What the planner may draw from. Callers build it from the content catalogues. */
export interface RiftPool {
  problems: RiftItem[];
  scrolls: RiftItem[];
  cards: RiftItem[];
  /** Team Undefined debugging encounters. Empty until that content exists. */
  debug: RiftItem[];
}

export type RoomId = "reviews" | "blitz" | "frontier" | "debug" | "bonus";

export const ROOM_ORDER: readonly RoomId[] = ["reviews", "blitz", "frontier", "debug", "bonus"];

export interface RiftRoom {
  id: RoomId;
  /** 0-based position, also the bit in the cleared mask. */
  index: number;
  title: string;
  blurb: string;
  /** Optional rooms do not gate the day's completion. */
  optional: boolean;
  items: RiftItem[];
  /** A room with no items (nothing due yet, no content yet) is open for free: it counts as cleared and pays nothing. */
  empty: boolean;
}

export interface RiftPlan {
  /** `YYYY-MM-DD` this plan belongs to. */
  day: string;
  seed: number;
  rooms: RiftRoom[];
}
