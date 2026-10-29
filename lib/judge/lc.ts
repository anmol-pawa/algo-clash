/** LeetCode-style literal parsing and printing (ARCH §2.3). Pure: no DOM. */

export type LcValue = number | boolean | string | null | LcValue[];

/** Parse one LC literal such as `[1,2,null]`, `[["a","b"],[]]`, `"abc"`, `true`, `-3`, `1.5`. */
export function parseLc(text: string): LcValue {
  const p = new Parser(text);
  const v = p.value();
  p.ws();
  if (!p.done()) throw new Error(`unexpected '${p.peek()}' at ${p.pos}`);
  return v;
}

class Parser {
  pos = 0;
  constructor(private readonly s: string) {}
  done(): boolean {
    return this.pos >= this.s.length;
  }
  peek(): string {
    return this.s[this.pos] ?? "";
  }
  ws(): void {
    while (/\s/.test(this.peek()) && !this.done()) this.pos++;
  }
  value(): LcValue {
    this.ws();
    const c = this.peek();
    if (c === "[") return this.array();
    if (c === '"') return this.string();
    if (this.s.startsWith("null", this.pos)) return (this.pos += 4), null;
    if (this.s.startsWith("true", this.pos)) return (this.pos += 4), true;
    if (this.s.startsWith("false", this.pos)) return (this.pos += 5), false;
    const m = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(this.s.slice(this.pos));
    if (!m) throw new Error(this.done() ? "unexpected end" : `unexpected '${c}' at ${this.pos}`);
    this.pos += m[0].length;
    return Number(m[0]);
  }
  array(): LcValue[] {
    this.pos++;
    const out: LcValue[] = [];
    this.ws();
    if (this.peek() === "]") return this.pos++, out;
    for (;;) {
      out.push(this.value());
      this.ws();
      const c = this.peek();
      this.pos++;
      if (c === "]") return out;
      if (c !== ",") throw new Error(`expected ',' or ']' at ${this.pos - 1}`);
    }
  }
  string(): string {
    this.pos++;
    let out = "";
    while (!this.done() && this.peek() !== '"') {
      if (this.peek() === "\\") {
        this.pos++;
        const e = this.peek();
        out += e === "n" ? "\n" : e === "t" ? "\t" : e;
      } else out += this.peek();
      this.pos++;
    }
    if (this.done()) throw new Error("unterminated string");
    this.pos++;
    return out;
  }
}

/** Print the canonical LC form: no spaces, `null`, escaped strings. */
export function printLc(v: LcValue): string {
  if (v === null) return "null";
  if (typeof v === "string") return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\t/g, "\\t")}"`;
  if (Array.isArray(v)) return `[${v.map(printLc).join(",")}]`;
  return String(v);
}

/** Build a binary tree from level-order LC form and print it back (trailing nulls trimmed). */
export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function treeFromLevelOrder(a: LcValue[]): TreeNode | null {
  if (a.length === 0 || a[0] === null) return null;
  const root: TreeNode = { val: a[0] as number, left: null, right: null };
  const q: TreeNode[] = [root];
  let i = 1;
  for (let h = 0; h < q.length && i < a.length; h++) {
    const n = q[h];
    for (const side of ["left", "right"] as const) {
      if (i >= a.length) break;
      const x = a[i++];
      if (x !== null) {
        n[side] = { val: x as number, left: null, right: null };
        q.push(n[side]!);
      }
    }
  }
  return root;
}

export function treeToLevelOrder(root: TreeNode | null): (number | null)[] {
  const out: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  for (let h = 0; h < q.length; h++) {
    const n = q[h];
    if (!n) {
      out.push(null);
      continue;
    }
    out.push(n.val);
    q.push(n.left, n.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

/** Compare outputs the way the judge does: token-normalised for exact answers, tolerance for floats. */
export function outputsMatch(expected: string, got: string, floatTol?: number): boolean {
  if (floatTol === undefined) return normalise(expected) === normalise(got);
  let e: LcValue, g: LcValue;
  try {
    e = parseLc(expected.trim());
    g = parseLc(got.trim());
  } catch {
    return false;
  }
  return approx(e, g, floatTol);
}

function normalise(s: string): string {
  try {
    return printLc(parseLc(s.trim()));
  } catch {
    return s.trim().split(/\s+/).join(" ");
  }
}

function approx(a: LcValue, b: LcValue, tol: number): boolean {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) <= tol * Math.max(1, Math.abs(a));
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => approx(x, b[i], tol));
  return a === b;
}
