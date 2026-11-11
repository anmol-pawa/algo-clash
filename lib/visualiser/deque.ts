import type { Frame, Trace } from "./types";

/** Variable window on non-negative values: shortest stretch with sum >= target. result = length, or 0 when none exists. */
export function traceShortestAtLeast(values: readonly number[], target: number): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  let sum = 0;
  let left = 0;
  let best = 0;
  if (!a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: "Empty input: no stretch.", state: { target, best: 0 } });
    return { frames, result: 0 };
  }
  const inWin = (lo: number, hi: number) => Array.from({ length: Math.max(0, hi - lo + 1) }, (_, i) => ({ index: lo + i, kind: "inWindow" as const }));
  for (let right = 0; right < a.length; right++) {
    sum += a[right];
    frames.push({
      array: [...a], marks: inWin(left, right), pointers: [{ label: "L", index: left }, { label: "R", index: right }], window: [left, right],
      note: `Grow: take ${a[right]} on the right. Sum is now ${sum}${sum >= target ? ` which reaches ${target}, so try shrinking.` : ` and still below ${target}, so keep growing.`}`,
      state: { target, sum, best: best || "none" },
    });
    while (sum >= target && left <= right) {
      const len = right - left + 1;
      if (best === 0 || len < best) best = len;
      const dropped = a[left];
      sum -= dropped;
      left++;
      frames.push({
        array: [...a], marks: inWin(left, right), pointers: [{ label: "L", index: Math.min(left, a.length - 1) }, { label: "R", index: right }],
        window: left <= right ? [left, right] : undefined,
        note: `Valid window of length ${len} recorded (best ${best}). Shrink: drop ${dropped} from the left, sum becomes ${sum}.${sum >= target ? " Still valid, shrink again." : " Invalid now, so grow again."}`,
        state: { target, sum, best },
      });
    }
  }
  frames.push({ array: [...a], marks: [], pointers: [], note: best ? `Done. The shortest stretch reaching ${target} has length ${best}. Each index entered and left once: O(n).` : `Done. No stretch reaches ${target}.`, state: { target, best: best || "none" } });
  return { frames, result: best };
}

/** Monotonic deque of indices (values decreasing): window maximum for every window of size k. result = the maxima. */
export function traceDequeMax(values: readonly number[], k: number): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  const out: number[] = [];
  if (!a.length || k < 1 || k > a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: a.length ? `Window size must be between 1 and ${a.length}.` : "Empty input.", state: { k } });
    return { frames, result: [] };
  }
  const dq: number[] = []; // indices; values strictly decreasing from front to back
  const show = () => (dq.length ? `[${dq.map((i) => `${a[i]}@${i}`).join(", ")}]` : "[]");
  for (let i = 0; i < a.length; i++) {
    const popped: number[] = [];
    while (dq.length && a[dq[dq.length - 1]] <= a[i]) popped.push(a[dq.pop()!]);
    dq.push(i);
    frames.push({
      array: [...a], marks: [...dq.map((index) => ({ index, kind: "key" as const })), { index: i, kind: "compare" }], pointers: [{ label: "i", index: i }],
      note: popped.length ? `Push ${a[i]}. It pops ${popped.join(", ")} off the back: they are no larger and older, so they can never be a maximum again.` : `Push ${a[i]}. Nothing smaller sits at the back, so the deque stays decreasing.`,
      state: { k, deque: show(), out: `[${out.join(", ")}]` },
    });
    const lo = i - k + 1;
    if (dq[0] < lo) {
      const gone = dq.shift()!;
      frames.push({
        array: [...a], marks: dq.map((index) => ({ index, kind: "key" as const })), pointers: [{ label: "i", index: i }], window: [Math.max(0, lo), i],
        note: `The front index ${gone} fell out of the window [${lo}, ${i}], so pop it from the front.`,
        state: { k, deque: show(), out: `[${out.join(", ")}]` },
      });
    }
    if (lo >= 0) {
      out.push(a[dq[0]]);
      frames.push({
        array: [...a], marks: [{ index: dq[0], kind: "found" }], pointers: [{ label: "i", index: i }], window: [lo, i],
        note: `Window [${lo}, ${i}] is full. The front of the deque is the maximum: ${a[dq[0]]}.`,
        state: { k, deque: show(), out: `[${out.join(", ")}]` },
      });
    }
  }
  frames.push({ array: [...a], marks: [], pointers: [], note: `Done: ${out.length} maxima. Every index is pushed once and popped at most once, so O(n) total, not O(nk).`, state: { k, out: `[${out.join(", ")}]` } });
  return { frames, result: out };
}
