import Link from "next/link";

export default function Play() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-4xl text-[var(--accent)]">Mainville</h1>
      <p className="panel p-4 text-white/70">The overworld is under construction. Professor Iota is still unpacking.</p>
      <Link href="/" className="text-sm text-white/80 underline">
        Back to the title
      </Link>
    </main>
  );
}
