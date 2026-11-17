/**
 * Source-level gym twists (GDD §5.5): rules about *how* the signature round may be solved, checked before compiling.
 * Pure and DOM-free. A violation is reported like a compile error and never costs a heart.
 */
export interface ForbiddenRule {
  /** Matched against the code with comments and string/char literals blanked out. Omit when `check` does the work. */
  pattern?: RegExp;
  /** A structural test on the blanked code (e.g. "is any function recursive"); true means the rule is violated. */
  check?: (code: string) => boolean;
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
    if (r.check) {
      if (r.check(code)) return r.message;
      continue;
    }
    if (!r.pattern) continue;
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

const NOT_FUNCTIONS = new Set(["if", "for", "while", "switch", "catch", "return", "sizeof", "decltype", "else"]);

/** Index just past the `}` that closes the `{` at `open` (or the end of the text when unbalanced). */
function closeBrace(code: string, open: number): number {
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === "{") depth++;
    else if (code[i] === "}" && --depth === 0) return i + 1;
  }
  return code.length;
}

/**
 * True when some function (a free function, a member, or a `std::function` lambda) can reach itself through
 * calls to other functions defined in the same source, directly or in a cycle. Works on code that has had
 * comments and literals blanked. Member calls such as `s.top()` never count as a call to a user function.
 */
export function hasRecursion(code: string): boolean {
  const bodies = new Map<string, string[]>();
  const add = (name: string, body: string) => bodies.set(name, [...(bodies.get(name) ?? []), body]);
  const defs = /\b([A-Za-z_]\w*)\s*\([^;{}]*\)\s*(?:const\s*)?(?:noexcept\s*)?(?:override\s*)?(?:->\s*[\w:<>,\s&*]+?\s*)?\{/g;
  for (const m of code.matchAll(defs)) {
    if (NOT_FUNCTIONS.has(m[1])) continue;
    const open = m.index! + m[0].length - 1;
    add(m[1], code.slice(open, closeBrace(code, open)));
  }
  const lambdas = /\b(?:std\s*::\s*)?function\s*<[^;=]*>\s*([A-Za-z_]\w*)\s*=\s*\[[^\]]*\]\s*(?:\([^)]*\))?[^{;]*\{/g;
  for (const m of code.matchAll(lambdas)) {
    const open = m.index! + m[0].length - 1;
    add(m[1], code.slice(open, closeBrace(code, open)));
  }
  const names = [...bodies.keys()];
  const calls = (body: string, name: string) => new RegExp(`(?<![.\\w>])${name}\\s*\\(`).test(body.replace(/->\s*\w+\s*\(/g, " "));
  const edges = new Map<string, string[]>();
  for (const [name, list] of bodies) edges.set(name, names.filter((o) => list.some((b) => calls(b, o))));
  // A cycle exists when a node can reach itself.
  for (const start of names) {
    const seen = new Set<string>();
    const stack = [...(edges.get(start) ?? [])];
    while (stack.length) {
      const n = stack.pop()!;
      if (n === start) return true;
      if (seen.has(n)) continue;
      seen.add(n);
      stack.push(...(edges.get(n) ?? []));
    }
  }
  return false;
}
