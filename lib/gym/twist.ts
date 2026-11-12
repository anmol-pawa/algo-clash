/**
 * Source-level gym twists (GDD §5.5): rules about *how* the signature round may be solved, checked before compiling.
 * Pure and DOM-free. A violation is reported like a compile error and never costs a heart.
 */
export interface ForbiddenRule {
  /** Matched against the code with comments and string/char literals blanked out. */
  pattern: RegExp;
  /** How many matches are allowed (e.g. the one `vector<int>` in the signature). */
  allowed?: number;
  /** One friendly line naming what was found and why it is off limits. */
  message: string;
  /** When this also matches the code, the rule is satisfied (a "do X if you do Y" rule, e.g. verify a hash match). */
  unless?: RegExp;
}

/** Replaces comments and string/char literals with spaces so words inside them never trigger a rule. */
export function blankNonCode(src: string): string {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "/" && d === "/") {
      while (i < n && src[i] !== "\n") { out += " "; i++; }
    } else if (c === "/" && d === "*") {
      out += "  "; i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) { out += src[i] === "\n" ? "\n" : " "; i++; }
      if (i < n) { out += "  "; i += 2; }
    } else if (c === '"' || c === "'") {
      out += c; i++;
      while (i < n && src[i] !== c && src[i] !== "\n") {
        if (src[i] === "\\" && i + 1 < n) { out += "  "; i += 2; } else { out += " "; i++; }
      }
      if (i < n && src[i] === c) { out += c; i++; }
    } else { out += c; i++; }
  }
  return out;
}

/** Returns the first violated rule's message, or null when the code obeys every rule. */
export function findForbidden(src: string, rules: readonly ForbiddenRule[]): string | null {
  const code = blankNonCode(src);
  for (const r of rules) {
    const flags = r.pattern.flags.includes("g") ? r.pattern.flags : r.pattern.flags + "g";
    const count = (code.match(new RegExp(r.pattern.source, flags)) ?? []).length;
    if (count > (r.allowed ?? 0) && !(r.unless && r.unless.test(code))) return r.message;
  }
  return null;
}

/**
 * "Shrinking pane" (Pane Warden twist, GDD §5.5): the first TLE in the signature round halves the per-test
 * time limit for the rest of the fight, because a window problem must drop brute force early. Only once.
 */
export function limitAfterVerdict(limitMs: number, verdict: string, alreadyHalved: boolean): { limitMs: number; halved: boolean } {
  if (alreadyHalved || verdict !== "TLE") return { limitMs, halved: alreadyHalved };
  return { limitMs: Math.max(1, Math.floor(limitMs / 2)), halved: true };
}
