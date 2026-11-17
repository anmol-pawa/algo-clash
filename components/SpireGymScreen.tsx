"use client";

import { GymRunner, type GymConfig } from "@/components/GymScreen";
import { spireGymKits } from "@/content/gyms/kitsR6";
import { ironStackRules, stackspireGym } from "@/content/gyms/r6";
import { buildSentinel } from "@/game/sprites/sentinel";

const SPIRE: GymConfig = {
  gym: stackspireGym, kits: spireGymKits, buildLeader: buildSentinel, scene: "spire-gym", region: "stackspire",
  signatureRules: ironStackRules, placeName: "the Sentinel's gate", challenge: "the Sentinel",
};

/** The Stackspire Sentinel's gym (GDD §5.5): blitz, Heat Wave, then Ledger Fold under the Iron stack rule. */
export default function SpireGymScreen() {
  return <GymRunner config={SPIRE} />;
}
