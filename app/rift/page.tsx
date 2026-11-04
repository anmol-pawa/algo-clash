import type { Metadata } from "next";
import RiftScreen from "@/components/RiftScreen";

export const metadata: Metadata = { title: "Daily Rift" };

export default function RiftPage() {
  return <RiftScreen />;
}
