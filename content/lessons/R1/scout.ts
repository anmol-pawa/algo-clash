import type { Lesson } from "@/lib/lessons/types";

/** R1 Scout School (CURRICULUM R1). Original wording. */
export const r1Lessons: Lesson[] = [
  {
    id: "r1-reading-cost", region: "R1", section: "R1",
    title: "Reading the cost of code",
    summary: "Count loops, drop constants, add sequential steps and multiply nested ones. Know what amortised means.",
    cardIds: ["r1-drop-constants", "r1-triangle-loop", "r1-halving-loop", "r1-sqrt-loop", "r1-amortized-push", "r1-sort-then-scan", "r1-bsearch-in-loop", "r1-recursion-space", "r1-which-linear"],
    problemIds: [],
    pages: [
      {
        title: "Big-O in practice",
        blocks: [
          { kind: "text", text: "Big-O describes how the work grows with the input size `n`. You keep the fastest-growing term and drop constants: `3n² + 50n + 7` is `O(n²)`. `O` is an upper bound, `Ω` a lower bound and `Θ` means both, but interviewers say 'O' and mean the tight bound for the worst case unless you say otherwise." },
          { kind: "text", text: "Two rules read almost any code. **Sequential steps add** (a sort then a scan is `O(n log n) + O(n) = O(n log n)`). **Nested steps multiply** (`n` iterations each doing a binary search is `O(n log n)`). A loop whose variable is divided or multiplied by a constant each pass runs `O(log n)` times, and a loop that stops when `d * d > n` runs `O(√n)` times." },
          { kind: "code", run: true, caption: "A dependent inner loop: count the work.", code: `#include <iostream>

int main() {
    int n = 10, count = 0;
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < i; ++j)
            ++count;
    std::cout << count << '\\n';   // n(n-1)/2
}
` },
          { kind: "pitfall", title: "Hidden linear work", text: "`v.insert(v.begin(), x)`, `s.substr(i)` in a loop, `s += s2` copies and `std::find` on a vector each cost `O(n)`. Put one inside an `O(n)` loop and the program is `O(n²)`. Check what each library call costs before you total the loop." },
          { kind: "interview", text: "State the time and the space complexity without being asked, and name the dominant step ('the sort dominates'). Interviewers score that habit under Communication." },
        ],
      },
      {
        title: "Amortised cost and space",
        blocks: [
          { kind: "text", text: "Some operations are cheap almost always and expensive rarely. `vector::push_back` doubles the capacity when full: the copy costs `O(n)` once, but it happens after 1, 2, 4, 8, … pushes, so `n` pushes copy fewer than `2n` elements in total. The **amortised** cost per push is `O(1)`, while the worst single push is `O(n)`." },
          { kind: "text", text: "Space complexity counts what you allocate **beyond the input**, including the recursion stack. A recursive walk of a linked list with `n` nodes keeps `n` frames alive, so it uses `O(n)` space even though it allocates nothing; the loop version uses `O(1)`. Recursion depth also decides whether the stack can overflow." },
          { kind: "code", caption: "Same answer, different space.", code: `int lengthRec(const ListNode* p) {      // O(n) stack frames
    return p ? 1 + lengthRec(p->next) : 0;
}

int lengthLoop(const ListNode* p) {     // O(1) extra space
    int n = 0;
    for (; p; p = p->next) ++n;
    return n;
}
` },
          { kind: "idiom", title: "Say the assumption", text: "'Average O(1) for the hash map; worst case O(n) if everything collides.' Naming the assumption beats a bare O(1)." },
        ],
      },
    ],
  },
  {
    id: "r1-budgets-recurrences", region: "R1", section: "R1",
    title: "Constraints and recurrences",
    summary: "Turn the input limits into the complexity you can afford, and solve divide-and-conquer recurrences with the master theorem.",
    cardIds: ["r1-budget-1", "r1-budget-2", "r1-budget-3", "r1-budget-4", "r1-budget-5", "r1-budget-6", "r1-recurrence-1", "r1-recurrence-2", "r1-recurrence-3", "r1-recurrence-4", "r1-recurrence-5", "r1-recurrence-6"],
    problemIds: [],
    pages: [
      {
        title: "The constraint table",
        blocks: [
          { kind: "text", text: "A judge runs roughly `10⁸` simple operations per second natively (less in WebAssembly). Divide the time limit by that and you know the complexity the setter expects. Read the constraints **before** you think about the algorithm." },
          { kind: "text", text: "`n ≤ 10` allows `O(n!)`; `n ≤ 20` allows `O(2ⁿ)` (subsets, bitmasks); `n ≤ 500` allows `O(n³)`; `n ≤ 5 000` allows `O(n²)`; `n ≤ 10⁶` allows `O(n log n)`; `n ≤ 10⁸` allows `O(n)`; anything bigger needs `O(log n)` or `O(1)`. Several limits can appear in one problem, and the tightest one names the pattern." },
          { kind: "idiom", title: "Constraint-first reading", text: "Write the largest `n` on the board and the budget it implies before you propose anything. 'n is 2·10⁵, so I need O(n log n) or better, which rules out the pair loop.'" },
          { kind: "pitfall", title: "Overflow hides in the constraints", text: "If values reach `10⁹` and you add or multiply two of them, `int` overflows. A sum of `n = 10⁵` values of `10⁹` needs `long long`. Note the value range as well as `n`." },
          { kind: "interview", text: "Quoting the budget shows you can pick an algorithm from the limits instead of guessing. It is the quickest way to rule out brute force out loud." },
        ],
      },
      {
        title: "Recurrences and the master theorem",
        blocks: [
          { kind: "text", text: "A divide-and-conquer algorithm splits into `a` subproblems of size `n/b` and spends `f(n)` combining them: `T(n) = a·T(n/b) + f(n)`. Compare the combine cost with the leaf cost `n^(log_b a)`." },
          { kind: "text", text: "If the combine step is **smaller** than the leaf cost, the leaves dominate and `T(n) = Θ(n^(log_b a))`. If they are **equal** (every level of the recursion tree does the same work), multiply by the number of levels: `Θ(f(n) · log n)`. If the combine step is **larger**, the root dominates and `T(n) = Θ(f(n))`." },
          { kind: "text", text: "Merge sort: `T(n) = 2T(n/2) + n`. Here `log₂ 2 = 1`, the combine cost `n` equals the leaf cost `n¹`, so every level costs `n` and there are `log n` levels: `Θ(n log n)`. Binary search: `T(n) = T(n/2) + 1` gives `Θ(log n)`. Karatsuba: `T(n) = 3T(n/2) + n` gives `Θ(n^1.585)` because the leaves dominate." },
          { kind: "pitfall", title: "Unbalanced splits", text: "The master theorem needs equal-sized subproblems. Quicksort with a bad pivot is `T(n) = T(n-1) + n = Θ(n²)`, which is why random or median-of-three pivots matter. For `T(n) = T(n-1) + …`, unroll the sum instead." },
          { kind: "interview", text: "Draw the recursion tree: levels, work per level, number of levels. It earns the same marks as quoting the theorem and works when the theorem does not apply." },
        ],
      },
    ],
  },
];
