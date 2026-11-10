import type { Frame, Mark, Trace } from "./types";

export type SortKind = "bubble" | "selection" | "insertion";

export const SORT_NAMES: Record<SortKind, string> = {
  bubble: "Bubble sort",
  selection: "Selection sort",
  insertion: "Insertion sort",
};

export const SORT_COMPLEXITY: Record<SortKind, { time: string; space: string; stable: boolean; note: string }> = {
  bubble: { time: "O(n^2)", space: "O(1)", stable: true, note: "Each pass floats the largest remaining value to the end." },
  selection: { time: "O(n^2)", space: "O(1)", stable: false, note: "Each pass picks the smallest remaining value; only n-1 swaps." },
  insertion: { time: "O(n^2), O(n) if nearly sorted", space: "O(1)", stable: true, note: "Grows a sorted prefix; great on small or nearly sorted input." },
};

const sortedMarks = (from: number, to: number): Mark[] => {
  const out: Mark[] = [];
  for (let i = from; i <= to; i++) out.push({ index: i, kind: "sorted" });
  return out;
};

/** Step-by-step trace of a quadratic sort. Every frame's array is a permutation of the input. */
export function traceSort(kind: SortKind, input: readonly number[]): Trace {
  const a = [...input];
  const n = a.length;
  const frames: Frame[] = [];
  const push = (marks: Mark[], note: string, pointers: Frame["pointers"] = [], state?: Frame["state"]) =>
    frames.push({ array: [...a], marks, pointers, note, state });
  push([], `Start with ${n} value${n === 1 ? "" : "s"}.`);

  if (kind === "bubble") {
    for (let end = n - 1; end > 0; end--) {
      let swapped = false;
      for (let j = 0; j < end; j++) {
        push([{ index: j, kind: "compare" }, { index: j + 1, kind: "compare" }, ...sortedMarks(end + 1, n - 1)], `Compare ${a[j]} and ${a[j + 1]}.`, [{ label: "j", index: j }]);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swapped = true;
          push([{ index: j, kind: "swap" }, { index: j + 1, kind: "swap" }, ...sortedMarks(end + 1, n - 1)], `${a[j + 1]} is bigger, so swap.`, [{ label: "j", index: j }]);
        }
      }
      if (!swapped) {
        push(sortedMarks(0, n - 1), "A full pass made no swap, so the array is sorted: stop early.");
        return { frames, result: [...a] };
      }
    }
  } else if (kind === "selection") {
    for (let i = 0; i < n - 1; i++) {
      let best = i;
      for (let j = i + 1; j < n; j++) {
        push([{ index: best, kind: "key" }, { index: j, kind: "compare" }, ...sortedMarks(0, i - 1)], `Is ${a[j]} smaller than the current minimum ${a[best]}?`, [{ label: "i", index: i }, { label: "j", index: j }]);
        if (a[j] < a[best]) best = j;
      }
      if (best !== i) {
        [a[i], a[best]] = [a[best], a[i]];
        push([{ index: i, kind: "swap" }, { index: best, kind: "swap" }, ...sortedMarks(0, i - 1)], `Swap the minimum into position ${i}.`, [{ label: "i", index: i }]);
      }
    }
  } else {
    for (let i = 1; i < n; i++) {
      let j = i;
      push([{ index: i, kind: "key" }, ...sortedMarks(0, i - 1)], `Insert ${a[i]} into the sorted prefix.`, [{ label: "i", index: i }]);
      while (j > 0 && a[j - 1] > a[j]) {
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        push([{ index: j - 1, kind: "swap" }, { index: j, kind: "swap" }], `${a[j]} is bigger than ${a[j - 1]}: shift it right.`, [{ label: "i", index: i }, { label: "j", index: j - 1 }]);
        j--;
      }
    }
  }
  push(sortedMarks(0, n - 1), n ? "Sorted." : "Nothing to sort.");
  return { frames, result: [...a] };
}
