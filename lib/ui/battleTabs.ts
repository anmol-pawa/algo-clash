/** Pure rules for the mobile battle tab switcher (GDD §9: Stage, Problem, Code). */
import type { Verdict } from "../judge/verdict";

export type BattleTab = "stage" | "problem" | "code";
export const BATTLE_TABS: readonly { id: BattleTab; label: string }[] = [
  { id: "stage", label: "Stage" },
  { id: "problem", label: "Problem" },
  { id: "code", label: "Code" },
];

export type JudgeKind = "run" | "submit";

/**
 * Where to send the player after a judge finishes on a narrow screen.
 * Submit shows the stage so the battle plays out, unless the build failed (the error is in the Code tab).
 * Run never moves the player: they are iterating on code.
 */
export function tabAfterJudge(current: BattleTab, kind: JudgeKind, verdict: Verdict): BattleTab {
  if (kind === "run") return current;
  return verdict === "CE" ? "code" : "stage";
}

/** Arrow-key navigation across the tab list (wraps). */
export function stepTab(current: BattleTab, dir: 1 | -1): BattleTab {
  const i = BATTLE_TABS.findIndex((t) => t.id === current);
  return BATTLE_TABS[(i + dir + BATTLE_TABS.length) % BATTLE_TABS.length].id;
}

/** Foe damage and the stage line for a finished judge. Pure so the story is testable. */
export function battleOutcome(kind: JudgeKind, verdict: Verdict, passed: number, total: number, foeMax: number):
  { foeDamage: number; playerHearts: number; line: string } {
  if (verdict === "AC") {
    return kind === "submit"
      ? { foeDamage: foeMax, playerHearts: 0, line: "Accepted! Every hidden test passed. The foe is beaten." }
      : { foeDamage: Math.round(foeMax * 0.25), playerHearts: 0, line: `Run clean: ${passed}/${total} sample tests pass. Now submit!` };
  }
  if (verdict === "CE") return { foeDamage: 0, playerHearts: 0, line: "It did not compile. Read the error in the Code tab." };
  const why = verdict === "WA" ? "gave a wrong answer" : verdict === "TLE" ? "ran out of time" : "crashed";
  return { foeDamage: 0, playerHearts: kind === "submit" ? 1 : 0, line: `Your code ${why} (${passed}/${total} passed).${kind === "submit" ? " The foe counterattacks!" : ""}` };
}
