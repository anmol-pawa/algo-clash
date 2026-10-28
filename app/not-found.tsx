import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="font-display text-6xl text-[var(--accent)] neon-text">404</div>
      <p className="text-white/60">Segmentation fault: this route isn&apos;t mapped to any memory.</p>
      <Link href="/" className="px-btn px-btn-primary flex items-center px-5 text-sm">
        Back to the title screen
      </Link>
    </main>
  );
}
