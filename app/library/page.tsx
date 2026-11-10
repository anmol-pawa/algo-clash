import type { Metadata } from "next";
import LibraryScreen from "@/components/LibraryScreen";

export const metadata: Metadata = { title: "Library" };

export default function LibraryPage() {
  return <LibraryScreen />;
}
