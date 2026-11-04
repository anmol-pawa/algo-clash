import type { Metadata } from "next";
import LessonsScreen from "@/components/LessonsScreen";

export const metadata: Metadata = { title: "The Academy" };

export default function LearnPage() {
  return <LessonsScreen />;
}
