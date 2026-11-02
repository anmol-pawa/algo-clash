import Link from "next/link";
import { WorldCanvas } from "@/components/WorldCanvas";

export const metadata = { title: "Play — Algo Clash" };

export default function Play() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-3 px-3 py-3">
      <WorldCanvas />
      <Link href="/" className="px-btn mx-auto flex items-center px-5 text-sm">
        Back to title
      </Link>
    </main>
  );
}
