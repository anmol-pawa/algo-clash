import type { MoveDef, SpeciesDef } from "@/lib/party/types";

/** The Structdex (GDD §5.2). Only the starter line has finished art so far; the rest are silhouettes until their region opens. */
export const SPECIES: readonly SpeciesDef[] = [
  { id: "arrayling", name: "Arrayling", embodies: "array / string", region: "R0", hasSprite: true },
  { id: "vectorling", name: "Vectorling", embodies: "std::vector (resizable array)", region: "R0", evolvesFrom: "arrayling", stage: 2, hasSprite: true },
  { id: "hashkit", name: "Hashkit", embodies: "hash map / set", region: "R2", hasSprite: false },
  { id: "chainwyrm", name: "Chainwyrm", embodies: "linked list", region: "R5", hasSprite: false },
  { id: "stackbeetle", name: "Stackbeetle", embodies: "stack / queue / deque", region: "R6", hasSprite: false },
  { id: "heapling", name: "Heapling", embodies: "heap", region: "R11", hasSprite: false },
  { id: "sproutree", name: "Sproutree", embodies: "tree / BST", region: "R10", hasSprite: false },
  { id: "triebloom", name: "Triebloom", embodies: "trie", region: "R12", hasSprite: false },
  { id: "webweaver", name: "Webweaver", embodies: "graph", region: "R13", hasSprite: false },
  { id: "unislime", name: "Unislime", embodies: "union-find", region: "R14", hasSprite: false },
  { id: "memoth", name: "Memoth", embodies: "dynamic programming", region: "R17", hasSprite: false },
  { id: "bitimp", name: "Bitimp", embodies: "bit manipulation", region: "R20", hasSprite: false },
  { id: "segtitan", name: "Segtitan", embodies: "segment tree", region: "R21", hasSprite: false },
];

/**
 * Moves are patterns. Only moves whose scroll exists can be learned; the rest stay sealed until their region's
 * lesson and scroll are written (each new scroll adds its move here).
 */
export const MOVES: readonly MoveDef[] = [
  { id: "plain-loop", name: "Plain Loop", patternId: "syntax", blurb: "Walk the array one cell at a time. Always works, rarely fast enough.", starter: true },
  { id: "running-total", name: "Running Total", patternId: "syntax", blurb: "Accumulate over a vector, widening to long long before it overflows.", lessonId: "s3-vectors", scrollId: "accumulate" },
  { id: "sliding-window", name: "Sliding Window", patternId: "sliding-window", blurb: "Grow and shrink a contiguous window while keeping a condition true." },
  { id: "monotonic-stack", name: "Monotonic Stack", patternId: "monotonic-stack", blurb: "Keep a stack ordered so each element finds its next greater one in O(n)." },
  { id: "binary-search", name: "Binary Search", patternId: "binary-search", blurb: "Halve the search space on a monotone yes/no question." },
  { id: "two-pointers", name: "Two Pointers", patternId: "two-pointers", blurb: "Walk from both ends of sorted data toward the answer." },
  { id: "prefix-sums", name: "Prefix Sums", patternId: "prefix-sum", blurb: "Precompute running totals so any range sum costs O(1)." },
];
