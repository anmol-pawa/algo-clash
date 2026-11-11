import type { Frame, TableRow, Trace } from "./types";

export const MAX_BUCKETS = 8;

const mod = (x: number, m: number) => ((x % m) + m) % m;

/**
 * Separate-chaining hash set with integer keys. Bucket = key mod bucketCount. When one more key would push the
 * load factor above 1, the table doubles and every key is re-placed (a rehash). Duplicates are ignored.
 * result = the final chain length of every bucket.
 */
export function traceChainedTable(keys: readonly number[], initialBuckets: number): Trace {
  const a = [...keys];
  const frames: Frame[] = [];
  if (initialBuckets < 1 || initialBuckets > MAX_BUCKETS) {
    frames.push({ array: a, marks: [], pointers: [], note: `Start with between 1 and ${MAX_BUCKETS} buckets.`, state: { buckets: initialBuckets } });
    return { frames, result: null };
  }
  let buckets: number[][] = Array.from({ length: initialBuckets }, () => []);
  let size = 0;
  const rows = (hot = -1): TableRow[] => buckets.map((chain, j) => ({ label: `bucket ${j}`, items: chain.map(String), hot: j === hot }));
  const st = () => ({ buckets: buckets.length, size, load: (size / buckets.length).toFixed(2) });
  frames.push({ array: a, marks: [], pointers: [], note: `An empty table with ${buckets.length} bucket${buckets.length > 1 ? "s" : ""}. A key goes to bucket (key mod ${buckets.length}). Two keys in one bucket form a chain.`, state: st(), table: rows(), tableTitle: "Buckets" });
  for (let i = 0; i < a.length; i++) {
    const key = a[i];
    const pointers = [{ label: "key", index: i }];
    let at = mod(key, buckets.length);
    if (buckets[at].includes(key)) {
      frames.push({
        array: [...a], marks: [{ index: i, kind: "found" }], pointers, state: st(), table: rows(at), tableTitle: "Buckets",
        note: `${key} mod ${buckets.length} = ${at}. Walk that chain: ${key} is already there, so a set ignores the duplicate. The walk costs the chain length, not the table size.`,
      });
      continue;
    }
    if (size + 1 > buckets.length) {
      const old = buckets.length;
      const next: number[][] = Array.from({ length: old * 2 }, () => []);
      for (const chain of buckets) for (const k of chain) next[mod(k, old * 2)].push(k);
      buckets = next;
      frames.push({
        array: [...a], marks: [{ index: i, kind: "swap" }], pointers, state: st(), table: rows(), tableTitle: "Buckets",
        note: `Adding ${key} would push the load factor above 1, so rehash: ${old} buckets become ${old * 2} and every key is re-placed with key mod ${old * 2}. One rehash costs O(size), but doubling makes it rare: insert stays O(1) amortised.`,
      });
      at = mod(key, buckets.length);
    }
    const collided = buckets[at].length > 0;
    buckets[at].push(key);
    size++;
    frames.push({
      array: [...a], marks: [{ index: i, kind: "compare" }], pointers, state: st(), table: rows(at), tableTitle: "Buckets",
      note: collided
        ? `${key} mod ${buckets.length} = ${at}, and that bucket is already used: a collision. ${key} joins the chain, which is now ${buckets[at].length} long. Long chains are what make lookups slow.`
        : `${key} mod ${buckets.length} = ${at}, an empty bucket. ${key} goes straight in.`,
    });
  }
  const lens = buckets.map((c) => c.length);
  const longest = Math.max(...lens);
  frames.push({ array: [...a], marks: [], pointers: [], state: st(), table: rows(), tableTitle: "Buckets", note: `Done: ${size} distinct key${size === 1 ? "" : "s"} in ${buckets.length} buckets, longest chain ${longest}. With a good hash and load factor at most 1, chains stay short, so lookups are O(1) on average (O(n) in the worst case).` });
  return { frames, result: lens };
}

export const ROLL_BASE = 31;
export const ROLL_MOD = 101;

/**
 * Rolling hash over every window of length k, finding windows that repeat an earlier window.
 * hash(window) = sum a[j] * B^(k-1-(j-start)) mod M, updated in O(1) per slide. A deliberately small modulus makes
 * collisions visible: a hash match is only a suspect until the real contents are compared.
 * result = start indices whose window equals (by content) some earlier window.
 */
export function traceRollingRepeats(values: readonly number[], k: number): Trace {
  const a = [...values];
  const frames: Frame[] = [];
  const out: number[] = [];
  if (!a.length || k < 1 || k > a.length) {
    frames.push({ array: a, marks: [], pointers: [], note: a.length ? `Window length must be between 1 and ${a.length}.` : "Empty input.", state: { k } });
    return { frames, result: [] };
  }
  const B = ROLL_BASE;
  const M = ROLL_MOD;
  let top = 1; // B^(k-1) mod M: the weight of the leftmost element
  for (let j = 1; j < k; j++) top = (top * B) % M;
  const seen = new Map<number, number[]>(); // hash -> starts, in order
  const rows = (hot = -1): TableRow[] => [...seen.entries()].sort((x, y) => x[0] - y[0]).map(([h, starts]) => ({ label: `hash ${h}`, items: starts.map((s) => `@${s}`), hot: h === hot }));
  const inWin = (lo: number) => Array.from({ length: k }, (_, d) => ({ index: lo + d, kind: "inWindow" as const }));
  let h = 0;
  for (let j = 0; j < k; j++) h = (h * B + mod(a[j], M)) % M;
  for (let s = 0; s + k <= a.length; s++) {
    let how: string;
    if (s === 0) {
      how = `Hash the first window from scratch: ${k} multiply-adds, done once.`;
    } else {
      const dropped = a[s - 1];
      const added = a[s + k - 1];
      h = mod(mod(h - mod(dropped, M) * top, M) * B + mod(added, M), M);
      how = `Slide: remove ${dropped}'s share (${dropped} × ${top}), shift everything up one place (× ${B}), add ${added}. O(1), no re-reading the window.`;
    }
    const prior = seen.get(h) ?? [];
    const match = prior.find((p) => a.slice(p, p + k).every((v, d) => v === a[s + d]));
    const base: Omit<Frame, "note" | "marks"> = { array: [...a], pointers: [{ label: "L", index: s }, { label: "R", index: s + k - 1 }], window: [s, s + k - 1], tableTitle: "Seen hashes (all mod " + M + ")" };
    if (!prior.length) {
      seen.set(h, [s]);
      frames.push({ ...base, marks: inWin(s), table: rows(h), state: { k, hash: h, repeats: out.length }, note: `${how} Hash ${h} is new, so record this window (start ${s}).` });
    } else if (match !== undefined) {
      out.push(s);
      seen.get(h)!.push(s);
      frames.push({ ...base, marks: inWin(s).map((m) => ({ ...m, kind: "found" as const })), table: rows(h), state: { k, hash: h, repeats: out.length }, note: `${how} Hash ${h} was seen at start ${match}. Verify: the actual values match, so this window repeats the one at ${match}.` });
    } else {
      seen.get(h)!.push(s);
      frames.push({ ...base, marks: inWin(s).map((m) => ({ ...m, kind: "swap" as const })), table: rows(h), state: { k, hash: h, repeats: out.length }, note: `${how} Hash ${h} was seen at start ${prior[0]}, but the values differ: a collision. This is why a hash match must be verified (or use a bigger modulus, or two).` });
    }
  }
  frames.push({ array: [...a], marks: [], pointers: [], state: { k, repeats: out.length }, note: `Done: ${out.length} window${out.length === 1 ? "" : "s"} repeat an earlier one${out.length ? ` (starts ${out.join(", ")})` : ""}. ${a.length - k + 1} windows cost O(n) hashing plus verification on hash matches.` });
  return { frames, result: out };
}
