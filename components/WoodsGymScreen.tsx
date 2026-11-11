"use client";

import { GymRunner, type GymConfig } from "@/components/GymScreen";
import { woodsGymKits } from "@/content/gyms/kitsR3";
import { windowWoodsGym } from "@/content/gyms/r3";
import { buildPaneWarden } from "@/game/sprites/paneWarden";

const WOODS: GymConfig = {
  gym: windowWoodsGym, kits: woodsGymKits, buildLeader: buildPaneWarden, scene: "woods-gym", region: "window-woods",
  signatureHalveOnTle: true, placeName: "the pane clearing", challenge: "Sorrel",
};

/** Pane Warden Sorrel's gym in Window Woods (GDD §5.5): blitz, Tidy Tape, then Pane Peaks under the Shrinking pane rule. */
export default function WoodsGymScreen() {
  return <GymRunner config={WOODS} />;
}
