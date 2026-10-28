import Link from "next/link";

export default function TitleScreen() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-8 px-4 py-10 text-center">
      <div>
        <p className="font-display text-sm tracking-[0.3em] text-white/50">THE C++ INTERVIEW CREATURE RPG</p>
        <h1 className="mt-3 font-display text-6xl leading-none text-[var(--accent)] sm:text-7xl" style={{ textShadow: "0 4px 0 #0b0d1a, 0 0 24px rgba(126,224,161,.35)" }}>
          ALGO
          <br />
          CLASH
        </h1>
      </div>
      <div className="px-window w-full p-5 text-left text-sm leading-relaxed text-white/80">
        Recognise the pattern. Pick the data structure. <span className="text-[var(--accent)]">Write the C++ by hand.</span> A real compiler judges every spell.
      </div>
      <nav className="flex w-full flex-col gap-3" aria-label="Main menu">
        <Link href="/play" className="px-btn px-btn-primary text-lg">
          <span className="blink mr-2">▶</span> START
        </Link>
      </nav>
      <p className="text-xs text-white/40">Installable and offline-ready once loaded. Add to Home Screen on iPhone.</p>
    </main>
  );
}
