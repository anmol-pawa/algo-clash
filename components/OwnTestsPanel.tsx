"use client";

import { EDGE_CLASSES, type Coverage } from "@/lib/modes/coverage";
import { OWN_TESTS_PLACEHOLDER } from "@/lib/modes/ownTests";

/** Interview/Contest: the player writes their own tests (input lines, then "=> expected"). */
export default function OwnTestsPanel({ text, onText, count, errors, coverage, disabled, onRun }: {
  text: string; onText: (t: string) => void; count: number; errors: string[]; coverage: Coverage | null; disabled: boolean; onRun: () => void;
}) {
  const label = (id: string) => EDGE_CLASSES.find((c) => c.id === id)?.label ?? id;
  return (
    <details className="px-win p-2" data-testid="own-tests">
      <summary className="min-h-11 cursor-pointer text-sm">My tests ({count}) · required before Submit</summary>
      <textarea aria-label="My tests" className="mt-1 h-20 w-full resize-y bg-black/40 p-2 font-mono text-xs" value={text} spellCheck={false}
        placeholder={OWN_TESTS_PLACEHOLDER} onChange={(e) => onText(e.target.value)} />
      <p className="text-xs opacity-70">One input value per line, then a line starting with =&gt; and the expected output. Blank line between tests.</p>
      {errors.map((e) => <p key={e} className="text-xs text-red-300" role="alert">{e}</p>)}
      <button className="px-btn mt-1 min-h-11 w-full text-sm" disabled={disabled || count < 1} onClick={onRun}>Run my tests</button>
      {coverage && (
        <p className="mt-1 text-xs" data-testid="coverage">
          Edge-case coverage {Math.round(coverage.score * 100)}%.{coverage.missed.length > 0 ? ` Not covered: ${coverage.missed.map(label).join(", ")}.` : " Every class the judge tests, you tested."}
        </p>
      )}
    </details>
  );
}
