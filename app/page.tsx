import Link from "next/link";
import { GAME } from "@/lib/meta";

export default function Title() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-display text-6xl leading-none text-[var(--accent)] sm:text-7xl">{GAME.name}</h1>
      <p className="text-white/70">{GAME.tagline}</p>
      <ol className="panel w-full space-y-1 p-4 text-left font-display text-xl">
        {GAME.steps.map((s, i) => (
          <li key={s}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>
      <Link href="/play" className="btn-pixel">
        PRESS START
      </Link>
    </main>
  );
}
