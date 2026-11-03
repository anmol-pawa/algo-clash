import type { Metadata } from "next";
import ForgeScreen from "@/components/ForgeScreen";

export const metadata: Metadata = { title: "The Forge" };

export default function ForgePage() {
  return <ForgeScreen />;
}
