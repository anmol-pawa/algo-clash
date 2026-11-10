import type { Metadata } from "next";
import GymScreen from "@/components/GymScreen";

export const metadata: Metadata = { title: "Tidecaller Gym" };

export default function AtollGymPage() {
  return <GymScreen slug="atoll" />;
}
