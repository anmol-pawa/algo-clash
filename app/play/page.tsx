import Link from "next/link";
import { PlayStage } from "@/components/PlayStage";

export default function PlayPage() {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <PlayStage />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Link href="/" className="px-btn pointer-events-auto text-sm">
          ◀ Title
        </Link>
      </div>
      <div className="px-window absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] mx-auto max-w-lg p-4 text-center font-display text-white/80">
        Mainville is still being built. The overworld arrives soon.
      </div>
    </main>
  );
}
