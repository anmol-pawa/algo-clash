import { allScrolls } from "@/content/scrolls";
import type { Scroll } from "@/lib/forge/types";

/** A move is the pattern a scroll teaches (GDD §5.2). Learned by inscribing the scroll at the Forge. */
export interface Move {
  /** Equals the scroll id. */
  id: string;
  name: string;
  blurb: string;
  scrollId: string;
  /** Problem whose mastery stands for this move in Structling levels. */
  problemId: string;
}

export const moveFromScroll = (s: Scroll): Move => ({ id: s.id, name: s.title.replace(/^Scroll of (the )?/, ""), blurb: s.blurb, scrollId: s.id, problemId: s.problemId });

export const allMoves: Move[] = allScrolls.map(moveFromScroll);
export const moveById = (id: string): Move | undefined => allMoves.find((m) => m.id === id);
