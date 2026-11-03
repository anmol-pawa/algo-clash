import type { Card } from "@/lib/cards/types";

/** R0 Syntax Shores S1 "Program basics" cards (B6c). Outputs and diagnostics are computed by g++ (see lib/content/cardsNative.ts). */
export const s1Cards: Card[] = [
  {
    id: "s1-endl-vs-newline", kind: "mcq", region: "R0", tags: ["io", "endl"],
    prompt: "A solution prints 200,000 lines. Why do experienced C++ programmers write '\\n' instead of std::endl?",
    choices: [
      "endl flushes the stream every time, which is slow for many lines",
      "endl was removed in C++20",
      "'\\n' flushes the buffer more safely",
      "endl prints two line breaks",
    ],
    answer: 0,
    explanation: "std::endl writes '\\n' and then flushes the output buffer. Flushing 200,000 times costs real time; '\\n' only appends to the buffer. Flush explicitly only when you need the text to appear immediately.",
  },
  {
    id: "s1-sync-stdio", kind: "mcq", region: "R0", tags: ["io", "sync_with_stdio"],
    prompt: "What does std::ios::sync_with_stdio(false) change?",
    choices: [
      "cin and cout stop sharing buffers with C stdio, which makes them faster, so you must not mix them with scanf/printf",
      "cout becomes safe to use from several threads",
      "Output is no longer buffered at all",
      "cin reads a whole line at a time instead of one token",
    ],
    answer: 0,
    explanation: "By default the C++ streams stay synchronised with C's stdin/stdout so mixing scanf and cin is safe, at a speed cost. Turning it off removes that cost, and mixing the two styles afterwards gives out-of-order results.",
  },
  {
    id: "s1-wide-types", kind: "multi", region: "R0", tags: ["types", "ranges"],
    prompt: "Select every type guaranteed to hold at least 64 bits on any conforming platform (assume <cstdint> is included).",
    choices: ["long long", "std::int64_t", "unsigned long long", "int", "unsigned int", "short"],
    answers: [0, 1, 2],
    explanation: "The standard promises long long (and unsigned long long) at least 64 bits, and int64_t is exactly 64. int is only guaranteed 16 bits (32 in practice) and short 16, so never assume they are wide enough for sums that can reach 10^10.",
  },
  {
    id: "s1-unsigned-wrap", kind: "predict", region: "R0", tags: ["types", "unsigned", "overflow"],
    prompt: "What does this program print (32-bit unsigned int)?",
    code: `#include <iostream>
int main() {
    unsigned int u = 0;
    u -= 1;
    std::cout << u << "\\n";
}
`,
    explanation: "Unsigned arithmetic wraps modulo 2^32, so 0 - 1 becomes 4294967295. This is the same trap as v.size() - 1 on an empty vector. (Signed overflow, by contrast, is undefined behaviour, not wrapping.)",
  },
  {
    id: "s1-negative-mod", kind: "predict", region: "R0", tags: ["arithmetic", "modulo", "negatives"],
    prompt: "What does this program print? Three lines.",
    code: `#include <iostream>
int main() {
    int a = -7, b = 2;
    std::cout << a / b << "\\n";
    std::cout << a % b << "\\n";
    std::cout << ((a % b) + b) % b << "\\n";
}
`,
    explanation: "C++ division truncates toward zero, so -7 / 2 is -3, and the remainder takes the sign of the dividend: -7 % 2 is -1. Adding the divisor and taking % again gives the non-negative remainder 1, the idiom for indexing a ring.",
  },
  {
    id: "s1-int-division-double", kind: "predict", region: "R0", tags: ["arithmetic", "conversions"],
    prompt: "What does this program print? Two lines.",
    code: `#include <iostream>
int main() {
    double d = 7 / 2;
    double e = 7 / 2.0;
    std::cout << d << "\\n";
    std::cout << e << "\\n";
}
`,
    explanation: "7 / 2 is an integer division, so it yields 3 before it is stored in the double. Making one operand a double (2.0) makes the division floating-point: 3.5. Where you convert matters.",
  },
  {
    id: "s1-auto-sizeof", kind: "predict", region: "R0", tags: ["auto", "types", "sizeof"],
    prompt: "What does this program print? Four lines (a typical desktop or server target).",
    code: `#include <iostream>
int main() {
    auto a = 5;
    auto b = 5.0;
    auto c = 5LL;
    auto d = 'x';
    std::cout << sizeof(a) << "\\n" << sizeof(b) << "\\n" << sizeof(c) << "\\n" << sizeof(d) << "\\n";
}
`,
    explanation: "auto takes the type of its initialiser: 5 is int (4 bytes), 5.0 is double (8), 5LL is long long (8) and 'x' is char (1). Pick the literal suffix on purpose, because auto will faithfully give you an int when you wanted 64 bits.",
  },
  {
    id: "s1-halving-steps", kind: "trace", region: "R0", tags: ["loops", "integer-division", "trace"],
    prompt: "Trace the loop. What is printed?",
    code: `#include <iostream>
int main() {
    int x = 100;
    int steps = 0;
    while (x > 1) {
        x /= 3;
        ++steps;
    }
    std::cout << steps << "\\n";
}
`,
    explanation: "Integer division floors positive values: x goes 100, 33, 11, 3, 1, so the loop body runs 4 times. Counting how many times you can divide before reaching 1 is the shape of every logarithmic loop.",
  },
  {
    id: "s1-literal-1e9", kind: "trace", region: "R0", tags: ["literals", "types", "trace"],
    prompt: "Trace the program. What is printed?",
    code: `#include <iostream>
int main() {
    long long a = 1e9;
    long long b = a * 5;
    std::cout << b << "\\n";
}
`,
    explanation: "1e9 is a double literal, but 1,000,000,000 is exactly representable, so converting it to long long is safe. The multiplication a * 5 then happens in 64 bits: 5,000,000,000, which would have overflowed a 32-bit int.",
  },
  {
    id: "s1-narrowing-error", kind: "compilerError", region: "R0", tags: ["conversions", "narrowing", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `int main() {
    int x{3.5};
    return x;
}
`,
    choices: [
      "Brace initialisation forbids a narrowing conversion from double to int",
      "3.5 is not a valid number",
      "x must be declared double before it is used",
      "main cannot return a variable",
    ],
    answer: 0,
    explanation: "Initialising with braces refuses conversions that can lose information. int x = 3.5; would compile silently and truncate, which is why braces are a useful guard. Use static_cast<int>(3.5) when you really mean it.",
  },
  {
    id: "s1-missing-include", kind: "compilerError", region: "R0", tags: ["includes", "stl", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `#include <iostream>
using namespace std;
int main() {
    vector<int> v = {1, 2, 3};
    cout << v.size() << "\\n";
}
`,
    choices: [
      "vector is declared in <vector>, which was never included",
      "using namespace std must come after main",
      "v.size() returns void",
      "the braces make the vector const",
    ],
    answer: 0,
    explanation: "using namespace std only makes names visible; it does not declare them. Include the header that defines the container. In an interview, name your headers explicitly rather than hoping another one pulls them in.",
  },
  {
    id: "s1-auto-noinit-error", kind: "compilerError", region: "R0", tags: ["auto", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `int main() {
    auto total;
    total = 10;
    return total;
}
`,
    choices: [
      "auto needs an initialiser to deduce the type from",
      "total is a reserved word",
      "auto can only be used for floating-point values",
      "10 is too large for an auto variable",
    ],
    answer: 0,
    explanation: "auto asks the compiler to read the type off the initialiser, so there must be one. Write auto total = 0LL; (and choose the suffix deliberately) or spell out the type.",
  },
  {
    id: "s1-big-sum-order", kind: "parsons", region: "R0", tags: ["types", "long-long", "parsons"],
    prompt: "Put the lines in order so the program prints the sum of the two large values without overflow.",
    lines: [
      "#include <iostream>",
      "int main() {",
      "    long long a = 3000000000LL;",
      "    long long b = 4000000000LL;",
      "    std::cout << a + b << \"\\n\";",
      "}",
    ],
    explanation: "Headers, then main; declare both 64-bit values before the statement that uses them. Both need the LL suffix because 3,000,000,000 does not fit in an int.",
  },
  {
    id: "s1-fast-io-cloze", kind: "cloze", region: "R0", tags: ["io", "cloze"],
    prompt: "Fill the blanks with the standard fast-I/O preamble: stop syncing with C stdio and untie cin from cout.",
    template: `#include <iostream>
int main() {
    std::ios::sync_with_stdio(___);
    std::cin.tie(___);
    std::cout << "ready" << '\\n';
}
`,
    blanks: [["false", "0"], ["nullptr", "0", "NULL"]],
    explanation: "sync_with_stdio(false) detaches the C++ streams from C stdio. cin.tie(nullptr) stops cin from flushing cout before every read, so a read-heavy loop is not slowed by constant flushes.",
  },
  {
    id: "s1-widen-cloze", kind: "cloze", region: "R0", tags: ["types", "overflow", "cloze"],
    prompt: "Fill the blanks so the product of two 100000s is computed in 64 bits.",
    template: `#include <iostream>
int main() {
    int n = 100000;
    ___ area = (___)n * n;
    std::cout << area << "\\n";
}
`,
    blanks: [["long long", "auto"], ["long long"]],
    explanation: "int * int is computed in int and overflows before any assignment can rescue it. Widening one operand first (the cast) makes the whole multiplication 64-bit; storing into a long long alone would be too late.",
  },
];
