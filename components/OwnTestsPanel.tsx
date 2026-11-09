"use client";

import { EDGE_LABELS, MAX_OWN_TESTS, ownTestIssue, type Coverage, type GateState, type OwnTest } from "@/lib/modes/owntests";

/** Interview/Contest: write your own tests (input + expected). Submit stays locked until enough of them pass your code. */
export default function OwnTestsPanel({ tests, onChange, onRun, busy, gate, cov, status }: {
  tests: OwnTest[];
  onChange: (t: OwnTest[]) => void;
  onRun: () => void;
  busy: boolean;
  gate: GateState;
  cov: Coverage;
  status: string;
}) {
  const set = (i: number, patch: Partial<OwnTest>) => onChange(tests.map((t, j) => (j === i ? { ...t, ...patch, passed: undefined } : t)));
  const ready = tests.length > 0 && tests.every((t) => ownTestIssue(t) === null);
  return (
    <section className="panel flex flex-col gap-2 p-3 text-sm" aria-label="Your own tests" data-testid="own-tests">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-base">Your tests</h3>
        <span className={gate.unlocked ? "text-emerald-300" : "text-amber-300"} data-testid="own-gate">{gate.passing}/{gate.need} passing</span>
      </div>
      <p className="text-xs opacity-80">{gate.message} Use the same input format as the examples.</p>
      {tests.map((t, i) => (
        <div key={i} className="flex flex-col gap-1 rounded bg-black/20 p-2">
          <div className="flex items-center gap-2">
            <span className="w-6 text-xs opacity-60">#{i + 1}</span>
            <span className="text-xs" aria-label={t.passed === undefined ? "not run" : t.passed ? "passed" : "failed"}>{t.passed === undefined ? "·" : t.passed ? "✔" : "✘"}</span>
            <button className="px-btn ml-auto min-h-11 px-3 text-xs" onClick={() => onChange(tests.filter((_, j) => j !== i))} aria-label={`Remove test ${i + 1}`}>Remove</button>
          </div>
          <textarea className="min-h-11 rounded bg-black/40 p-2 font-mono text-xs" rows={2} placeholder="input" aria-label={`Input of test ${i + 1}`}
            value={t.input} onChange={(e) => set(i, { input: e.target.value })} spellCheck={false} />
          <input className="min-h-11 rounded bg-black/40 p-2 font-mono text-xs" placeholder="expected output" aria-label={`Expected output of test ${i + 1}`}
            value={t.expected} onChange={(e) => set(i, { expected: e.target.value })} spellCheck={false} />
        </div>
      ))}
      <div className="flex gap-2">
        <button className="px-btn min-h-11 flex-1" disabled={tests.length >= MAX_OWN_TESTS} onClick={() => onChange([...tests, { input: "", expected: "" }])}>+ Add test</button>
        <button className="px-btn px-btn-primary min-h-11 flex-1" disabled={busy || !ready} onClick={onRun}>Run my tests</button>
      </div>
      {status && <p className="text-xs" data-testid="own-status">{status}</p>}
      {(cov.covered.length > 0 || cov.missed.length > 0) && (
        <p className="text-xs opacity-80" data-testid="own-coverage">
          Edge cases covered: {cov.covered.length}/{cov.covered.length + cov.missed.length}
          {cov.missed.length > 0 && <> · try: {cov.missed.map((c) => EDGE_LABELS[c].toLowerCase()).join(", ")}</>}
        </p>
      )}
    </section>
  );
}
