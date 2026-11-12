import type { Metadata } from "next";
import HarborGymScreen from "@/components/HarborGymScreen";

export const metadata: Metadata = { title: "Hydra Gym" };

export default function HarborGymPage() {
  return <HarborGymScreen />;
}
