import Link from "next/link";

const MENU = [
  { href: "/play/", label: "NEW GAME", hint: "Begin in Mainville" },
] as const;

export default function Title() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-8 px-4 py-10 text-center">
      <header>
        <p className="font-display text-sm tracking-[0.3em] text-white/50">DATA STRUCTURES &amp; ALGORITHMS</p>
        <h1 className="font-display text-6xl leading-none text-[var(--accent)] drop-shadow-[0_4px_0_#0e0f1a] sm:text-7xl">
          ALGO
          <br />
          CLASH
        </h1>
        <p className="mt-4 text-sm text-white/60">Every battle is a real interview problem. Recognise the pattern, pick the structure, write the C++.</p>
      </header>
      <nav aria-label="Main menu" className="flex w-full flex-col gap-3">
        {MENU.map((m) => (
          <Link key={m.href} href={m.href} className="px-menu-item flex min-h-14 flex-col items-center justify-center px-4 py-2">
            <span className="font-display text-xl">{m.label}</span>
            <span className="text-xs text-white/50">{m.hint}</span>
          </Link>
        ))}
      </nav>
      <p className="text-xs text-white/30">Work in progress · C++ runs in your browser</p>
    </main>
  );
}
