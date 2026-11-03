/** Syntax Shores (R0) sample concept cards. Program-based answers come from `content/cards/generated.json`. */
import type { Card } from "@/lib/cards/types";

const R = "R0";

export const SYNTAX_CARDS: Card[] = [
  {
    id: "r0-int-division", region: R, kind: "predict", tags: ["integer-division", "types"],
    prompt: "What does this program print?",
    source: `#include <iostream>\nint main() {\n  int a = 7, b = 2;\n  std::cout << a / b << " " << a % b << "\\n";\n}\n`,
    explanation: "Both operands are `int`, so `/` truncates toward zero. `7 / 2` is 3 and `7 % 2` is 1. Write `1.0 * a / b` (or cast one side) for a fractional result.",
  },
  {
    id: "r0-overflow", region: R, kind: "predict", tags: ["overflow", "long-long"],
    prompt: "A 32-bit `int` holds at most 2,147,483,647. What does this program print?",
    source: `#include <iostream>\nint main() {\n  int n = 100000;\n  long long wide = 1LL * n * n;\n  std::cout << wide << "\\n";\n}\n`,
    explanation: "`1LL * n` promotes the multiplication to 64 bits before the second multiply. Without it, `n * n` overflows `int` (undefined behaviour) before being widened.",
  },
  {
    id: "r0-loop-sum", region: R, kind: "trace", tags: ["loops", "accumulate"],
    prompt: "The program prints `sum` after every iteration. List what it prints, one value per line.",
    source: `#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> v = {4, 1, 3, 2};\n  long long sum = 0;\n  for (const auto& x : v) {\n    sum += x * x;\n    std::cout << sum << "\\n";\n  }\n}\n`,
    explanation: "Range-for visits each element once: 16, then 16+1, then 17+9, then 26+4. Keeping the accumulator `long long` is the habit that prevents overflow on large inputs.",
  },
  {
    id: "r0-ref-vs-copy", region: R, kind: "predict", tags: ["references", "pass-by-value"],
    prompt: "What does this program print?",
    source: `#include <iostream>\nvoid bump(int x) { x += 10; }\nvoid bumpRef(int& x) { x += 100; }\nint main() {\n  int n = 1;\n  bump(n);\n  bumpRef(n);\n  std::cout << n << "\\n";\n}\n`,
    explanation: "`bump` changes its own copy. `bumpRef` takes a reference, so it edits `n` itself: 1 + 100 = 101.",
  },
  {
    id: "r0-missing-semicolon", region: R, kind: "compiler-error", tags: ["compile-errors", "syntax"],
    prompt: "This program does not compile. Tap the line where clang reports the first error.",
    source: `#include <vector>\nint main() {\n  std::vector<int> v;\n  v.push_back(3)\n  return v.size();\n}\n`,
    explanation: "Clang reports a missing `;` at the end of the line before the next statement, not on the line that starts the next statement.",
  },
  {
    id: "r0-const-assign", region: R, kind: "compiler-error", tags: ["compile-errors", "const"],
    prompt: "Tap the line where clang reports the first error.",
    source: `#include <iostream>\nint total(const int& base) {\n  base += 5;\n  return base;\n}\nint main() {\n  std::cout << total(2) << "\\n";\n}\n`,
    explanation: "A `const int&` parameter cannot be modified. Take it by value (`int base`) if you need a local copy.",
  },
  {
    id: "r0-vector-index", region: R, kind: "mcq", tags: ["vector", "stl"],
    prompt: "Which call adds an element to the end of a `std::vector<int> v`?",
    options: ["v.append(3)", "v.push_back(3)", "v.add(3)", "v.push(3)"], answer: 1,
    explanation: "`push_back` appends (amortised O(1)); `emplace_back` constructs in place. `push` belongs to stack and queue.",
  },
  {
    id: "r0-erase-cost", region: R, kind: "multi", tags: ["vector", "complexity"],
    prompt: "Select every operation that is O(1) amortised or better on `std::vector<int>`.",
    options: ["push_back", "pop_back", "insert at the front", "v[i] read", "erase in the middle"], answers: [0, 1, 3],
    explanation: "Inserting at the front or erasing in the middle shifts every later element: O(n).",
  },
  {
    id: "r0-count-parsons", region: R, kind: "parsons", tags: ["loops", "functions"],
    prompt: "Order the lines to build a function that counts even numbers.",
    lines: ["int countEven(const std::vector<int>& v) {", "  int count = 0;", "  for (const auto& x : v) {", "    if (x % 2 == 0) ++count;", "  }", "  return count;", "}"],
    distractors: ["  for (int x : v) count = x % 2;"],
    explanation: "Initialise the counter, loop, test the condition, return after the loop closes.",
  },
  {
    id: "r0-max-cloze", region: R, kind: "cloze", tags: ["loops", "max"],
    prompt: "Fill the blanks so the function returns the largest value (the vector is never empty).",
    code: `int largest(const std::vector<int>& v) {\n  int best = ___;\n  for (const auto& x : v) {\n    if (x ___ best) best = x;\n  }\n  return best;\n}`,
    blanks: [["v[0]", "v.front()", "INT_MIN"], [">"]],
    explanation: "Seed with the first element (or INT_MIN) and replace when you see something strictly larger.",
  },
];
