import type { GymDef } from "@/lib/gym/types";

/** Window Woods gym (GDD §5.5, CUR §3 R3): sliding windows and the monotonic deque. Original statements. */
export const windowWoodsGym: GymDef = {
  id: "r3-gym",
  region: "R3",
  name: "Pane Warden Gym",
  leader: {
    id: "pane-warden-sorrel",
    name: "Pane Warden Sorrel",
    title: "Keeper of the Sliding Pane",
    lines: {
      intro: "I have no patience for anyone who looks at the whole forest twice. One pane, two edges, every tree seen once. Show me you can slide.",
      win: "Quick and tidy: you let old trees fall out of the frame and never looked back. Take the Pane Badge.",
      lose: "You rescanned the glass. Slide the pane, do not repaint it. Again.",
    },
  },
  badge: { id: "badge-pane", name: "Pane Badge" },
  blitzSeconds: 20,
  blitz: [
    {
      id: "g3-fixed", statement: "Given a list of daily visitor counts and a width k, find the largest total over any k consecutive days. The list has up to a million entries.",
      options: ["fixed window: add the new day, subtract the day that left", "recompute every k-day total from scratch", "sort the days and take the k largest", "binary search on the answer"],
      answer: "fixed window: add the new day, subtract the day that left", why: "The window total changes by one entry in and one entry out, so every step is O(1) and the whole pass is O(n).",
    },
    {
      id: "g3-longest", statement: "Find the longest stretch of a string in which no letter appears more than twice.",
      options: ["variable window: grow right, shrink left while a count is too high", "fixed window of length two", "sort the letters first", "prefix sums over the alphabet"],
      answer: "variable window: grow right, shrink left while a count is too high", why: "The stretch stays valid by shrinking from the left; both edges only move forward, so the total work is O(n).",
    },
    {
      id: "g3-shortest", statement: "All entries are positive. Find the shortest stretch whose sum is at least T.",
      options: ["variable window: grow right, shrink left while the sum is still enough", "prefix sums and a monotonic deque", "Kadane's algorithm", "a hash map of earlier sums"],
      answer: "variable window: grow right, shrink left while the sum is still enough", why: "With positive entries a longer stretch never has a smaller sum, so shrink greedily from the left whenever the sum still meets T.",
    },
    {
      id: "g3-negshort", statement: "Entries can be negative. Find the shortest non-empty stretch whose sum is at least T.",
      options: ["prefix sums and a monotonic deque of start indices", "variable window that shrinks when the sum is big enough", "sort the entries", "two pointers from both ends"],
      answer: "prefix sums and a monotonic deque of start indices", why: "Negatives break the shrink rule. Keep prefix sums and a deque of increasing prefixes; pop the front while it is far enough below the current prefix.",
    },
    {
      id: "g3-maxwin", statement: "Report the largest value inside every window of width k as it slides across a list of a million entries.",
      options: ["monotonic deque of indices (values decreasing)", "re-scan each window for its maximum", "a hash map from value to count", "binary search on k"],
      answer: "monotonic deque of indices (values decreasing)", why: "A smaller value that sits before a larger one can never be a window maximum again, so pop it. The front of the deque is the answer, in O(n) total.",
    },
    {
      id: "g3-exactk", statement: "Count the stretches that contain exactly k distinct colours.",
      options: ["count(at most k) minus count(at most k - 1), each with a window", "one window that shrinks the moment it has k colours", "prefix sums of colour ids", "sort the stretches"],
      answer: "count(at most k) minus count(at most k - 1), each with a window", why: "A window can count \"at most\" cleanly but not \"exactly\". Subtract two at-most counts to get the exact count.",
    },
    {
      id: "g3-two-pointers", statement: "A sorted list and a target: do two different entries add up to it? Use O(1) extra memory.",
      options: ["two pointers closing inward", "unordered_set of seen values", "prefix sums", "a monotonic deque"],
      answer: "two pointers closing inward", why: "In sorted order, a sum that is too small moves the left pointer right and a sum that is too big moves the right pointer left.", review: true,
    },
    {
      id: "g3-overflow", statement: "Each window adds up to a hundred thousand values that are each near two billion. How should the window total be stored?",
      options: ["long long, starting from 0LL", "int", "unsigned int", "double"],
      answer: "long long, starting from 0LL", why: "A window total can reach 2 x 10^14, far past 32 bits. Make the accumulator 64-bit before adding.", review: true,
    },
  ],
  coreProblemId: "tidy-tape",
  signatureProblemId: "pane-peaks",
  twist: {
    id: "shrinking-pane",
    title: "Shrinking pane",
    rule: "In the signature round your first Time Limit Exceeded halves the per-test time limit for the rest of the fight. A brute-force rescan will cost you the time you needed to fix it.",
    teaches: "Abandoning brute force early: recognising the O(n k) rescan as the trap in the first place, and checking complexity before you submit.",
  },
};

export const allR3Gyms: GymDef[] = [windowWoodsGym];
