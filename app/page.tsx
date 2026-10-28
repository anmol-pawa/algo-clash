import Link from "next/link";

export default function TitleScreen() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 text-center">
      <div>
        <h1 className="font-display text-6xl leading-none text-[var(--accent)] sm:text-8xl">ALGO CLASH</h1>
        <p className="mt-3 font-display text-xl text-white/70">Catch Structlings. Crack interviews.</p>
      </div>
      <p className="panel max-w-md p-4 text-sm text-white/80">
        Every battle is a real interview problem. Spot the pattern, pick the data structure, and write the C++ by hand.
      </p>
      <Link href="/play/" className="pixel-btn">
        START
      </Link>
    </main>
  );
}
