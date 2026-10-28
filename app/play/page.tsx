import Link from "next/link";

export const metadata = { title: "Play — Algo Clash" };

export default function Play() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="px-window w-full p-6">
        <h1 className="font-display text-3xl text-[var(--accent)]">MAINVILLE</h1>
        <p className="mt-3 text-sm text-white/70">The overworld is under construction. Professor Iota is still unpacking the lab.</p>
      </div>
      <Link href="/" className="px-btn inline-flex min-h-11 items-center px-5 text-white/90">
        Back to title
      </Link>
    </main>
  );
}
