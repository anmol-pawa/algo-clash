import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="font-display text-6xl text-[var(--accent)]">404</div>
      <p className="text-white/60">Segmentation fault: this page was never allocated.</p>
      <Link href="/" className="px-btn">
        Back to the title screen
      </Link>
    </main>
  );
}
