import type { Frame, Trace } from "./types";

type Entry = { key: string; value: string; hot?: boolean };
const entries = (m: Map<number, number>, hotKey?: number): Entry[] =>
  [...m].map(([k, v]) => ({ key: String(k), value: String(v), hot: k === hotKey }));

/** Two-sum with a hash map (value -> index). result = [earlierIndex, laterIndex] or null. */
export function traceTwoSumMap(values: readonly number[], target: number): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  const seen = new Map<number, number>();
  for (let i = 0; i < a.length; i++) {
    const need = target - a[i];
    const j = seen.get(need);
    const base = { array: [...a], pointers: [{ label: "i", index: i }], state: { target, need } };
    if (j !== undefined) {
      frames.push({
        ...base,
        marks: [{ index: j, kind: "found" }, { index: i, kind: "found" }],
        table: { title: "seen: value → index", entries: entries(seen, need) },
        note: `Look up ${need} (= ${target} - ${a[i]}): it is in the map at index ${j}. Pair found: ${a[j]} + ${a[i]} = ${target}.`,
      });
      return { frames, result: [j, i] };
    }
    frames.push({
      ...base,
      marks: [{ index: i, kind: "compare" }],
      table: { title: "seen: value → index", entries: entries(seen) },
      note: `Look up ${need} (= ${target} - ${a[i]}): not in the map yet. Remember ${a[i]} at index ${i} and move on. One O(1) lookup, no rescan.`,
    });
    seen.set(a[i], i);
  }
  frames.push({
    array: [...a], marks: [], pointers: [], state: { target },
    table: { title: "seen: value → index", entries: entries(seen) },
    note: a.length ? "Reached the end: no two values sum to the target." : "Empty input: no pair.",
  });
  return { frames, result: null };
}

/** Count stretches with sum exactly k: prefix sums plus a count of earlier prefixes. result = count. */
export function tracePrefixCount(values: readonly number[], k: number): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  const freq = new Map<number, number>([[0, 1]]);
  let prefix = 0;
  let count = 0;
  frames.push({
    array: [...a], marks: [], pointers: [], state: { k, prefix, count },
    table: { title: "earlier prefix sums: prefix → times seen", entries: entries(freq) },
    note: "Seed the map with prefix 0 seen once: it stands for the empty start, so a stretch beginning at index 0 can match.",
  });
  for (let i = 0; i < a.length; i++) {
    prefix += a[i];
    const want = prefix - k;
    const hits = freq.get(want) ?? 0;
    count += hits;
    frames.push({
      array: [...a], marks: [{ index: i, kind: hits ? "found" : "compare" }], pointers: [{ label: "i", index: i }],
      state: { k, prefix, want, count },
      table: { title: "earlier prefix sums: prefix → times seen", entries: entries(freq, want) },
      note: hits
        ? `Prefix is ${prefix}. A stretch ending here sums to ${k} for each earlier prefix equal to ${want}: ${hits} of them. Count is now ${count}.`
        : `Prefix is ${prefix}. No earlier prefix equals ${want}, so no stretch ending here sums to ${k}.`,
    });
    freq.set(prefix, (freq.get(prefix) ?? 0) + 1);
  }
  return { frames, result: count };
}

/** Kadane: best sum of a non-empty contiguous stretch. result = best sum. */
export function traceKadane(values: readonly number[]): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  if (!a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: "Empty input: there is no stretch." });
    return { frames, result: null };
  }
  let cur = a[0];
  let start = 0;
  let best = a[0];
  const mk = (i: number, note: string): Frame => ({
    array: [...a],
    marks: Array.from({ length: i - start + 1 }, (_, d) => ({ index: start + d, kind: "inWindow" as const })),
    pointers: [{ label: "i", index: i }],
    window: [start, i],
    state: { cur, best },
    note,
  });
  frames.push(mk(0, `Start with ${a[0]}: the best stretch ending here is just itself.`));
  for (let i = 1; i < a.length; i++) {
    let note: string;
    if (cur < 0) {
      cur = a[i];
      start = i;
      note = `The stretch so far sums to a negative, so it can only hurt. Restart at ${a[i]}.`;
    } else {
      cur += a[i];
      note = `The stretch so far is not negative, so keep it and add ${a[i]}. Best stretch ending here: ${cur}.`;
    }
    if (cur > best) {
      best = cur;
      note += ` New best: ${best}.`;
    }
    frames.push(mk(i, note));
  }
  return { frames, result: best };
}
