import type { Metadata } from "next";
import JournalScreen from "@/components/JournalScreen";

export const metadata: Metadata = { title: "Solution Journal" };

export default function JournalPage() {
  return <JournalScreen />;
}
