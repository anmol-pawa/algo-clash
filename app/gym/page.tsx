import type { Metadata } from "next";
import GymScreen from "@/components/GymScreen";

export const metadata: Metadata = { title: "Syntax Shores Gym" };

export default function GymPage() {
  return <GymScreen />;
}
