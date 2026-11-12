"use client";

import { GymRunner, type GymConfig } from "@/components/GymScreen";
import { harborGymKits } from "@/content/gyms/kitsR4";
import { hashFloodRules, hashwoodHarborGym } from "@/content/gyms/r4";
import { buildHydra } from "@/game/sprites/hydra";

const HARBOR: GymConfig = {
  gym: hashwoodHarborGym, kits: harborGymKits, buildLeader: buildHydra, scene: "harbor-gym", region: "hashwood-harbor",
  signatureRules: hashFloodRules, placeName: "the Hydra's warehouse", challenge: "the Hydra",
};

/** The Hydra of Hashwood's gym (GDD §5.5): blitz, Echo Strand, then Longest Echo under the Hash flood rule. */
export default function HarborGymScreen() {
  return <GymRunner config={HARBOR} />;
}
