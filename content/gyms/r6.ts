import type { GymDef } from "@/lib/gym/types";
import type { ForbiddenRule } from "@/lib/gym/twist";
import { hasRecursion } from "@/lib/gym/twist";

/** Stackspire gym (GDD §5.5, CUR §3 R6): stacks, queues, monotonic stacks, expression evaluation. Original statements. */
export const stackspireGym: GymDef = {
  id: "r6-gym",
  region: "R6",
  name: "Sentinel Gym",
  leader: {
    id: "stackspire-sentinel",
    name: "Stackspire Sentinel",
    title: "Keeper of the Last-In Gate",
    lines: {
      intro: "Every slab on this spire was laid on top of another, and the last one down is always the first one up. I never move a slab out of turn. Show me you can keep the order, and that you can climb without the stairwell of the call stack.",
      win: "Your slabs came off in the right order, and you never leaned on the stairwell. Take the Slab Badge: the gate lifts for you.",
      lose: "A slab came off out of turn. Say what is waiting, say what resolves it, and look again.",
    },
  },
  badge: { id: "badge-slab", name: "Slab Badge" },
  blitzSeconds: 20,
  blitz: [
    {
      id: "g6-brackets", statement: "A line of text holds three kinds of brackets. Decide whether every bracket is closed by the right kind, in the right order.",
      options: ["a stack of the closers still owed", "a counter per bracket kind", "sort the characters and compare the ends", "a sliding window of width two"],
      answer: "a stack of the closers still owed", why: "The most recent unclosed bracket must be the first one to close, which is last-in, first-out. Three separate counters cannot see that ([)] is wrong.",
    },
    {
      id: "g6-next-warmer", statement: "For every day, report how many days you must wait until a strictly higher reading appears, or 0 when none ever does. There are 100000 days.",
      options: ["a stack of days still waiting; pop while the new reading is higher", "for each day, scan forward until a higher one", "sort the readings and binary search", "a hash map from reading to day"],
      answer: "a stack of days still waiting; pop while the new reading is higher", why: "Each day is pushed once and popped once, so the sweep is O(n). The forward scan is O(n squared) on a falling sequence.",
    },
    {
      id: "g6-eval", statement: "Evaluate an arithmetic line that has brackets and a sign that can be unary, such as 2 * -(3 + 4), without calling eval on it.",
      options: ["a stack of numbers and a stack of operators with precedence", "split on plus signs and add the parts", "regular expression replacement of the innermost bracket, repeated", "binary search on the answer"],
      answer: "a stack of numbers and a stack of operators with precedence", why: "Operators wait on a stack until a weaker or equal one arrives; brackets are walls. Repeated innermost replacement works but costs O(n squared) on deep nesting.",
    },
    {
      id: "g6-rectangle", statement: "A row of bars of different heights sits side by side, each one unit wide. Find the biggest rectangle that fits under the bars.",
      options: ["monotonic stack of rising bars; a shorter bar closes the taller ones", "two pointers moving inward from both ends", "prefix sums of the heights", "sort the bars by height and sweep"],
      answer: "monotonic stack of rising bars; a shorter bar closes the taller ones", why: "When a shorter bar arrives, every taller bar on the stack has found its right edge, and the bar below it on the stack is its left edge. One pass, O(n).",
    },
    {
      id: "g6-min-stack", statement: "Design a stack that supports push, pop, top and \"what is the smallest value inside right now\", all in O(1).",
      options: ["push each value together with the minimum so far", "scan the whole stack for the minimum on each query", "keep the values in a sorted vector", "a hash map from value to count only"],
      answer: "push each value together with the minimum so far", why: "The minimum so far is a property of the prefix beneath each slab, so storing it next to the value makes every query O(1) and the pop restores the previous minimum for free.",
    },
    {
      id: "g6-rain", statement: "Bars of different heights stand in a row. After rain, how much water is trapped between them? The input has 200000 bars.",
      options: ["two pointers inward, or a stack that fills layers when a taller wall arrives", "sort the bars and take the median", "a hash map of heights to counts", "binary search on the water level only"],
      answer: "two pointers inward, or a stack that fills layers when a taller wall arrives", why: "Water above a bar is bounded by the lower of the tallest wall on each side. A stack settles one layer at a time when a taller wall arrives; two pointers do the same in O(1) extra space.",
    },
    {
      id: "g4-shift-key", statement: "Group strings that are shifted copies of each other: every letter moved the same number of steps along the alphabet, wrapping around, so that \"abc\" and \"bcd\" belong together.",
      options: ["hash map keyed by the gaps between neighbouring letters", "hash map keyed by the sorted letters", "sort the strings and compare neighbours", "prefix sums of letter codes"],
      answer: "hash map keyed by the gaps between neighbouring letters", why: "A shift keeps the gap between neighbouring letters (mod 26) unchanged, so the gap sequence is a canonical key that every shifted copy shares.", review: true,
    },
    {
      id: "g3-twice", statement: "Find the longest stretch of a string in which no letter appears more than twice.",
      options: ["variable window: grow right, shrink left while a count is too high", "fixed window of length two", "sort the letters first", "hash every block of every length"],
      answer: "variable window: grow right, shrink left while a count is too high", why: "The stretch is repaired by shrinking from the left; both edges only move forward, so the pass is O(n).", review: true,
    },
  ],
  coreProblemId: "heat-wave",
  signatureProblemId: "ledger-fold",
  twist: {
    id: "iron-stack",
    title: "Iron stack",
    rule: "In the signature round the call stack is sealed: the judge rejects, before compiling, any function that calls itself (directly, through another function, or as a std::function lambda). The hidden tests nest brackets very deeply, so recursion would also overflow. A rejection never costs a heart.",
    teaches: "A recursive evaluator hides its pending work in the call stack, and the call stack is small. Moving that pending work into an explicit stack keeps the same logic and removes the depth limit.",
  },
};

/** The Iron stack rule: no function may reach itself through calls (applied to the signature round). */
export const ironStackRules: ForbiddenRule[] = [
  {
    check: hasRecursion,
    message: "Iron stack: a function here calls itself (or calls back into itself through another one). The Sentinel sealed the call stack, and the hidden lines nest brackets very deeply. Keep the pending work on your own std::stack or vector instead.",
  },
];

export const allR6Gyms: GymDef[] = [stackspireGym];
