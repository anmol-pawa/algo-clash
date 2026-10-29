"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import StatementPanel from "@/components/StatementPanel";
import VerdictPanel from "@/components/VerdictPanel";
import { DEFAULT_EDITOR_SETTINGS } from "@/lib/editor/settings";
import { compileCpp, runWasm } from "@/lib/judge/client";
import { judgeProblem } from "@/lib/judge/judge";
import { DraftAutosaver } from "@/lib/save/autosave";
import { IdbBackend } from "@/lib/save/idb";
import { SaveService } from "@/lib/save/service";
import { parseStatement } from "@/lib/ui/statement";
import { buildVerdictView, type VerdictView } from "@/lib/ui/verdictView";
import { meta } from "@/content/problems/R6/crate-brackets/meta";
import allTests from "@/content/problems/R6/crate-brackets/tests.json";

// Dev-only sample: A7 replaces this with a bundled problem catalogue.
const STATEMENT = `# Crate Brackets

A dock worker labels stacked crates with brackets: \`(\` \`)\` \`[\` \`]\` \`{\` \`}\`. A label is **balanced** when every opening bracket is closed by a bracket of the same kind, and brackets close in the reverse order they opened.

Given the label \`s\`, return \`true\` if it is balanced and \`false\` otherwise.

## Examples

- \`s = "([]{})"\` gives \`true\`.
- \`s = "([)]"\` gives \`false\`.

## Constraints

- \`0 <= s.length() <= 100000\`
- \`s\` contains only the six bracket characters.
`;

const STARTER = `class Solution {
public:
    bool isBalanced(string s) {
        return true; // TODO
    }
};
`;

const visible = allTests.filter((t) => t.group === "basic");

/** Battle-code UI playground (A5b): statement + editor + Run (visible tests) / Submit (all hidden tests). */
export default function DevProblem() {
  const statement = useMemo(() => parseStatement(STATEMENT), []);
  const [code, setCode] = useState(STARTER);
  const [view, setView] = useState<VerdictView | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const saver = useRef<DraftAutosaver | null>(null);

  // Restore the saved draft, then autosave edits every 5 s and when the tab is hidden or closed.
  useEffect(() => {
    let alive = true;
    const svc = new SaveService(new IdbBackend());
    const a = new DraftAutosaver(svc, meta.id, STARTER);
    saver.current = a;
    svc.loadDraft(meta.id).then((d) => {
      if (!alive || !d || d.code === STARTER) return;
      a.markSaved(d.code);
      setCode(d.code);
      setNote("Draft restored");
    }).catch(() => {});
    const onHide = () => { if (document.visibilityState === "hidden") void a.flush(); };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onHide);
      void a.dispose();
    };
  }, []);

  function edit(c: string) {
    setCode(c);
    saver.current?.update(c);
  }

  async function judge(tests: typeof allTests) {
    setBusy(true);
    setView(null);
    const r = await judgeProblem(meta.spec, code, tests, { timeLimitMs: meta.timeLimitMs }, { compile: (s) => compileCpp(s), run: runWasm });
    setView(buildVerdictView(r, tests));
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-3 p-3 lg:h-dvh">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="max-h-[40dvh] min-h-0 min-w-0 lg:max-h-none"><StatementPanel statement={statement} badge={<span className="px-btn px-2 text-xs">{meta.difficulty}</span>} /></div>
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <div className="h-[45dvh] min-h-0 lg:h-auto lg:flex-1"><CodeEditor value={code} onChange={edit} settings={DEFAULT_EDITOR_SETTINGS} /></div>
          <div className="flex gap-2">
            <button className="px-btn min-h-11 flex-1" disabled={busy} onClick={() => judge(visible)}>Run ({visible.length})</button>
            <button className="px-btn px-btn-primary min-h-11 flex-1" disabled={busy} onClick={() => judge(allTests as typeof allTests)}>{busy ? "Judging…" : `Submit (${allTests.length})`}</button>
          </div>
          {note && <p className="text-xs opacity-70" data-testid="draft-note">{note}</p>}
          <VerdictPanel view={view} />
        </div>
      </div>
    </main>
  );
}
