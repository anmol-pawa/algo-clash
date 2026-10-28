import Link from "next/link";

const SNIPPETS = ["vector<int>", "unordered_map", "priority_queue", "two pointers", "dp[i][j]", "BFS", "binary search", "union-find", "monotonic stack", "trie"];

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-12 text-center">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative flex max-w-2xl flex-col items-center">
        <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/50">C++ · Patterns · Interviews</div>
        <h1 className="px-shadow mt-3 font-display text-[44px] leading-none tracking-[0.06em] min-[400px]:text-6xl sm:text-8xl">
          <span className="text-white">ALGO</span>
          <span className="text-[var(--accent)]">CLASH</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">
          Every battle is a real interview problem. <span className="text-white">Recognise the pattern, pick the data structure, write the C++ by hand.</span>
        </p>
        <Link
          href="/play/"
          data-testid="start"
          className="px-btn px-btn-primary mt-10 inline-flex min-h-[48px] items-center px-8 text-lg font-bold tracking-[0.25em] text-[#070b14]"
        >
          START ▸
        </Link>
        <div className="mt-12 flex flex-wrap justify-center gap-2" aria-hidden>
          {SNIPPETS.map((t) => (
            <span key={t} className="rounded border border-white/10 px-2 py-1 font-mono text-xs text-white/35">
              {t}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
