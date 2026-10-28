import Link from "next/link";

export default function PlayPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-display text-4xl text-[var(--accent)]">THE WORLD AWAITS</h1>
      <p className="panel max-w-md p-4 text-sm text-white/80">The overworld is under construction. Check back soon.</p>
      <Link href="/" className="pixel-btn">
        BACK
      </Link>
    </main>
  );
}
