"use client";

import { GymRunner, type GymConfig } from "@/components/GymScreen";
import { atollGymKits } from "@/content/gyms/kitsR2";
import { arrayAtollGym, dryTideRules } from "@/content/gyms/r2";
import { buildTidecaller } from "@/game/sprites/tidecaller";

const ATOLL: GymConfig = {
  gym: arrayAtollGym, kits: atollGymKits, buildLeader: buildTidecaller, scene: "atoll-gym", region: "array-atoll",
  signatureRules: dryTideRules, placeName: "the tide gym", challenge: "Mira",
};

/** Tidecaller Mira's gym on Array Atoll (GDD §5.5): blitz, Exact Stretches, then Tide Pools under the Dry tide rule. */
export default function AtollGymScreen() {
  return <GymRunner config={ATOLL} />;
}
