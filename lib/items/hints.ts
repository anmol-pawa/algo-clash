/** The 3-rung hint ladder (GDD §6.6): parsed from a problem's `hints.md`. Pure. */

export const HINT_RUNGS = ["Nudge", "Approach", "Key insight"] as const;
export type HintRung = (typeof HINT_RUNGS)[number];

export interface Hint {
  rung: HintRung;
  text: string;
}

/** Parses `## Nudge / ## Approach / ## Key insight` into an ordered ladder. Missing rungs are skipped, unknown headings ignored. */
export function parseHints(md: string): Hint[] {
  const out: Hint[] = [];
  let cur: { rung: HintRung; lines: string[] } | null = null;
  const flush = () => {
    if (cur) {
      const text = cur.lines.join("\n").trim();
      if (text) out.push({ rung: cur.rung, text });
    }
  };
  for (const line of md.split(/\r?\n/)) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      flush();
      const rung = HINT_RUNGS.find((r) => r.toLowerCase() === m[1].toLowerCase());
      cur = rung ? { rung, lines: [] } : null;
    } else if (cur) cur.lines.push(line);
  }
  flush();
  return HINT_RUNGS.map((r) => out.find((h) => h.rung === r)).filter((h): h is Hint => !!h);
}

/** More than two hints (i.e. the Key insight) makes a win assisted (GDD §6.2). */
export const ASSISTED_HINT_COUNT = 3;
