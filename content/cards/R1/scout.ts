import type { Card } from "@/lib/cards/types";
import { BUDGET_TABLE, budgetFor } from "@/lib/complexity/constraints";
import { KNOWN, solve } from "@/lib/complexity/recurrence";

/** R1 Scout School cards. Predict outputs are computed by g++; constraint and recurrence cards are generated from the tested solvers in lib/complexity. */

const hand: Card[] = [
  {
    id: "r1-drop-constants", kind: "mcq", region: "R1", tags: ["big-o"],
    prompt: "A loop nest does exactly 3n² + 50n + 7 basic steps. Which bound is the tightest one a reviewer expects you to state?",
    choices: ["O(n)", "O(n²)", "O(n³)", "O(3n²)"],
    answer: 1,
    explanation: "Big-O keeps the fastest-growing term and drops constant factors and lower terms: for large n the n² term dominates, so the cost is O(n²). `O(3n²)` is true but not written that way, and O(n³) is a valid upper bound but not tight.",
  },
  {
    id: "r1-triangle-loop", kind: "predict", region: "R1", tags: ["loops", "counting"],
    prompt: "How many times does the counter increase? (Then notice: this is n(n-1)/2, so the loop is O(n²).)",
    code: `#include <iostream>
int main() {
    int n = 10, count = 0;
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < i; ++j)
            ++count;
    std::cout << count << '\\n';
}
`,
    explanation: "The inner loop runs i times for each i, so the total is 0 + 1 + … + (n-1) = n(n-1)/2. A dependent inner bound does not make the loop cheaper in Big-O: n²/2 is still Θ(n²).",
  },
  {
    id: "r1-halving-loop", kind: "predict", region: "R1", tags: ["loops", "log"],
    prompt: "What does this program print?",
    code: `#include <iostream>
int main() {
    int n = 1000, steps = 0;
    while (n > 1) {
        n /= 2;
        ++steps;
    }
    std::cout << steps << '\\n';
}
`,
    explanation: "Each pass halves n, so the number of passes is about log₂ n (log₂ 1000 ≈ 9.97, and integer division rounds down along the way). A loop that divides or multiplies its variable by a constant factor is O(log n).",
  },
  {
    id: "r1-sqrt-loop", kind: "predict", region: "R1", tags: ["loops", "sqrt"],
    prompt: "What does this program print?",
    code: `#include <iostream>
int main() {
    long long n = 1000000;
    int steps = 0;
    for (long long d = 1; d * d <= n; ++d) ++steps;
    std::cout << steps << '\\n';
}
`,
    explanation: "The loop stops when d² exceeds n, so it runs about √n times (√1 000 000 = 1000). Trial division up to √n is the classic O(√n) loop.",
  },
  {
    id: "r1-amortized-push", kind: "mcq", region: "R1", tags: ["amortised", "vector"],
    prompt: "A std::vector doubles its capacity when full. What is the amortised cost of one push_back, and the worst-case cost of a single one?",
    choices: [
      "Amortised O(1); a single push_back can cost O(n) when it reallocates",
      "Amortised O(log n); a single push_back always costs O(log n)",
      "Amortised O(n); a single push_back always costs O(n)",
      "Amortised O(1); a single push_back always costs O(1)",
    ],
    answer: 0,
    explanation: "Reallocation copies all n elements, but it happens after 1, 2, 4, 8, … pushes, so n pushes copy at most 1 + 2 + 4 + … + n < 2n elements in total. Spread over n pushes that is O(1) each, even though one unlucky push costs O(n). Say 'amortised' out loud in interviews.",
  },
  {
    id: "r1-sort-then-scan", kind: "mcq", region: "R1", tags: ["big-o", "sorting"],
    prompt: "An algorithm sorts n numbers with std::sort and then makes one linear pass. What is the total time?",
    choices: ["O(n)", "O(n log n)", "O(n²)", "O(n log² n)"],
    answer: 1,
    explanation: "Costs of sequential steps add, and the larger one wins: O(n log n) + O(n) = O(n log n). Sorting is the bottleneck, which is why 'sort first' is only a good idea when n log n fits the budget.",
  },
  {
    id: "r1-bsearch-in-loop", kind: "mcq", region: "R1", tags: ["big-o", "nested"],
    prompt: "For each of the n values in an unsorted array, the code runs a binary search over a second sorted array of size n. What is the total time?",
    choices: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
    answer: 2,
    explanation: "Costs of nested work multiply: n iterations times O(log n) per search is O(n log n). (If the second array were also searched linearly, it would be O(n²).)",
  },
  {
    id: "r1-recursion-space", kind: "mcq", region: "R1", tags: ["space", "recursion"],
    prompt: "A recursive function walks a linked list of n nodes, making one call per node and allocating nothing. What is its extra space?",
    choices: ["O(1)", "O(log n)", "O(n), because each pending call keeps a stack frame", "O(n²)"],
    answer: 2,
    explanation: "Space counts the call stack too. n nested calls are alive at the deepest point, so the extra space is O(n), and a long list can overflow the stack. Rewriting it as a loop gives O(1) extra space.",
  },
  {
    id: "r1-which-linear", kind: "multi", region: "R1", tags: ["big-o"],
    prompt: "Select every snippet that is O(n) in the worst case, where n is the vector's size.",
    choices: [
      "One pass summing all elements",
      "Two separate passes, one after the other",
      "A pass that calls v.insert(v.begin(), x) at every step",
      "Counting the frequency of each value with an unordered_map (average case)",
    ],
    answers: [0, 1, 3],
    explanation: "Sequential passes add: 2n is still O(n), and a hash-map count is O(1) average per element. Inserting at the front of a vector shifts every element, so doing it n times costs O(n²).",
  },
];

/** n values chosen so every row of the table is asked once. */
const constraintSizes = [8, 20, 400, 3000, 200000, 40_000_000];
const classChoices = BUDGET_TABLE.map((r) => r.fits);

const constraintCards: Card[] = constraintSizes.map((n, i): Card => {
  const row = budgetFor(n);
  const right = classChoices.indexOf(row.fits);
  // Offer the right class plus its two nearest neighbours and one far one, in a stable order.
  const picks = [right, right + 1, right - 1, right >= 3 ? 0 : 6].filter((x) => x >= 0 && x < classChoices.length);
  const unique = [...new Set(picks)].sort((a, b) => a - b);
  const choices = unique.map((j) => classChoices[j]);
  const nText = n >= 1000 ? n.toLocaleString("en-US").replace(/,/g, " ") : String(n);
  return {
    id: `r1-budget-${i + 1}`, kind: "mcq", region: "R1", tags: ["constraints", "budget"],
    prompt: `A problem says 1 ≤ n ≤ ${nText} and allows 1–2 seconds. What is the slowest complexity class you can afford?`,
    choices, answer: choices.indexOf(row.fits),
    explanation: `About 10⁸ simple operations fit in a second, so ${row.fits} is the slowest class that fits at n = ${nText}. Typical patterns at this size: ${row.patterns}. Reading the constraints first tells you which algorithm the setter expects.`,
  };
});

const recurrenceCards: Card[] = KNOWN.map((k, i): Card => {
  const sol = solve(k.rec).theta;
  const pool = ["Θ(log n)", "Θ(n)", "Θ(n log n)", "Θ(n^2)", "Θ(n^1.585)"];
  const choices = pool.filter((p) => p === sol || (p !== "Θ(n^1.585)" && pool.indexOf(p) !== (pool.indexOf(sol) + 3) % pool.length)).slice(0, 4);
  if (!choices.includes(sol)) choices[choices.length - 1] = sol;
  const s = solve(k.rec);
  const why = s.case === 1 ? "the leaves dominate: the work grows geometrically toward the bottom of the recursion tree"
    : s.case === 2 ? "every level of the recursion tree does the same total work, so multiply that work by the number of levels"
    : "the root dominates: the work shrinks geometrically down the recursion tree";
  return {
    id: `r1-recurrence-${i + 1}`, kind: "mcq", region: "R1", tags: ["recurrence", "master-theorem"],
    prompt: `Solve ${k.name} (with T(1) = 1). Where have you seen it? ${k.where}.`,
    choices, answer: choices.indexOf(sol),
    explanation: `With a = ${k.rec.a}, b = ${k.rec.b} the leaves cost n^${+(Math.log(k.rec.a) / Math.log(k.rec.b)).toFixed(3)} and the combine step is n^${k.rec.c}; ${why}. The answer is ${sol}.`,
  };
});

export const r1Cards: Card[] = [...hand, ...constraintCards, ...recurrenceCards];
