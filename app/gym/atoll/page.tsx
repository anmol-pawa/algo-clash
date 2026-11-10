import type { Metadata } from "next";
import AtollGymScreen from "@/components/AtollGymScreen";

export const metadata: Metadata = { title: "Tidecaller Gym" };

export default function AtollGymPage() {
  return <AtollGymScreen />;
}
