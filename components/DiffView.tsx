import type { DiffOp } from "@/lib/journal/diff";

/** Line diff as a scrollable, colour-coded block (+ added, - removed). */
export function DiffView({ ops, testId }: { ops: readonly DiffOp[]; testId?: string }) {
  return (
    <pre className="max-h-64 overflow-auto rounded bg-black/30 p-2 font-mono text-xs" data-testid={testId}>
      {ops.map((o, i) => (
        <div key={i} className={o.op === "add" ? "bg-emerald-500/20" : o.op === "del" ? "bg-rose-500/20" : "opacity-70"}>
          {o.op === "add" ? "+ " : o.op === "del" ? "- " : "  "}{o.text}
        </div>
      ))}
    </pre>
  );
}
