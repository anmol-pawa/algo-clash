import type { GymDef } from "@/lib/gym/types";
import type { ForbiddenRule } from "@/lib/gym/twist";

/** Hashwood Harbor gym (GDD §5.5, CUR §3 R4): hash-map design, key design, rolling hashes. Original statements. */
export const hashwoodHarborGym: GymDef = {
  id: "r4-gym",
  region: "R4",
  name: "Hydra Gym",
  leader: {
    id: "hydra-of-hashwood",
    name: "Hydra of Hashwood",
    title: "Warden of the Bucket Wall",
    lines: {
      intro: "Three heads, one slot, and every locker on this wall hides a chain. Cut one collision and two more grow back. Bring a key that tells things apart, or go home.",
      win: "You hashed with care and checked before you believed. Take the Bucket Badge: the heads have nothing left to hide behind.",
      lose: "A collision slipped past you. A matching hash is only a candidate. Look again, and compare.",
    },
  },
  badge: { id: "badge-bucket", name: "Bucket Badge" },
  blitzSeconds: 20,
  blitz: [
    {
      id: "g4-bijection", statement: "Two equally long lists of words are given. Decide whether they follow the same pattern: whenever two words in one list are equal, the words at the same places in the other list are equal, and the other way round.",
      options: ["two hash maps, one in each direction", "one hash map from the first list to the second", "sort both lists and compare", "two pointers over both lists"],
      answer: "two hash maps, one in each direction", why: "One map only proves that equal words map to equal words. The reverse check needs a second map, otherwise two different words could share one partner.",
    },
    {
      id: "g4-shift-key", statement: "Group strings that are shifted copies of each other: every letter moved the same number of steps along the alphabet, wrapping around, so that \"abc\" and \"bcd\" belong together.",
      options: ["hash map keyed by the gaps between neighbouring letters", "hash map keyed by the sorted letters", "sort the strings and compare neighbours", "prefix sums of letter codes"],
      answer: "hash map keyed by the gaps between neighbouring letters", why: "A shift keeps the gap between neighbouring letters (mod 26) unchanged, so the gap sequence is a canonical key that every shifted copy shares.",
    },
    {
      id: "g4-random", statement: "Design a bag that supports insert, remove and \"give me a uniformly random element\", each in O(1) average time.",
      options: ["vector of values plus a hash map from value to index; swap with the last on removal", "unordered_set only", "balanced tree with an order-statistic walk", "sorted vector with binary search"],
      answer: "vector of values plus a hash map from value to index; swap with the last on removal", why: "The vector gives O(1) random access, the map finds a value's slot, and swapping the removed slot with the last one keeps the vector gap-free.",
    },
    {
      id: "g4-dna", statement: "A strand has a million letters from a four-letter alphabet. Report every block of exactly ten letters that occurs at least twice.",
      options: ["slide a 2-bit-per-letter integer key and count it in a hash map", "compare every pair of blocks letter by letter", "sort the strand and binary search", "a monotonic deque of block starts"],
      answer: "slide a 2-bit-per-letter integer key and count it in a hash map", why: "Ten letters at two bits each fit in 20 bits, so the key is exact (no collisions) and updating it as the block slides costs O(1).",
    },
    {
      id: "g4-bsearch-hash", statement: "Find the longest block of a long string that occurs at two different positions. Note that if a block of length L repeats, a block of length L - 1 repeats too.",
      options: ["binary search on the length, checking each length with a rolling hash", "variable window that shrinks on a repeat", "prefix sums of the letters", "union-find over positions"],
      answer: "binary search on the length, checking each length with a rolling hash", why: "Repeating is monotone in the length, so binary search finds the boundary; each probe is one O(n) rolling-hash pass, for O(n log n) overall.",
    },
    {
      id: "g4-flood", statement: "A judge feeds your unordered_map<int, int> thousands of keys picked to land in the same bucket, and it crawls. What is the standard fix?",
      options: ["a custom hash that scrambles the key with a per-run random seed", "call reserve() with a bigger number", "switch the key from int to long long", "sort the keys before inserting them"],
      answer: "a custom hash that scrambles the key with a per-run random seed", why: "The default integer hash is the identity, so keys that are multiples of the bucket count collide. A seeded mixing hash cannot be predicted ahead of time. std::map is the other safe fallback at O(log n) per operation.",
    },
    {
      id: "g3-twice", statement: "Find the longest stretch of a string in which no letter appears more than twice.",
      options: ["variable window: grow right, shrink left while a count is too high", "fixed window of length two", "sort the letters first", "hash every block of every length"],
      answer: "variable window: grow right, shrink left while a count is too high", why: "The stretch is repaired by shrinking from the left; both edges only move forward, so the pass is O(n).", review: true,
    },
    {
      id: "g2-prefix-map", statement: "Count the stretches of consecutive entries that add up to exactly k. Entries can be negative.",
      options: ["prefix sums counted in an unordered_map", "sliding window that shrinks when the sum is too big", "sort the entries first", "binary search on the stretch length"],
      answer: "prefix sums counted in an unordered_map", why: "Negatives break the shrink rule. A stretch sums to k exactly when two prefixes differ by k, so count earlier prefixes in a hash map.", review: true,
    },
  ],
  coreProblemId: "echo-strand",
  signatureProblemId: "longest-echo",
  twist: {
    id: "hash-flood",
    title: "Hash flood",
    rule: "In the signature round the hidden tests include strands built to break a naive hash (a Thue-Morse word collides in a 64-bit overflow hash). The judge also rejects, before compiling, any number-keyed unordered_map or unordered_set that never compares the real letters of a match. A rejection never costs a heart.",
    teaches: "A matching hash is a candidate, not a proof: verify with a real comparison, use a second modulus, or a seeded custom hash; fall back to std::map when the keys may be adversarial.",
  },
};

/** The Hash flood rule: integer-keyed hash containers need a real comparison somewhere in the code (applied to the signature round). */
export const hashFloodRules: ForbiddenRule[] = [
  {
    pattern: /\bunordered_(?:map|set|multimap|multiset)\s*<\s*(?:unsigned\s+)?(?:long\s+long|long|int|uint64_t|uint32_t|size_t|__int128)\b/,
    unless: /\.compare\s*\(|\bequal\s*\(|\bmemcmp\s*\(|\bstrncmp\s*\(|substr\s*\([^;]*\)\s*==|==\s*[\w.]+\.substr\s*\(/,
    message: "Hash flood: a number-keyed hash container found a match, but nothing compares the real letters. A matching hash is only a candidate. Verify it (s.compare(...)), or the Hydra's colliding strands will fool you.",
  },
];

export const allR4Gyms: GymDef[] = [hashwoodHarborGym];
