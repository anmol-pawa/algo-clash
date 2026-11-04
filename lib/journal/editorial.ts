/** Splits an `editorial.md` (house style, GDD §8.3) into its sections for rendering. Pure. */

export const EDITORIAL_TITLES = [
  "Signals",
  "Brute force",
  "Key insight",
  "Optimal",
  "C++ walkthrough",
  "Common bugs",
  "Follow-ups",
  "Similar problems",
] as const;

export interface EditorialSection {
  title: string;
  /** Markdown body, trimmed. */
  body: string;
}

/** Returns the `## ` sections in document order; text before the first heading is ignored. */
export function parseEditorial(md: string): EditorialSection[] {
  const heads = [...md.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => ({ title: m[1], start: m.index ?? 0, end: (m.index ?? 0) + m[0].length }));
  return heads.map((h, i) => ({ title: h.title, body: md.slice(h.end, heads[i + 1]?.start ?? md.length).trim() }));
}

/**
 * Debrief order: the learning path first (signals, insight, optimal, walkthrough), the brute force
 * kept as context, then bugs and follow-ups. Unknown sections keep their relative order at the end.
 */
export function sectionsForDebrief(md: string): EditorialSection[] {
  const rank = (t: string) => {
    const i = (EDITORIAL_TITLES as readonly string[]).indexOf(t);
    return i < 0 ? EDITORIAL_TITLES.length : i;
  };
  return parseEditorial(md)
    .map((s, i) => ({ s, i }))
    .sort((a, b) => rank(a.s.title) - rank(b.s.title) || a.i - b.i)
    .map((x) => x.s);
}

export type Inline = { kind: "text" | "code" | "bold"; text: string };

/** Tiny inline-markdown tokenizer (`code`, **bold**) so the UI never uses innerHTML. */
export function inlineTokens(line: string): Inline[] {
  const out: Inline[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (const m of line.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ kind: "text", text: line.slice(last, at) });
    out.push(m[1] !== undefined ? { kind: "code", text: m[1] } : { kind: "bold", text: m[2] });
    last = at + m[0].length;
  }
  if (last < line.length) out.push({ kind: "text", text: line.slice(last) });
  return out;
}
