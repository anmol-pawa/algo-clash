/** Line-level diff (LCS) for comparing solutions. Pure; O(n·m) is fine for source files. */

export type DiffOp = { op: "same" | "add" | "del"; text: string };

const norm = (s: string) => s.replace(/\r\n?/g, "\n").replace(/\n+$/, "").split("\n");

/** Diff `a` (older / reference) into `b` (newer / yours). Trailing whitespace on a line is ignored for matching. */
export function diffLines(a: string, b: string): DiffOp[] {
  const A = a.trim() === "" ? [] : norm(a);
  const B = b.trim() === "" ? [] : norm(b);
  const key = (s: string) => s.replace(/\s+$/, "");
  const n = A.length;
  const m = B.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = key(A[i]) === key(B[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (key(A[i]) === key(B[j])) {
      out.push({ op: "same", text: B[j] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ op: "del", text: A[i++] });
    } else {
      out.push({ op: "add", text: B[j++] });
    }
  }
  while (i < n) out.push({ op: "del", text: A[i++] });
  while (j < m) out.push({ op: "add", text: B[j++] });
  return out;
}

export interface DiffStats {
  added: number;
  removed: number;
  same: number;
  /** Fraction of lines shared, 0..1 (1 for two empty inputs). */
  similarity: number;
}

export function diffStats(ops: readonly DiffOp[]): DiffStats {
  let added = 0;
  let removed = 0;
  let same = 0;
  for (const o of ops) {
    if (o.op === "add") added++;
    else if (o.op === "del") removed++;
    else same++;
  }
  const total = added + removed + same;
  return { added, removed, same, similarity: total === 0 ? 1 : (2 * same) / (2 * same + added + removed) };
}
