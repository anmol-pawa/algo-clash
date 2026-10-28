import Link from "next/link";

const PILLARS = [
  ["Recognise", "Read a problem and name the pattern on sight."],
  ["Choose", "Pick the data structure and state its complexity."],
  ["Write", "Type the C++ by hand and let a real compiler judge it."],
] as const;

export default function Title() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-8 px-4 py-10 text-center">
      <div>
        <h1 className="font-display text-6xl leading-none text-[var(--accent)] neon-text sm:text-7xl">
          ALGO
          <br />
          CLASH
        </h1>
        <p className="mt-4 font-mono text-sm text-white/60">{"{ every battle is an interview problem }"}</p>
      </div>
      <ul className="panel w-full divide-y divide-white/10 text-left">
        {PILLARS.map(([name, text]) => (
          <li key={name} className="flex gap-3 px-4 py-3">
            <span className="font-display w-24 shrink-0 text-lg text-[var(--gold)]">{name}</span>
            <span className="text-sm text-white/75">{text}</span>
          </li>
        ))}
      </ul>
      <Link href="/play/" className="px-btn px-btn-primary flex w-full max-w-xs items-center justify-center text-2xl">
        START
      </Link>
      <p className="text-xs text-white/40">C++17 · LeetCode medium → hard · works offline once loaded</p>
    </main>
  );
}
