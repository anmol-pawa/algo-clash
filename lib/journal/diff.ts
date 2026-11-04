/** Line diff (LCS) for the Solution Journal: yours vs a past attempt, yours vs the reference. Pure. */

export type DiffKind = "same" | "add" | "del";
export interface DiffLine {
  kind: DiffKind;
  text: string;
}
export interface DiffResult {
  lines: DiffLine[];
  added: number;
  removed: number;
  /** 1 when identical (ignoring trailing whitespace and blank-edge lines), else the share of unchanged lines. */
  similarity: number;
}

const MAX_LINES = 600;

function norm(code: string): string[] {
  const lines = code.replace(/\r\n?/g, "\n").split("\n").map((l) => l.replace(/\s+$/, ""));
  while (lines.length && lines[0] === "") lines.shift();
  while (lines.length && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/** Diffs `from` into `to`. Inputs beyond MAX_LINES lines are truncated so the O(n·m) table stays small. */
export function diffLines(from: string, to: string): DiffResult {
  const a = norm(from).slice(0, MAX_LINES);
  const b = norm(to).slice(0, MAX_LINES);
  const n = a.length;
  const m = b.length;
  const w = m + 1;
  const t = new Uint16Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) t[i * w + j] = a[i] === b[j] ? t[(i + 1) * w + j + 1] + 1 : Math.max(t[(i + 1) * w + j], t[i * w + j + 1]);
  }
  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      lines.push({ kind: "same", text: a[i] });
      i++;
      j++;
    } else if (t[(i + 1) * w + j] >= t[i * w + j + 1]) lines.push({ kind: "del", text: a[i++] });
    else lines.push({ kind: "add", text: b[j++] });
  }
  while (i < n) lines.push({ kind: "del", text: a[i++] });
  while (j < m) lines.push({ kind: "add", text: b[j++] });
  const same = t[0];
  const added = m - same;
  const removed = n - same;
  const denom = Math.max(n, m);
  return { lines, added, removed, similarity: denom === 0 ? 1 : same / denom };
}
