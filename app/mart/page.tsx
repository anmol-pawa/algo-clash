import type { Metadata } from "next";
import MartScreen from "@/components/MartScreen";

export const metadata: Metadata = { title: "Mart" };

export default function MartPage() {
  return <MartScreen />;
}
