import type { Metadata } from "next";
import CardScreen from "@/components/CardScreen";

export const metadata: Metadata = { title: "Trainer Card" };

export default function CardPage() {
  return <CardScreen />;
}
