import type { GymDef } from "@/lib/gym/types";
import type { ForbiddenRule } from "@/lib/gym/twist";

/** Array Atoll gym (GDD §5.5, CUR §3 R2): hashing, two pointers, prefix sums. Original statements. */
export const arrayAtollGym: GymDef = {
  id: "r2-gym",
  region: "R2",
  name: "Tidecaller Gym",
  leader: {
    id: "tidecaller-mira",
    name: "Tidecaller Mira",
    title: "Keeper of the Indexed Tide",
    lines: {
      intro: "The tide keeps one ledger: where the water stood, how far it ran, what it carried back. Read the shore the way I do and name the tool before the wave breaks.",
      win: "You read the tide and the walls both. Take the Tide Badge: you know when a map helps and when two hands are enough.",
      lose: "A wave took the plan. Study where the water went and wade back in.",
    },
  },
  badge: { id: "badge-tide", name: "Tide Badge" },
  blitzSeconds: 20,
  blitz: [
    {
      id: "g2-pair", statement: "Given a list and a target, say whether any two different entries add up to it. The list is unsorted, has up to a million entries, and you must finish in O(n) expected time.",
      options: ["unordered_map of seen values, one pass", "sort then two pointers", "nested loops over all pairs", "prefix sums over the list"],
      answer: "unordered_map of seen values, one pass", why: "Unsorted and O(n) required: remember each value as you go and ask whether target - x was seen. Sorting first costs O(n log n).",
    },
    {
      id: "g2-negstretch", statement: "Count the stretches of consecutive entries that add up to exactly k. Entries can be negative.",
      options: ["prefix sums counted in an unordered_map", "sliding window that shrinks when the sum is too big", "sort the entries first", "binary search on the stretch length"],
      answer: "prefix sums counted in an unordered_map", why: "Negatives break the grow-and-shrink window. A stretch sums to k exactly when two prefixes differ by k, so count earlier prefixes.",
    },
    {
      id: "g2-palin", statement: "Decide whether a word reads the same forwards and backwards, using no extra memory.",
      options: ["two pointers moving inward", "unordered_map of letter counts", "prefix sums of characters", "sort the characters"],
      answer: "two pointers moving inward", why: "Compare the outside pair and step toward the middle: O(n) time, O(1) space.",
    },
    {
      id: "g2-range", statement: "Answer many questions of the form \"what is the total of entries from index a to index b\" on a list that never changes.",
      options: ["prefix sum array", "re-add the range every time", "unordered_set of entries", "two pointers from both ends"],
      answer: "prefix sum array", why: "Build prefix once in O(n); every range total is prefix[b+1] - prefix[a] in O(1).",
    },
    {
      id: "g2-anagram", statement: "Group words so that words made of the same letters end up together.",
      options: ["unordered_map from a canonical key (sorted word or letter counts) to a list", "two pointers over the sorted word list", "prefix sums of word lengths", "nested loops comparing every pair letter by letter"],
      answer: "unordered_map from a canonical key (sorted word or letter counts) to a list", why: "Words in one group share a canonical key, so a hash map from key to members groups them in one pass.",
    },
    {
      id: "g2-best-run", statement: "Find the largest possible total of one stretch of consecutive entries. Entries can be negative and the stretch must be non-empty.",
      options: ["Kadane: restart when the running total drops below zero", "unordered_map of prefix totals", "two pointers closing inward", "sort and take the largest entries"],
      answer: "Kadane: restart when the running total drops below zero", why: "A negative running total can only hurt the stretch ahead, so drop it and start fresh at the next entry.",
    },
    {
      id: "g2-const-ref", statement: "A helper only reads a vector of a hundred thousand entries. How should it take the vector?",
      options: ["const vector<int>&", "vector<int> by value", "vector<int>&& and move it", "a raw int* and a size"],
      answer: "const vector<int>&", why: "A const reference avoids the O(n) copy and stops accidental writes.", review: true,
    },
    {
      id: "g2-overflow", statement: "Add up a hundred thousand values each up to one billion. The total must be exact.",
      options: ["long long accumulator starting at 0LL", "int accumulator", "float accumulator", "unsigned int accumulator"],
      answer: "long long accumulator starting at 0LL", why: "The total can reach 10^14. Start the accumulator as 64-bit so the addition itself is 64-bit.", review: true,
    },
  ],
  coreProblemId: "exact-stretches",
  signatureProblemId: "tide-pools",
  twist: {
    id: "dry-tide",
    title: "Dry tide",
    rule: "In the signature round the judge rejects any extra container (map, set, stack, queue, or a second vector) before compiling. Only variables and the input vector may hold data. A rejection never costs a heart.",
    teaches: "Telling O(n) extra memory from O(1): the same water can be counted with two pointers and two integers instead of prefix-maximum arrays.",
  },
};

/** The Dry tide rule set (applied to the signature round). The input `vector<int>` in the signature is the one allowed vector. */
export const dryTideRules: ForbiddenRule[] = [
  { pattern: /\b(?:unordered_map|unordered_set|unordered_multimap|unordered_multiset|map|set|multimap|multiset|stack|queue|deque|priority_queue|list|array|bitset)\s*</, message: "Dry tide: no map, set, stack, queue or other container in this round. Two pointers and a few integers are enough." },
  { pattern: /\bvector\s*</, allowed: 1, message: "Dry tide: only the input vector is allowed. A second vector (such as a prefix-maximum array) is O(n) extra space." },
  { pattern: /\bnew\b/, message: "Dry tide: no heap allocation in this round." },
];

export const allR2Gyms: GymDef[] = [arrayAtollGym];
