import type { GymDef } from "@/lib/gym/types";

/** Array Atoll gym (GDD §5.5, CUR R2): two pointers, prefix sums and hashing. Original statements; options are the tool to reach for. */
export const arrayAtollGym: GymDef = {
  id: "r2-gym",
  region: "R2",
  name: "Tidecaller Gym",
  leader: {
    id: "tidecaller-mira",
    name: "Tidecaller Mira",
    title: "Keeper of the Tide Staff",
    lines: {
      intro: "Four cells on my staff, lit one after another: that is how I read a tide. Index by index, running total by running total. Read the water as fast as it moves.",
      win: "The tide came in and you read every wave. Take the Tidal Badge: you know when to walk two pointers and when to keep a running total.",
      lose: "The wave pulled you under. Wash off, look at which end moved, and walk the shore again.",
    },
  },
  badge: { id: "badge-tidal", name: "Tidal Badge" },
  blitzSeconds: 20,
  blitz: [
    {
      id: "g2-pairsum", statement: "An unsorted list of numbers and a target. Say whether any two entries add up to the target, scanning the list only once.",
      options: ["unordered_map of values seen so far", "sort then binary search each entry", "nested loops over all pairs", "prefix sums over the list"],
      answer: "unordered_map of values seen so far", why: "For each x ask whether target - x was already seen. One pass, O(n) expected. Sorting would also work but costs O(n log n) and loses the original positions.",
    },
    {
      id: "g2-palin", statement: "Decide whether a word reads the same backwards, ignoring nothing, using no copy of the word.",
      options: ["two pointers walking inward from both ends", "unordered_map of letter counts", "prefix sums of character codes", "sort the characters"],
      answer: "two pointers walking inward from both ends", why: "Compare s[l] and s[r], then move both inward. O(n) time and O(1) extra space.",
    },
    {
      id: "g2-rangesum", statement: "A fixed list of numbers is queried a hundred thousand times. Each query asks for the total of positions l through r.",
      options: ["prefix sums, answer in O(1) per query", "re-add the range for every query", "two pointers per query", "sort the list first"],
      answer: "prefix sums, answer in O(1) per query", why: "Build prefix[i] once in O(n); then every range is prefix[r+1] - prefix[l]. Re-adding costs O(n) per query.",
    },
    {
      id: "g2-negs", statement: "Count the stretches of a list with total exactly K. The values may be negative.",
      options: ["prefix sums plus a map of earlier prefix counts", "sliding window that shrinks when the total is too big", "sort and two pointers", "a bucket array indexed by value"],
      answer: "prefix sums plus a map of earlier prefix counts", why: "With negatives a window cannot be shrunk greedily. A stretch sums to K iff an earlier prefix equals the current prefix minus K, so count earlier prefixes in a hash map.",
    },
    {
      id: "g2-container", statement: "Vertical walls of various heights stand in a row. Pick two walls to hold the most water between them.",
      options: ["two pointers, always move the shorter wall inward", "prefix sums of heights", "unordered_map from height to index", "sort the walls by height"],
      answer: "two pointers, always move the shorter wall inward", why: "The shorter wall caps the area. Moving the taller one can only shrink the width without raising the cap, so move the shorter one.",
    },
    {
      id: "g2-ranges", statement: "Many updates each add the same amount to every position in l..r of a long array; only after all updates do you read the array once.",
      options: ["difference array, then one prefix-sum pass", "apply each update with a loop over l..r", "unordered_map from position to total", "two pointers over the updates"],
      answer: "difference array, then one prefix-sum pass", why: "Add at diff[l] and subtract at diff[r+1]: O(1) per update. One prefix-sum sweep at the end rebuilds the array.",
    },
    {
      id: "g2-sortedpairs", statement: "A sorted array and a target: find two entries that sum to it using O(1) extra space.",
      options: ["two pointers from both ends", "unordered_map of seen values", "prefix sums", "recursion on halves"],
      answer: "two pointers from both ends", why: "Sorted order tells which end to move: too small moves the left pointer up, too large moves the right pointer down. No map needed.",
      review: true,
    },
    {
      id: "g2-count", statement: "Count how many times each distinct integer appears in a list, values up to 10^9.",
      options: ["unordered_map<int, int> counter", "an int array of size 10^9", "prefix sums over the values", "std::stoi on every element"],
      answer: "unordered_map<int, int> counter", why: "Values are too sparse for an array of size 10^9; a hash map keeps only the keys that occur.",
      review: true,
    },
  ],
  coreProblemId: "exact-stretches",
  signatureProblemId: "tide-pools",
  twist: {
    id: "narrowing",
    title: "Narrowing is an error",
    rule: "In the signature round the judge compiles with -Wall -Wextra -Wshadow -Wconversion -Werror (sign-conversion left off): an implicit long long to int narrowing or a shadowed name is a compile error, and the battle continues without a heart lost.",
    teaches: "Choosing the right integer width on purpose: sums, counts and prefix totals belong in long long, and the compiler can prove you did it.",
  },
};
