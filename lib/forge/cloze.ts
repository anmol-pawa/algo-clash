import { BLANK } from "../cards/grade";
import { makeRng } from "../content/rng";
import type { ClozeMask } from "./types";

/** Identifiers that stay visible: they give the template its shape. */
const KEEP = new Set(["class", "public", "private", "struct", "const", "auto"]);
const TOKEN = /[A-Za-z_]\w*|\d[\w']*|>=|<=|==|!=|\+=|-=|\*=|\/=|%=|\+\+|--|&&|\|\||::|[-+*/%<>=!&|]/g;

interface Tok { start: number; end: number; text: string }

/** Maskable tokens of `code`: identifiers, numbers and operators outside comments, preprocessor lines and string literals. */
export function maskableTokens(code: string): Tok[] {
  const out: Tok[] = [];
  let offset = 0;
  for (const line of code.split("\n")) {
    const trimmed = line.trimStart();
    if (!trimmed.startsWith("#") && !trimmed.startsWith("//")) {
      const comment = line.indexOf("//");
      const body = comment === -1 ? line : line.slice(0, comment);
      for (const m of body.matchAll(TOKEN)) {
        if (KEEP.has(m[0])) continue;
        out.push({ start: offset + m.index, end: offset + m.index + m[0].length, text: m[0] });
      }
    }
    offset += line.length + 1;
  }
  return out;
}

/**
 * Blank about `ratio` of the maskable tokens, chosen by a seeded shuffle (same seed, same mask).
 * Always blanks at least two tokens, never more than all of them.
 */
export function makeMask(code: string, ratio: number, seed: number): ClozeMask {
  const toks = maskableTokens(code);
  const k = Math.min(toks.length, Math.max(2, Math.round(toks.length * ratio)));
  const chosen = makeRng(seed).shuffle(toks.map((_, i) => i)).slice(0, k).sort((a, b) => a - b);
  let text = "";
  let at = 0;
  const answers: string[] = [];
  for (const i of chosen) {
    text += code.slice(at, toks[i].start) + BLANK;
    answers.push(toks[i].text);
    at = toks[i].end;
  }
  text += code.slice(at);
  return { text, answers, ratio: toks.length === 0 ? 0 : k / toks.length };
}

/** Compare a player's fills with the reference answers: which blanks differ (a hint; the judge decides the pass). */
export function diffFills(mask: ClozeMask, fills: readonly string[]): boolean[] {
  return mask.answers.map((a, i) => (fills[i] ?? "").trim() === a);
}
