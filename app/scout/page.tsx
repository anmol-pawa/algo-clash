import type { Metadata } from "next";
import ScoutScreen from "@/components/ScoutScreen";

export const metadata: Metadata = { title: "Scout School" };

export default function ScoutPage() {
  return <ScoutScreen />;
}
