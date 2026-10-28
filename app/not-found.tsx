import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="font-display text-6xl text-[var(--accent)]">404</div>
      <p className="text-white/60">Index out of bounds — this page isn&apos;t in the array.</p>
      <Link href="/" className="px-btn px-btn-primary inline-flex min-h-11 items-center px-5 text-[#06040d]">
        Back to the title screen
      </Link>
    </main>
  );
}
