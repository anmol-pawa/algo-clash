import Link from "next/link";

export default function Play() {
  return (
    <main data-testid="play" className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="font-display text-3xl tracking-wider text-[var(--accent)]">Mainville</h1>
      <p className="max-w-md text-white/60">The overworld is under construction. Professor Iota is still unpacking.</p>
      <Link href="/" className="px-btn inline-flex min-h-[44px] items-center px-5 text-sm text-white/80">
        ◂ Title
      </Link>
    </main>
  );
}
