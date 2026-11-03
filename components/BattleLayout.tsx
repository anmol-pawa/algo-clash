"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { BATTLE_TABS, stepTab, type BattleTab } from "@/lib/ui/battleTabs";

interface Props {
  tab: BattleTab;
  onTab(t: BattleTab): void;
  stage: ReactNode;
  problem: ReactNode;
  code: ReactNode;
  /** Run / Submit bar: always visible so a submit works from any tab. */
  actions: ReactNode;
  /** Small chip on a tab (e.g. the last verdict on Code). */
  badges?: Partial<Record<BattleTab, string>>;
}

/**
 * Desktop (lg+): stage on top (about 32% of the viewport height), statement and editor in split panes below.
 * Mobile: one pane at a time behind a Stage / Problem / Code tab bar; panes stay mounted so editor state survives.
 */
export default function BattleLayout({ tab, onTab, stage, problem, code, actions, badges }: Props) {
  const show = (t: BattleTab) => (tab === t ? "flex" : "hidden");
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); onTab(stepTab(tab, 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); onTab(stepTab(tab, -1)); }
  };
  return (
    <div className="mx-auto flex h-dvh w-full max-w-6xl flex-col gap-2 p-2 lg:gap-3 lg:p-3">
      <div role="tablist" aria-label="Battle view" className="grid shrink-0 grid-cols-3 gap-2 lg:hidden" onKeyDown={onKey}>
        {BATTLE_TABS.map((t) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`pane-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1} onClick={() => onTab(t.id)}
            className={`px-btn min-h-11 text-sm ${tab === t.id ? "px-btn-primary" : ""}`}>
            {t.label}{badges?.[t.id] ? <span className="ml-1 text-xs opacity-80">[{badges[t.id]}]</span> : null}
          </button>
        ))}
      </div>
      <section id="pane-stage" role="tabpanel" aria-labelledby="tab-stage"
        className={`${show("stage")} min-h-0 shrink-0 items-start justify-center lg:flex lg:h-[32dvh]`}>
        <div className="w-full lg:h-full lg:w-auto" style={{ aspectRatio: "240 / 135", maxWidth: "100%" }}>{stage}</div>
      </section>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-3">
        <section id="pane-problem" role="tabpanel" aria-labelledby="tab-problem" className={`${show("problem")} min-h-0 min-w-0 flex-col lg:flex`}>
          <div className="min-h-0 flex-1 overflow-auto">{problem}</div>
        </section>
        <section id="pane-code" role="tabpanel" aria-labelledby="tab-code" className={`${show("code")} min-h-0 min-w-0 flex-col gap-2 lg:flex`}>
          {code}
        </section>
      </div>
      <div className="shrink-0">{actions}</div>
    </div>
  );
}
