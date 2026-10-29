/** Pattern taxonomy (CUR §3–5). Problems tag themselves with these ids; signals are what the player learns to spot. */
export interface Pattern {
  id: string;
  name: string;
  /** Region id from CUR §3 (R0–R23). */
  region: string;
  signals: string[];
}

export const PATTERNS: readonly Pattern[] = [
  { id: "syntax", name: "C++ basics", region: "R0", signals: ["write this function", "loops and strings", "STL container basics"] },
  { id: "complexity", name: "Complexity from constraints", region: "R1", signals: ["n up to 10^5", "will this pass in time", "nested loops"] },
  { id: "hash-lookup", name: "Hash lookup", region: "R2", signals: ["seen before", "pair summing to", "group by", "count frequency"] },
  { id: "two-pointers", name: "Two pointers", region: "R2", signals: ["sorted input", "pair or triple target", "palindrome", "in-place partition"] },
  { id: "prefix-sum", name: "Prefix sums", region: "R2", signals: ["many range-sum queries", "subarray sum equals k", "range updates"] },
  { id: "kadane", name: "Kadane", region: "R2", signals: ["best contiguous subarray", "maximum sum ending here"] },
  { id: "sliding-window", name: "Sliding window", region: "R3", signals: ["contiguous subarray or substring", "longest or shortest with a condition", "monotone window constraint"] },
  { id: "monotonic-deque", name: "Monotonic deque", region: "R3", signals: ["window maximum", "window minimum", "bounded-distance best"] },
  { id: "hash-design", name: "Hash keys and rolling hash", region: "R4", signals: ["canonical form as key", "repeated substring", "design O(1) structure"] },
  { id: "linked-list", name: "Linked lists", region: "R5", signals: ["next pointers", "in-place reversal", "cycle", "middle node"] },
  { id: "stack", name: "Stack", region: "R6", signals: ["matching or nesting", "undo", "expression evaluation"] },
  { id: "monotonic-stack", name: "Monotonic stack", region: "R6", signals: ["next greater or smaller", "previous smaller", "histogram area"] },
  { id: "queue", name: "Queue", region: "R6", signals: ["first in first out", "process in arrival order"] },
  { id: "recursion", name: "Recursion and divide and conquer", region: "R7", signals: ["split into halves", "subproblem of the same shape", "count inversions"] },
  { id: "binary-search", name: "Binary search", region: "R8", signals: ["sorted or rotated array", "minimise the maximum", "monotone yes/no predicate", "n up to 10^9"] },
  { id: "sorting", name: "Sorting and comparators", region: "R9", signals: ["order matters", "custom ordering", "sort then sweep"] },
  { id: "tree", name: "Binary trees", region: "R10", signals: ["root and children", "path", "depth", "level order"] },
  { id: "bst", name: "Binary search trees", region: "R10", signals: ["left smaller right larger", "in-order sorted", "kth smallest"] },
  { id: "heap", name: "Heap", region: "R11", signals: ["top k", "k-way merge", "running median", "repeatedly take the best"] },
  { id: "trie", name: "Trie", region: "R12", signals: ["prefix queries", "dictionary of words", "xor maximum"] },
  { id: "string-matching", name: "String matching", region: "R12", signals: ["find pattern in text", "prefix equals suffix", "border"] },
  { id: "graph-traversal", name: "BFS and DFS", region: "R13", signals: ["grid of cells", "connected region", "fewest steps unweighted", "dependencies"] },
  { id: "topological-sort", name: "Topological sort", region: "R13", signals: ["prerequisites", "ordering with dependencies", "detect cycle in directed graph"] },
  { id: "dsu", name: "Union-find", region: "R14", signals: ["merge groups", "are these connected", "redundant edge"] },
  { id: "mst", name: "Minimum spanning tree", region: "R14", signals: ["connect everything at minimum cost"] },
  { id: "shortest-path", name: "Shortest paths", region: "R15", signals: ["weighted edges", "cheapest route", "at most k stops"] },
  { id: "backtracking", name: "Backtracking", region: "R16", signals: ["generate all", "choose explore un-choose", "n up to 20 and under", "placements with constraints"] },
  { id: "dp-1d", name: "1-D dynamic programming", region: "R17", signals: ["count the ways", "minimum cost to reach", "best up to index i"] },
  { id: "dp-grid", name: "Grid and two-sequence DP", region: "R17", signals: ["two strings", "paths in a grid", "edit distance"] },
  { id: "dp-knapsack", name: "Knapsack DP", region: "R17", signals: ["subset with target sum", "pick items under a capacity"] },
  { id: "dp-state-machine", name: "State machine, interval and game DP", region: "R17", signals: ["cooldown or fee", "best play by both players", "split an interval"] },
  { id: "dp-advanced", name: "Tree, DAG and bitmask DP", region: "R17", signals: ["subset of up to 20 items", "tree with a choice per node"] },
  { id: "greedy", name: "Greedy", region: "R18", signals: ["locally best is globally best", "exchange argument", "sort then sweep"] },
  { id: "intervals", name: "Intervals and sweep line", region: "R19", signals: ["start and end times", "overlap", "merge ranges"] },
  { id: "bit-manipulation", name: "Bit manipulation", region: "R20", signals: ["xor", "power of two", "subset masks", "without extra space"] },
  { id: "math", name: "Math and number theory", region: "R20", signals: ["modulo 10^9+7", "gcd", "primes", "matrix rotation"] },
  { id: "segment-tree", name: "Segment tree and Fenwick tree", region: "R21", signals: ["range query with point updates", "count smaller to the right"] },
  { id: "design-ds", name: "Data-structure design", region: "R22", signals: ["implement a class with O(1) operations", "cache", "iterator"] },
] as const;

export const PATTERN_IDS: ReadonlySet<string> = new Set(PATTERNS.map((p) => p.id));

export function patternById(id: string): Pattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}
