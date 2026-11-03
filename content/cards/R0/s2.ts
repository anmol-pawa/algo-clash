import type { Card } from "@/lib/cards/types";

/** R0 Syntax Shores S2 "Control flow and functions" cards (B6d). Outputs and diagnostics are computed by g++ (see lib/content/cardsNative.ts). */
export const s2Cards: Card[] = [
  {
    id: "s2-switch-fallthrough", kind: "predict", region: "R0", tags: ["switch", "fallthrough"],
    prompt: "What does this program print? Two lines.",
    code: `#include <iostream>
int main() {
    int x = 2;
    switch (x) {
        case 1: std::cout << "one\\n";
        case 2: std::cout << "two\\n";
        case 3: std::cout << "three\\n"; break;
        default: std::cout << "other\\n";
    }
}
`,
    explanation: "A switch jumps to the matching label and then keeps running until a break or the closing brace. Without `break` after case 2, control falls through into case 3, so you see two and three. Fallthrough is rarely intended; end every case with break or return.",
  },
  {
    id: "s2-dangling-else", kind: "predict", region: "R0", tags: ["if-else", "braces"],
    prompt: "What does this program print? Two lines.",
    code: `#include <iostream>
int main() {
    int a = 1, b = 0;
    if (a)
        if (b) std::cout << "A\\n";
        else std::cout << "B\\n";
    std::cout << "C\\n";
}
`,
    explanation: "An `else` belongs to the nearest unmatched `if`, whatever the indentation suggests. Here it pairs with `if (b)`, so with a = 1 and b = 0 the program prints B, then C. Braces around every branch make the pairing visible and immune to this mistake.",
  },
  {
    id: "s2-continue-trace", kind: "trace", region: "R0", tags: ["loops", "break", "continue", "trace"],
    prompt: "Trace the loop. What is printed?",
    code: `#include <iostream>
int main() {
    int sum = 0;
    for (int i = 1; i <= 10; ++i) {
        if (i % 3 == 0) continue;
        sum += i;
        if (sum > 20) break;
    }
    std::cout << sum << "\\n";
}
`,
    explanation: "`continue` skips the rest of this iteration (3, 6 and 9 are never added); `break` leaves the loop at once. The running sum is 1, 3, 7, 12, 19 and then 27 at i = 8, which exceeds 20, so the loop stops and prints 27.",
  },
  {
    id: "s2-break-nested", kind: "mcq", region: "R0", tags: ["loops", "break", "nested"],
    prompt: "A `break` statement runs inside the inner of two nested for loops. What does it leave?",
    choices: [
      "Only the innermost loop; the outer loop continues with its next iteration",
      "Both loops at once",
      "The whole function",
      "Nothing; break only works inside a switch",
    ],
    answer: 0,
    explanation: "`break` exits the nearest enclosing loop or switch only. To leave several loops at once, move them into a function and `return`, or set a flag the outer loop checks. Returning from a helper is usually the cleanest.",
  },
  {
    id: "s2-switch-types", kind: "multi", region: "R0", tags: ["switch", "types"],
    prompt: "Select every type that can be the controlling expression of a switch statement.",
    choices: ["int", "char", "an enum", "long long", "std::string", "double"],
    answers: [0, 1, 2, 3],
    explanation: "A switch needs an integral or enumeration type, because each case label is a compile-time integer constant. `char`, `int`, `long long` and enums all qualify. `std::string` and `double` do not: use an if/else chain, or a map, for those.",
  },
  {
    id: "s2-switch-init-error", kind: "compilerError", region: "R0", tags: ["switch", "compiler-errors", "scope"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `int main() {
    int x = 1;
    switch (x) {
        case 1:
            int y = 5;
            return y;
        case 2:
            return 0;
    }
}
`,
    choices: [
      "The jump to `case 2` would skip over the initialisation of y, which is still in scope",
      "A switch cannot contain a return statement",
      "y must be declared before the switch keyword",
      "case labels must be written in descending order",
    ],
    answer: 0,
    explanation: "All cases share one scope, so jumping to `case 2` would enter the scope of `y` without running its initialiser. Wrap the case body in braces (`case 1: { int y = 5; ... }`) to give the variable its own scope.",
  },
  {
    id: "s2-by-value-tle", kind: "mcq", region: "R0", tags: ["functions", "const-reference", "performance"],
    prompt: "`int count(vector<int> v, int x)` is called 100,000 times on a vector of 100,000 elements, and the solution times out. What is the cheapest correct fix?",
    choices: [
      "Take the vector as `const vector<int>& v`, so no copy is made on each call",
      "Take it as `vector<int> v` but call `v.shrink_to_fit()` first",
      "Return the result as `long long` instead of `int`",
      "Mark the function `static`",
    ],
    answer: 0,
    explanation: "Passing a vector by value copies all its elements on every call: 100,000 calls times 100,000 elements is 10^10 element copies. A `const&` parameter binds to the caller's vector with no copy and forbids accidental modification. Default to `const T&` for anything bigger than a few machine words that the function only reads.",
  },
  {
    id: "s2-ref-vs-value", kind: "predict", region: "R0", tags: ["functions", "references"],
    prompt: "What does this program print? Two lines.",
    code: `#include <iostream>
void bumpCopy(int x) { ++x; }
void bumpRef(int& x) { ++x; }
int main() {
    int a = 5;
    bumpCopy(a);
    std::cout << a << "\\n";
    bumpRef(a);
    std::cout << a << "\\n";
}
`,
    explanation: "`bumpCopy` receives its own copy of `a`, so the increment is lost when the function returns. `bumpRef` receives a reference to the caller's variable, so the change is visible. Use `T&` for out-parameters and `const T&` for large read-only inputs.",
  },
  {
    id: "s2-const-ref-error", kind: "compilerError", region: "R0", tags: ["const", "references", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `#include <vector>
void addOne(const std::vector<int>& v) {
    v.push_back(1);
}
int main() {
    std::vector<int> v;
    addOne(v);
}
`,
    choices: [
      "push_back modifies the vector, but v is a reference to const and cannot be modified",
      "push_back does not exist on vectors",
      "References cannot refer to vectors",
      "addOne must return a value",
    ],
    answer: 0,
    explanation: "`const` on the parameter is a promise not to modify the argument, and the compiler enforces it: only const member functions may be called on `v`. If the function must change the caller's vector, take `vector<int>&`; if it only reads, keep `const&`.",
  },
  {
    id: "s2-overload-pick", kind: "predict", region: "R0", tags: ["overloading", "conversions"],
    prompt: "What does this program print? Four lines.",
    code: `#include <iostream>
void show(int) { std::cout << "int\\n"; }
void show(long long) { std::cout << "long long\\n"; }
void show(double) { std::cout << "double\\n"; }
int main() {
    show(3);
    show(3LL);
    show('a');
    show(2.5f);
}
`,
    explanation: "The compiler prefers an exact match, then a promotion, then a conversion. `3` is an int and `3LL` a long long. A `char` promotes to `int`, and a `float` promotes to `double`, so those pick the promotion over a conversion to the other types. When two overloads are equally good the call is ambiguous and does not compile.",
  },
  {
    id: "s2-default-arg-cloze", kind: "cloze", region: "R0", tags: ["functions", "default-arguments", "cloze"],
    prompt: "Give `factor` a default so that `scale(7)` returns 70 while `scale(7, 3)` still returns 21.",
    template: `#include <iostream>
int scale(int x, int factor = ___) {
    return x * factor;
}
int main() {
    std::cout << scale(7) << " " << scale(7, 3) << "\\n";
}
`,
    blanks: [["10"]],
    explanation: "A default argument is filled in by the caller's compiler when the argument is omitted, so `scale(7)` becomes `scale(7, 10)`. Defaults go on the rightmost parameters, and they are written once, in the declaration the caller sees.",
  },
  {
    id: "s2-recursion-trace", kind: "trace", region: "R0", tags: ["recursion", "call-stack", "trace"],
    prompt: "Trace the recursion. What is printed?",
    code: `#include <iostream>
int f(int n) {
    if (n <= 1) return 1;
    return f(n - 1) + f(n - 2);
}
int main() {
    std::cout << f(6) << "\\n";
}
`,
    explanation: "Each call splits into two smaller calls until it hits the base case n <= 1, which returns 1. That gives f(2)=2, f(3)=3, f(4)=5, f(5)=8 and f(6)=13. The call tree has about 2^n nodes, which is why naive Fibonacci recursion is exponential and needs memoisation later in the game.",
  },
  {
    id: "s2-missing-base-case", kind: "mcq", region: "R0", tags: ["recursion", "call-stack", "stack-overflow"],
    prompt: "A recursive function has no reachable base case. What happens when it runs?",
    choices: [
      "Each call adds a stack frame until the stack is exhausted and the program crashes (stack overflow)",
      "The compiler detects it and refuses to build the program",
      "The function returns 0 after a fixed number of calls",
      "It loops forever using constant memory",
    ],
    answer: 0,
    explanation: "Every active call keeps a frame (parameters, locals, return address) on the call stack, typically one to a few megabytes in total. Without a base case the frames pile up until the stack runs out and the process dies. Even correct recursion that goes 10^6 levels deep can overflow, so estimate the depth before choosing it.",
  },
  {
    id: "s2-static-local", kind: "predict", region: "R0", tags: ["static", "functions"],
    prompt: "What does this program print? Three lines.",
    code: `#include <iostream>
int next() {
    static int calls = 0;
    ++calls;
    return calls;
}
int main() {
    std::cout << next() << "\\n";
    std::cout << next() << "\\n";
    std::cout << next() << "\\n";
}
`,
    explanation: "A `static` local is initialised once, the first time control reaches it, and keeps its value between calls. A plain local would be re-created as 0 each time and print 1 three times. Use static locals for one-time tables; be wary of mutable ones, because hidden state makes functions harder to test.",
  },
  {
    id: "s2-digit-sum-parsons", kind: "parsons", region: "R0", tags: ["recursion", "parsons"],
    prompt: "Put the lines in order so the program prints the digit sum of 1234 using recursion.",
    lines: [
      "#include <iostream>",
      "int digitSum(int n) {",
      "    if (n == 0) return 0;",
      "    return n % 10 + digitSum(n / 10);",
      "}",
      "int main() {",
      "    std::cout << digitSum(1234) << \"\\n\";",
      "}",
    ],
    explanation: "The base case comes first, so the recursion stops at 0; then the recursive step peels off the last digit (n % 10) and recurses on the rest (n / 10). The function must be defined before `main` uses it. The output is 10.",
  },
];
