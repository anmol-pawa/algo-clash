import Link from "next/link";

export const metadata = { title: "Play — Algo Clash" };

/** Placeholder world screen; the overworld engine arrives in roadmap B2. */
export default function Play() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="panel w-full px-4 py-10">
        <p className="font-display text-3xl text-[var(--gold)]">Mainville</p>
        <p className="mt-3 text-sm text-white/60">The world is still being built. Professor Iota will be here soon.</p>
      </div>
      <Link href="/" className="px-btn flex items-center px-5 text-sm">
        Back to title
      </Link>
    </main>
  );
}
