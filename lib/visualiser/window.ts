import type { Frame, Trace } from "./types";

/** Sorted array, find a pair summing to target by walking two pointers inward. result = [i, j] or null. */
export function tracePairSum(sorted: readonly number[], target: number): Trace {
  const a = [...sorted];
  const frames: Frame[] = [];
  let l = 0;
  let r = a.length - 1;
  const base = (note: string, kind: "compare" | "found") => {
    const sum = l < r ? a[l] + a[r] : 0;
    frames.push({
      array: [...a],
      marks: l < r ? [{ index: l, kind }, { index: r, kind }] : [],
      pointers: l <= r ? [{ label: "L", index: l }, { label: "R", index: r }] : [],
      note,
      state: { target, sum },
    });
  };
  if (a.length < 2) {
    frames.push({ array: [...a], marks: [], pointers: [], note: "Fewer than two values: no pair.", state: { target } });
    return { frames, result: null };
  }
  while (l < r) {
    const sum = a[l] + a[r];
    if (sum === target) {
      base(`${a[l]} + ${a[r]} = ${target}. Found the pair.`, "found");
      return { frames, result: [l, r] };
    }
    if (sum < target) {
      base(`${a[l]} + ${a[r]} = ${sum} is too small. Only moving L right can raise it (R is already the biggest left).`, "compare");
      l++;
    } else {
      base(`${a[l]} + ${a[r]} = ${sum} is too big. Only moving R left can lower it.`, "compare");
      r--;
    }
  }
  frames.push({ array: [...a], marks: [], pointers: [], note: "Pointers met: no pair sums to the target.", state: { target } });
  return { frames, result: null };
}

/** Fixed-size window: slide by adding the entering value and removing the leaving one. result = best sum. */
export function traceWindowMax(values: readonly number[], k: number): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  if (k < 1 || k > a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: `Window size ${k} does not fit in ${a.length} values.` });
    return { frames, result: null };
  }
  let sum = 0;
  for (let i = 0; i < k; i++) sum += a[i];
  let best = sum;
  const mk = (lo: number, note: string): Frame => ({
    array: [...a],
    marks: Array.from({ length: k }, (_, d) => ({ index: lo + d, kind: "inWindow" as const })),
    pointers: [{ label: "lo", index: lo }, { label: "hi", index: lo + k - 1 }],
    window: [lo, lo + k - 1],
    note,
    state: { sum, best },
  });
  frames.push(mk(0, `First window sums to ${sum}.`));
  for (let hi = k; hi < a.length; hi++) {
    sum += a[hi] - a[hi - k];
    best = Math.max(best, sum);
    frames.push(mk(hi - k + 1, `Add ${a[hi]}, drop ${a[hi - k]}: sum ${sum}. Best so far ${best}. O(1) per slide.`));
  }
  return { frames, result: best };
}

/** Variable window: longest stretch with no repeated value. result = length. */
export function traceLongestDistinct(values: readonly number[]): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  const lastSeen = new Map<number, number>();
  let lo = 0;
  let best = 0;
  const mk = (hi: number, note: string): Frame => ({
    array: [...a],
    marks: hi >= lo ? Array.from({ length: hi - lo + 1 }, (_, d) => ({ index: lo + d, kind: "inWindow" as const })) : [],
    pointers: [{ label: "lo", index: lo }, { label: "hi", index: hi }],
    window: hi >= lo ? [lo, hi] : undefined,
    note,
    state: { best, length: hi - lo + 1 },
  });
  if (!a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: "Empty input: length 0." });
    return { frames, result: 0 };
  }
  for (let hi = 0; hi < a.length; hi++) {
    const prev = lastSeen.get(a[hi]);
    if (prev !== undefined && prev >= lo) {
      lo = prev + 1;
      best = Math.max(best, hi - lo + 1);
      frames.push(mk(hi, `${a[hi]} was already inside the window: jump lo to ${lo} so it is unique again.`));
    } else {
      best = Math.max(best, hi - lo + 1);
      frames.push(mk(hi, `${a[hi]} is new to the window: grow it. Length ${hi - lo + 1}.`));
    }
    lastSeen.set(a[hi], hi);
  }
  return { frames, result: best };
}
