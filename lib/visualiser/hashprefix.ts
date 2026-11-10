import type { Frame, Trace } from "./types";

const fmtMap = (m: Map<number, number>) => (m.size ? `{${[...m].map(([k, v]) => `${k}:${v}`).join(", ")}}` : "{}");

/** One pass with an unordered_map: for each value, look up target - value among earlier values. result = [i, j] (i < j) or null. */
export function traceTwoSumMap(values: readonly number[], target: number): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  const seen = new Map<number, number>(); // value -> index
  const show = (m: Map<number, number>) => `${fmtMap(m)} (value:index)`;
  if (!a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: "Empty input: no pair.", state: { target, map: "{}" } });
    return { frames, result: null };
  }
  for (let i = 0; i < a.length; i++) {
    const need = target - a[i];
    const at = seen.get(need);
    if (at !== undefined) {
      frames.push({
        array: [...a],
        marks: [{ index: at, kind: "found" }, { index: i, kind: "found" }],
        pointers: [{ label: "i", index: i }],
        note: `Need ${need} for ${a[i]}. The map has it at index ${at}: ${a[at]} + ${a[i]} = ${target}. Found in one pass.`,
        state: { target, need, map: show(seen) },
      });
      return { frames, result: [at, i] };
    }
    frames.push({
      array: [...a],
      marks: [{ index: i, kind: "compare" }, ...[...seen.values()].map((index) => ({ index, kind: "key" as const }))],
      pointers: [{ label: "i", index: i }],
      note: `Need ${need} for ${a[i]}. Not in the map (average O(1) lookup), so store ${a[i]} -> ${i} and move on.`,
      state: { target, need, map: show(seen) },
    });
    if (!seen.has(a[i])) seen.set(a[i], i);
  }
  frames.push({ array: [...a], marks: [], pointers: [], note: "Reached the end: no two values sum to the target.", state: { target, map: show(seen) } });
  return { frames, result: null };
}

/** Prefix sums + count map: how many stretches sum to k. result = count. Negatives are fine. */
export function tracePrefixCount(values: readonly number[], k: number): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  const count = new Map<number, number>([[0, 1]]);
  let prefix = 0;
  let total = 0;
  if (!a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: "Empty input: zero stretches.", state: { k, count: 0 } });
    return { frames, result: 0 };
  }
  frames.push({
    array: [...a], marks: [], pointers: [],
    note: "Seed the map with prefix 0 seen once: it stands for the empty start, so stretches that begin at index 0 are counted.",
    state: { k, prefix, found: total, seen: fmtMap(count) },
  });
  for (let i = 0; i < a.length; i++) {
    prefix += a[i];
    const hits = count.get(prefix - k) ?? 0;
    total += hits;
    frames.push({
      array: [...a],
      marks: [{ index: i, kind: hits ? "found" : "compare" }],
      pointers: [{ label: "i", index: i }],
      note: hits
        ? `Prefix is ${prefix}. An earlier prefix of ${prefix - k} was seen ${hits} time(s), so ${hits} stretch(es) ending here sum to ${k}. Total ${total}.`
        : `Prefix is ${prefix}. No earlier prefix equals ${prefix - k}, so no stretch ending here sums to ${k}.`,
      state: { k, prefix, found: total, seen: fmtMap(count) },
    });
    count.set(prefix, (count.get(prefix) ?? 0) + 1);
  }
  return { frames, result: total };
}

/** Kadane: best stretch sum with at least one element. result = best sum. */
export function traceKadane(values: readonly number[]): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  if (!a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: "Empty input: no stretch to take." });
    return { frames, result: null };
  }
  let cur = a[0]!;
  let best = a[0]!;
  let start = 0;
  let bestLo = 0;
  let bestHi = 0;
  const mk = (i: number, note: string): Frame => ({
    array: [...a],
    marks: [
      ...Array.from({ length: bestHi - bestLo + 1 }, (_, d) => ({ index: bestLo + d, kind: "sorted" as const })),
      ...Array.from({ length: i - start + 1 }, (_, d) => ({ index: start + d, kind: "inWindow" as const })),
    ],
    pointers: [{ label: "i", index: i }],
    window: [start, i],
    note,
    state: { cur, best },
  });
  frames.push(mk(0, `Start: the stretch ending at index 0 is just ${a[0]}. Best so far ${best}.`));
  for (let i = 1; i < a.length; i++) {
    let note: string;
    if (cur < 0) {
      cur = a[i]!;
      start = i;
      note = `The running sum was negative, so it only drags ${a[i]} down: restart the stretch here. cur = ${cur}.`;
    } else {
      cur += a[i]!;
      note = `The running sum is not negative, so extending helps: cur = ${cur}.`;
    }
    if (cur > best) {
      best = cur;
      bestLo = start;
      bestHi = i;
      note += ` New best ${best}.`;
    }
    frames.push(mk(i, note));
  }
  return { frames, result: best };
}
