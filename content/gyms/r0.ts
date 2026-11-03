import type { GymDef } from "@/lib/gym/types";

/** Syntax Shores gym (GDD §5.5, CUR §2). Original statements; options are the C++ tool to reach for. */
export const syntaxShoresGym: GymDef = {
  id: "r0-gym",
  region: "R0",
  name: "Syntax Shores Gym",
  leader: {
    id: "warden-brace",
    name: "Warden Brace",
    title: "Keeper of the Compiler Lighthouse",
    lines: {
      intro: "Every ship that reaches this coast needs a lamp that never lies. Mine is the compiler. Show me you can read what it tells you.",
      win: "Not one warning left in your wake. Take the Lighthouse Badge: you write code the compiler can trust.",
      lose: "The lamp flickers. Read the diagnostics, patch the hull and sail again.",
    },
  },
  badge: { id: "badge-lighthouse", name: "Lighthouse Badge" },
  blitzSeconds: 20,
  blitz: [
    {
      id: "g0-letters", statement: "Given a lowercase word, report how many times each of the 26 letters occurs.",
      options: ["count[c - 'a'] bucket array", "std::sort the characters", "std::string::find in a loop", "std::stoi on each character"],
      answer: "count[c - 'a'] bucket array", why: "A fixed alphabet of 26 maps straight to indices 0..25 with c - 'a'.",
    },
    {
      id: "g0-dedupe", statement: "A sorted vector contains runs of equal values. Shrink it so each value appears once.",
      options: ["v.erase(unique(v.begin(), v.end()), v.end())", "erase inside a for loop at every duplicate", "v.resize(v.size() / 2)", "v.reserve(unique count)"],
      answer: "v.erase(unique(v.begin(), v.end()), v.end())", why: "unique compacts in one pass; looping erase shifts the tail every time and costs O(n^2).",
    },
    {
      id: "g0-split", statement: "A line looks like name:score:rank. Pull out the three fields.",
      options: ["find(':', pos) then substr(pos, len)", "sort the line then unique", "to_string each character", "memcpy into an int"],
      answer: "find(':', pos) then substr(pos, len)", why: "find locates the delimiter from a start position; substr takes a start and a length, not an end.",
    },
    {
      id: "g0-total", statement: "Add up a million values each up to two billion. The total must be exact.",
      options: ["accumulate into a long long", "accumulate into an int", "accumulate into a float", "sum inside size_t and subtract"],
      answer: "accumulate into a long long", why: "The total can reach 2 * 10^15, far beyond int. Start the accumulator as 0LL so the sum itself is 64-bit.",
    },
    {
      id: "g0-links", statement: "Find the middle node of a singly linked list in one forward walk, no length stored.",
      options: ["slow and fast pointer walk", "index into the list with []", "recursion on a vector copy", "sort the nodes by address"],
      answer: "slow and fast pointer walk", why: "A node has no index. Fast moves two steps per slow step, so slow is halfway when fast ends.",
    },
    {
      id: "g0-height", statement: "Report the longest root-to-leaf path length of a binary tree given as TreeNode pointers.",
      options: ["recursion with a nullptr base case", "a 2-D grid of ints", "std::sort of the values", "a bucket array of characters"],
      answer: "recursion with a nullptr base case", why: "The tree's shape is recursive: height of a null node is 0, otherwise 1 + max of both children.",
    },
    {
      id: "g0-const", statement: "A helper reads a huge vector but never changes it. How should the parameter be declared?",
      options: ["const vector<int>&", "vector<int> by value", "vector<int>&& and move it", "vector<int>* with new"],
      answer: "const vector<int>&", why: "A const reference avoids an O(n) copy and the compiler forbids accidental writes.", review: true,
    },
    {
      id: "g0-mid", statement: "Take the midpoint of two indices that can both be near two billion.",
      options: ["lo + (hi - lo) / 2", "(lo + hi) / 2 in int", "(lo * hi) / 2", "lo / 2 + hi % 2"],
      answer: "lo + (hi - lo) / 2", why: "lo + hi can overflow int; the difference of two valid indices cannot.", review: true,
    },
  ],
  coreProblemId: "run-squash",
  signatureProblemId: "step-counter",
  twist: {
    id: "werror",
    title: "Warnings are errors",
    rule: "In the signature round the judge compiles with -Wall -Wextra -Werror: any warning is a compile error and the battle continues without a heart lost.",
    teaches: "Reading compiler diagnostics (unused variable, signed/unsigned compare, missing return) as bugs found for free.",
  },
};

export const allGyms: GymDef[] = [syntaxShoresGym];
