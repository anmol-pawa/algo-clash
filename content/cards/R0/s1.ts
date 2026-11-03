import type { Card } from "@/lib/cards/types";

/** R0 Syntax Shores S1 "Program basics" cards (B6c). Outputs and diagnostics are computed natively. */
export const s1Cards: Card[] = [
  {
    id: "s1-endl-vs-newline", kind: "mcq", region: "R0", tags: ["s1", "io", "performance"],
    prompt: "Printing 10^6 lines with cout. Which choice avoids needless flushing?",
    choices: ["cout << x << endl;", "cout << x << '\\n';", "cout << x << flush;", "printf(\"%d\", x) after every cout"],
    answer: 1,
    explanation: "endl writes a newline and flushes the stream every time. '\\n' only writes the newline, so output is buffered. Same text, far fewer system calls.",
  },
  {
    id: "s1-sync-off", kind: "mcq", region: "R0", tags: ["s1", "io"],
    prompt: "What does ios::sync_with_stdio(false) change?",
    choices: ["It makes cin/cout skip the C stdio buffers so they run faster, but you must not mix them with scanf/printf", "It makes cout thread-safe", "It disables output buffering", "It lets cin read a whole line at once"],
    answer: 0,
    explanation: "By default C++ streams stay in lockstep with C stdio. Turning that off removes the synchronisation cost; mixing cin with scanf afterwards then gives a scrambled order.",
  },
  {
    id: "s1-int-range", kind: "mcq", region: "R0", tags: ["s1", "types", "overflow"],
    prompt: "A typical int is 32 bits. Which value is the largest you can safely store in it?",
    choices: ["2'147'483'647", "4'294'967'295", "10'000'000'000", "9'223'372'036'854'775'807"],
    answer: 0,
    explanation: "A signed 32-bit int tops out at 2^31 - 1 = 2147483647. 4294967295 is the unsigned limit and the last value needs long long.",
  },
  {
    id: "s1-double-literal", kind: "predict", region: "R0", tags: ["s1", "literals", "double"],
    prompt: "What does this print? Two lines.",
    code: `#include <iostream>
int main() {
    std::cout << (long long)1e9 + 7 << "\\n";
    std::cout << 1e9 + 7 << "\\n";
}
`,
    explanation: "1e9 is a double. Cast to long long it prints exactly as 1000000007. Left as a double, cout uses 6 significant digits and prints 1e+09. Write the modulus as 1'000'000'007 or 1000000007 to stay in integers.",
  },
  {
    id: "s1-negative-mod", kind: "predict", region: "R0", tags: ["s1", "arithmetic", "modulo"],
    prompt: "What does this print? Two lines.",
    code: `#include <iostream>
int main() {
    std::cout << -7 / 2 << "\\n";
    std::cout << -7 % 3 << "\\n";
}
`,
    explanation: "C++ division truncates toward zero, so -7 / 2 is -3. The remainder takes the sign of the dividend: -7 % 3 is -1, not 2. Use ((x % m) + m) % m for a non-negative result.",
  },
  {
    id: "s1-wrap-trace", kind: "trace", region: "R0", tags: ["s1", "modulo", "trace"],
    prompt: "Trace it. What is printed?",
    code: `#include <iostream>
int main() {
    int pos = 3;
    for (int step : {5, -4, 9}) {
        pos = ((pos + step) % 7 + 7) % 7;
    }
    std::cout << pos << "\\n";
}
`,
    explanation: "pos goes 3 -> 1 -> 4 -> 6. The +7 inside the second modulo turns a negative remainder like -3 into 4 first.",
  },
  {
    id: "s1-auto-int-div", kind: "predict", region: "R0", tags: ["s1", "auto", "conversion"],
    prompt: "What does this print? Two lines.",
    code: `#include <iostream>
int main() {
    auto x = 7 / 2;
    auto y = 7 / 2.0;
    std::cout << x << "\\n";
    std::cout << y << "\\n";
}
`,
    explanation: "auto takes the type of the initialiser. 7 / 2 is int division (3); 7 / 2.0 promotes to double (3.5). auto does not make arithmetic smarter.",
  },
  {
    id: "s1-narrowing-error", kind: "compilerError", region: "R0", tags: ["s1", "conversion", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `int main() {
    int small{5000000000LL};
    return small;
}
`,
    choices: ["Brace initialisation forbids a narrowing conversion: 5000000000 does not fit in int", "5000000000LL is not a valid literal", "int cannot be initialised with braces at all", "main may not declare two variables"],
    answer: 0,
    explanation: "`int small = 5000000000LL;` compiles (and silently truncates). With braces the compiler refuses a narrowing conversion of a constant that does not fit. For non-constant values clang rejects it too, while g++ only warns, so {} is a cheap safety net.",
  },
  {
    id: "s1-missing-include", kind: "compilerError", region: "R0", tags: ["s1", "includes", "compiler-errors"],
    prompt: "Why does this not compile?",
    code: `int main() {
    std::vector<int> v = {1, 2, 3};
    return v.size() == 3 ? 0 : 1;
}
`,
    choices: ["<vector> was never included", "main must take arguments", "{1, 2, 3} is not valid C++", "vector needs a using-declaration for int"],
    answer: 0,
    explanation: "std::vector is declared in <vector>. Without the include the compiler has never heard of it. Interview judges often accept <bits/stdc++.h>, but know what you actually need.",
  },
  {
    id: "s1-semicolon-error", kind: "compilerError", region: "R0", tags: ["s1", "syntax", "compiler-errors"],
    prompt: "What does the compiler complain about?",
    code: `#include <iostream>
int main() {
    int total = 0
    total += 5;
    std::cout << total << "\\n";
}
`,
    choices: ["A statement is missing its semicolon", "total is used before it is declared", "cout needs std::endl", "+= is not an operator"],
    answer: 0,
    explanation: "Statements end with ;. The error is reported at the next token, so look at the line above the one the compiler names.",
  },
  {
    id: "s1-literals", kind: "multi", region: "R0", tags: ["s1", "literals", "types"],
    prompt: "Which of these literals is NOT of type int?",
    choices: ["1LL", "1e9", "1000000007", "5000000000", "1ULL << 40"],
    answers: [0, 1, 3, 4],
    explanation: "1LL is long long, 1e9 is a double, and 1ULL << 40 is unsigned long long. 1000000007 fits in int, so it is the only int here. 5000000000 does not fit, so it silently becomes a wider signed type (64-bit).",
  },
  {
    id: "s1-size-t-trap", kind: "predict", region: "R0", tags: ["s1", "size_t", "unsigned"],
    prompt: "What does this print?",
    code: `#include <iostream>
#include <vector>
int main() {
    std::vector<int> v;
    std::cout << (v.size() - 1 > 0 ? "positive" : "zero or less") << "\\n";
}
`,
    explanation: "size() is size_t (unsigned). 0 - 1 wraps to 2^64 - 1, which is greater than 0. Write (int)v.size() - 1 or check empty() first.",
  },
  {
    id: "s1-mid-cloze", kind: "cloze", region: "R0", tags: ["s1", "overflow", "cloze"],
    prompt: "Fill the blanks: midpoint of lo and hi that cannot overflow.",
    template: `#include <iostream>
int main() {
    int lo = 2000000000, hi = 2100000000;
    int mid = lo + (hi ___ lo) / ___;
    std::cout << mid << "\\n";
}
`,
    blanks: [["-"], ["2"]],
    explanation: "(lo + hi) / 2 would need 4.1e9, which overflows int. lo + (hi - lo) / 2 never exceeds hi.",
  },
  {
    id: "s1-io-cloze", kind: "cloze", region: "R0", tags: ["s1", "io", "cloze"],
    prompt: "Fill the blanks: read a number, print its double.",
    template: `#include <iostream>
int main() {
    int n = 21;
    long long twice = 2LL * ___;
    std::cout << ___ << "\\n";
}
`,
    blanks: [["n"], ["twice"]],
    explanation: "Widen first with 2LL, then print the stored result. Reading from cin would be `std::cin >> n;` in place of the literal.",
  },
  {
    id: "s1-hello-order", kind: "parsons", region: "R0", tags: ["s1", "main", "parsons"],
    prompt: "Put the lines in order: read two numbers and print their 64-bit sum.",
    lines: [
      "#include <iostream>",
      "using namespace std;",
      "int main() {",
      "    ios::sync_with_stdio(false);",
      "    cin.tie(nullptr);",
      "    long long a = 6, b = 7;",
      "    cout << a + b << '\\n';",
      "}",
    ],
    explanation: "Include, then the using-declaration, then main. Do the stream speed-ups before any I/O. using namespace std is fine in a single interview file, never in a header.",
  },
];
