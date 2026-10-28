import Link from "next/link";

export default function TitleScreen() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-8 px-4 py-10 text-center">
      <div>
        <p className="font-display text-sm tracking-widest text-[var(--accent)]">C++ · DSA · INTERVIEW RPG</p>
        <h1 className="font-display mt-2 text-6xl leading-none text-white [text-shadow:0_4px_0_#0e0f1a]">
          ALGO
          <br />
          CLASH
        </h1>
        <p className="mt-4 text-sm text-slate-300">Recognise the pattern. Pick the data structure. Write the C++.</p>
      </div>
      <nav aria-label="Main menu" className="px-window flex w-full flex-col gap-1 p-3">
        <Link href="/play/" className="px-menu-item font-display min-h-11 text-xl">
          START
        </Link>
      </nav>
      <p className="font-display text-xs text-slate-500">v0.1 · work in progress</p>
    </main>
  );
}
