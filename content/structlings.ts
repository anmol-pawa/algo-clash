/** Structling species for the Structdex (GDD §5.1). Sprites live in `game/sprites/`. */
export interface Species {
  id: string;
  name: string;
  /** The data structure the design embodies. */
  structure: string;
  /** Evolution stage, 1-based. */
  stage: number;
  /** Species this evolves from, if any. */
  from?: string;
  blurb: string;
}

export const SPECIES: readonly Species[] = [
  { id: "arrayling", name: "Arrayling", structure: "Array", stage: 1, blurb: "A segmented body where every plate has a number. It finds any plate in one step, but loves to stay in order." },
  { id: "vectorling", name: "Vectorling", structure: "Dynamic array (vector)", stage: 2, from: "arrayling", blurb: "Grows a fresh plate whenever it runs out of room, and doubles its length so growing stays cheap on average." },
];

export const speciesById = (id: string): Species | undefined => SPECIES.find((s) => s.id === id);
