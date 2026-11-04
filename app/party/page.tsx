import type { Metadata } from "next";
import PartyScreen from "@/components/PartyScreen";

export const metadata: Metadata = { title: "Party" };

export default function PartyPage() {
  return <PartyScreen />;
}
