import type { Lesson } from "@/lib/lessons/types";

/** R0 Syntax Shores S2 "Control flow and functions" (CURRICULUM §2). Original wording. */
export const s2Lessons: Lesson[] = [
  {
    id: "s2-branches-loops", region: "R0", section: "S2",
    title: "Branches and loops",
    summary: "if/else chains, switch and its fallthrough trap, and steering loops with break and continue.",
    cardIds: ["s2-switch-fallthrough", "s2-dangling-else", "s2-continue-trace", "s2-break-nested", "s2-switch-types", "s2-switch-init-error"],
    problemIds: ["toll-booth", "charge-meter"],
    pages: [
      {
        title: "if, else and switch",
        blocks: [
          { kind: "text", text: "An `if / else if / else` chain tests its conditions top to bottom and runs only the first branch that matches. Order matters: put the narrowest or cheapest-to-rule-out condition first, and make every range boundary explicit (`<` or `<=`) so no value falls between two branches." },
          { kind: "code", run: true, caption: "The first matching branch wins; the rest are skipped.", code: `#include <iostream>

const char* grade(int score) {
    if (score >= 90) return "A";
    else if (score >= 75) return "B";
    else if (score >= 50) return "C";
    return "F";
}

int main() {
    std::cout << grade(95) << grade(75) << grade(74) << grade(10) << '\\n';
}
` },
          { kind: "pitfall", title: "Dangling else", text: "An `else` pairs with the nearest unmatched `if`, regardless of indentation. Always use braces on branches that contain another `if`." },
          { kind: "text", text: "`switch` selects among integer constants. The controlling value must be an integer or enum type, and each `case` label a compile-time constant. Execution starts at the matching label and runs straight on to the end of the block unless something stops it." },
          { kind: "code", run: true, caption: "Missing breaks fall through into the next case.", code: `#include <iostream>

int main() {
    int day = 6;
    switch (day) {
        case 6:
        case 7:
            std::cout << "weekend\\n";   // two labels, one body: deliberate
            break;
        case 1:
            std::cout << "monday\\n";
            break;
        default:
            std::cout << "weekday\\n";
    }
}
` },
          { kind: "idiom", title: "Break every case", text: "Stack empty case labels to share a body, and end every non-empty case with `break` or `return`. If a fallthrough is really intended, write `[[fallthrough]];` so the next reader knows." },
          { kind: "interview", text: "For a rule table with ranges (tax brackets, tolls, grades), say the boundaries out loud: \"inclusive at the top, exclusive at the bottom\". Off-by-one on a range edge is the most common bug in this kind of question." },
        ],
      },
      {
        title: "Loops, break and continue",
        blocks: [
          { kind: "text", text: "Use `for` when you know the counting range, `while` when you loop until a condition changes, and a range-for (`for (const auto& x : v)`) when you only need each element. Declare the loop variable in the `for` header so it cannot leak into later code." },
          { kind: "code", run: true, caption: "continue skips one iteration; break leaves the loop.", code: `#include <iostream>

int main() {
    for (int i = 1; i <= 8; ++i) {
        if (i % 2 == 0) continue;     // skip even numbers
        if (i > 6) break;             // stop for good
        std::cout << i << ' ';
    }
    std::cout << '\\n';
}
` },
          { kind: "pitfall", title: "break leaves one loop", text: "`break` exits only the innermost loop or switch. To escape two loops at once, put them in a function and `return`, or test a flag in the outer loop's condition." },
          { kind: "text", text: "A useful habit before writing any loop: state the invariant and the exit condition in one sentence (\"i is the next index to read; stop when i == n\"). It makes both the boundaries and the loop's termination easy to check." },
          { kind: "interview", text: "When you finish a loop, walk the smallest input through it (empty, one element) and say what it does. Interviewers score that dry run under Verification." },
        ],
      },
    ],
  },
  {
    id: "s2-functions", region: "R0", section: "S2",
    title: "Functions and how arguments travel",
    summary: "Pass by value, reference and const reference, and why the wrong choice times out.",
    cardIds: ["s2-by-value-tle", "s2-ref-vs-value", "s2-const-ref-error", "s2-overload-pick", "s2-default-arg-cloze"],
    problemIds: ["shelf-rank"],
    pages: [
      {
        title: "Value, reference, const reference",
        blocks: [
          { kind: "text", text: "A parameter declared `int x` is a copy: changing it never affects the caller. A parameter declared `int& x` is another name for the caller's variable. A parameter declared `const T& x` is a read-only name, with no copy." },
          { kind: "code", run: true, caption: "Only the reference parameter changes the caller's variable.", code: `#include <iostream>

void addCopy(int x) { x += 10; }
void addRef(int& x) { x += 10; }

int main() {
    int n = 1;
    addCopy(n);
    std::cout << n << ' ';
    addRef(n);
    std::cout << n << '\\n';
}
` },
          { kind: "idiom", title: "The default rule", text: "Small things (ints, doubles, chars, pointers) by value. Large read-only things (`vector`, `string`, `map`) by `const T&`. Things the function must update by `T&`." },
          { kind: "pitfall", title: "Copying a vector per call", text: "`bool has(vector<int> v, int x)` copies every element on every call. Called inside a loop over n items, an O(n) lookup becomes O(n^2) work just from copying, and a solution that was correct on paper times out. Write `const vector<int>& v`." },
          { kind: "interview", text: "Declaring parameters `const&` signals that you know what a copy costs. Interviewers notice the unprompted `const vector<int>&` in a LeetCode signature, and they notice its absence." },
        ],
      },
      {
        title: "Return types, overloads and defaults",
        blocks: [
          { kind: "text", text: "Return by value for results (the compiler moves or elides the copy for you). Return `bool` for yes/no, `int` or `long long` for counts and totals, and `void` only when the function exists for its side effect. Never return a reference or pointer to a local variable: it is destroyed when the function returns." },
          { kind: "text", text: "Overloading lets several functions share a name when their parameter types differ. The compiler picks the best match: exact type first, then a promotion (`char` to `int`, `float` to `double`), then a conversion. If two candidates tie, the call is ambiguous and does not compile." },
          { kind: "code", run: true, caption: "Exact match beats promotion.", code: `#include <iostream>

void show(int) { std::cout << "int "; }
void show(double) { std::cout << "double "; }

int main() {
    show(1);
    show(1.0);
    show('x');     // char promotes to int
    std::cout << '\\n';
}
` },
          { kind: "text", text: "A default argument (`int scale(int x, int factor = 10)`) is filled in when the caller omits it. Defaults must be the rightmost parameters and are written only in the declaration the caller sees." },
          { kind: "idiom", title: "Prefer a clear name", text: "Overloads are handy for the same operation on different types. If two functions do different things, give them different names; `scoreByLength` and `scoreByVowels` read better than two `score` overloads." },
        ],
      },
    ],
  },
  {
    id: "s2-recursion-static", region: "R0", section: "S2",
    title: "Recursion, the call stack and static",
    summary: "Base case plus smaller subproblem, how deep is too deep, and state that outlives a call.",
    cardIds: ["s2-recursion-trace", "s2-missing-base-case", "s2-static-local", "s2-digit-sum-parsons"],
    problemIds: ["echo-chamber", "pocket-calendar"],
    pages: [
      {
        title: "Recursion and the call stack",
        blocks: [
          { kind: "text", text: "A recursive function solves a problem by calling itself on a smaller version of it. Every recursive function needs two things: a **base case** that returns without recursing, and a **recursive step** that moves strictly toward the base case." },
          { kind: "code", run: true, caption: "Halving the exponent: depth is about log2(n), not n.", code: `#include <iostream>

long long power(long long base, int exp) {
    if (exp == 0) return 1;                       // base case
    long long half = power(base, exp / 2);        // smaller problem
    return exp % 2 == 0 ? half * half : half * half * base;
}

int main() {
    std::cout << power(3, 13) << '\\n';
}
` },
          { kind: "text", text: "Each active call occupies a **stack frame** (parameters, locals, return address) on the call stack, which is a small fixed region of memory, often one to a few megabytes. Depth about 10^4 is usually safe; depth 10^6 usually is not." },
          { kind: "pitfall", title: "Stack overflow", text: "A missing base case, or a recursion that is linear in a large input (one call per element of a 10^6-long list), exhausts the stack and the process crashes. Estimate depth first; switch to a loop or an explicit stack if it can be large." },
          { kind: "interview", text: "State the recurrence's base case and depth before coding it. \"Depth is log n, so the stack is fine\" or \"depth is n up to 10^5, so I'll convert this to a loop\" are the sentences that earn Problem Solving credit." },
        ],
      },
      {
        title: "static: state that outlives a call",
        blocks: [
          { kind: "text", text: "Inside a function, `static` gives a local variable one shared copy that is initialised the first time control reaches it and keeps its value between calls." },
          { kind: "code", run: true, caption: "A static local remembers; a plain local starts over.", code: `#include <iostream>

int countStatic() { static int n = 0; return ++n; }
int countPlain()  { int n = 0;        return ++n; }

int main() {
    std::cout << countStatic() << countStatic() << countStatic() << ' ';
    std::cout << countPlain() << countPlain() << countPlain() << '\\n';
}
` },
          { kind: "text", text: "On a class member, `static` means the member belongs to the class, not to any object. A `static` member function can be called without an object and cannot touch non-static members. A `static const` table is a good way to hold fixed data (days per month) that is built once." },
          { kind: "idiom", title: "Static helpers and tables", text: "Put pure helper functions (`isLeapYear`) in the class as `static` member functions, and fixed lookup tables as `static const`. Avoid mutable static state in solutions: a hidden counter that leaks from one test case to the next is a classic source of wrong answers that only appear on the second call." },
        ],
      },
    ],
  },
];
