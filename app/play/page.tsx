import Link from "next/link";
import { Overworld } from "@/components/Overworld";

export const metadata = { title: "Play — Algo Clash" };

export default function Play() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center gap-3 px-3 py-3">
      <Overworld />
      <Link href="/" className="px-btn flex items-center px-5 text-sm">
        Back to title
      </Link>
    </main>
  );
}
