import type { Lesson } from "@/lib/lessons/types";

/** R0 Syntax Shores S1 "Program basics" (CURRICULUM §2). Original wording. */
export const s1Lessons: Lesson[] = [
  {
    id: "s1-first-program", region: "R0", section: "S1",
    title: "Your first program",
    summary: "main, includes, and the input/output habits that keep a solution fast.",
    cardIds: ["s1-missing-include", "s1-endl-vs-newline", "s1-sync-stdio", "s1-fast-io-cloze"],
    problemIds: ["ledger-digits"],
    pages: [
      {
        title: "main and includes",
        blocks: [
          { kind: "text", text: "A C++ program starts at `main`. Everything else you use, from `cout` to `vector`, is declared in a header that you pull in with `#include`." },
          { kind: "code", run: true, caption: "The smallest useful program.", code: `#include <iostream>

int main() {
    std::cout << "hello, mainville" << '\\n';
    return 0;
}
` },
          { kind: "text", text: "`main` returns an `int` status; falling off the end of `main` returns 0 for you, so most programs omit `return 0`." },
          { kind: "idiom", title: "Name your headers", text: "Include the header for every library name you use (`<vector>`, `<string>`, `<algorithm>`). A name that compiles on your machine only because another header happened to include it will fail somewhere else." },
          { kind: "text", text: "`using namespace std;` lets you write `cout` instead of `std::cout`. That is fine inside a single `.cpp` file and common in interview code, but never put it in a header: every file that includes the header inherits it, and names start to collide." },
          { kind: "interview", text: "Interviewers do not mind `using namespace std;` in a coding round. They do notice a missing `#include <algorithm>` or a guessed signature, so state the headers you need out loud." },
        ],
      },
      {
        title: "Fast input and output",
        blocks: [
          { kind: "text", text: "`cin >> x` reads one whitespace-separated token into `x`; `cout << x` writes it. Both chain: `cin >> a >> b;`." },
          { kind: "pitfall", title: "endl is a flush", text: "`std::endl` writes a newline and then flushes the buffer. Do that 200,000 times and the program spends its time flushing. Write `'\\n'` and let the buffer fill." },
          { kind: "code", caption: "The usual preamble for stdin/stdout problems (online assessments, contest-style tasks).", code: `#include <iostream>

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int n;
    std::cin >> n;
    for (int i = 0; i < n; ++i) {
        int x;
        std::cin >> x;
        std::cout << x * 2 << '\\n';
    }
}
` },
          { kind: "text", text: "`sync_with_stdio(false)` stops the C++ streams from staying in lock-step with C's `stdin`/`stdout`, and `cin.tie(nullptr)` stops `cin` flushing `cout` before every read. After the first call, never mix `cin` with `scanf` or `cout` with `printf`." },
          { kind: "idiom", title: "Two lines, then forget them", text: "Paste the two-line preamble at the top of `main` for any stdin-heavy task. Function-style problems (you write `Solution::solve`) do no I/O of their own, so you will not need it there." },
        ],
      },
    ],
  },
  {
    id: "s1-types", region: "R0", section: "S1",
    title: "Types, ranges and overflow",
    summary: "Which integer type to reach for, and the three ways a sum silently goes wrong.",
    cardIds: ["s1-wide-types", "s1-unsigned-wrap", "s1-literal-1e9", "s1-big-sum-order", "s1-widen-cloze"],
    problemIds: ["cargo-total", "safe-midpoint"],
    pages: [
      {
        title: "The types you use",
        blocks: [
          { kind: "text", text: "The standard only promises minimum sizes. In practice: `char` is 1 byte, `int` is 32 bits (about ±2.1 billion), `long long` is 64 bits (about ±9.2 quintillion) and `double` is a 64-bit float. Ask the compiler instead of guessing:" },
          { kind: "code", run: true, caption: "sizeof reports bytes on this target.", code: `#include <iostream>

int main() {
    std::cout << "char " << sizeof(char) << '\\n';
    std::cout << "int " << sizeof(int) << '\\n';
    std::cout << "long long " << sizeof(long long) << '\\n';
    std::cout << "double " << sizeof(double) << '\\n';
}
` },
          { kind: "idiom", title: "Default to int, widen on purpose", text: "Use `int` for counts and indices that stay small. The moment a value can be a sum or product of many inputs (money, distances, products of two ints), use `long long`. `long` is 32 bits on some platforms and 64 on others, so avoid it." },
          { kind: "interview", text: "Saying \"the sum can reach n times the maximum element, about 10^5 * 10^9, so I'll use long long\" is exactly the verification signal interviewers listen for." },
        ],
      },
      {
        title: "Overflow and literals",
        blocks: [
          { kind: "text", text: "Signed overflow is undefined behaviour: the compiler may assume it never happens, so the result is not guaranteed to wrap. Unsigned overflow is defined and wraps modulo 2^N. Both are bugs when you did not mean them." },
          { kind: "code", run: true, caption: "Widen one operand before multiplying.", code: `#include <iostream>

int main() {
    int n = 100000;
    long long wide = 1LL * n * n;   // 64-bit from the start
    std::cout << wide << '\\n';
}
` },
          { kind: "pitfall", title: "Too late to widen", text: "`long long x = n * n;` multiplies in `int` first and overflows, then widens the garbage. The literal suffix `LL` or a cast on one operand must come before the operation." },
          { kind: "pitfall", title: "accumulate's init decides the type", text: "`std::accumulate(v.begin(), v.end(), 0)` sums in `int` because `0` is an int, even if `v` holds `long long`. Pass `0LL`." },
          { kind: "text", text: "Literals: `5` is `int`, `5LL` is `long long`, `5.0` is `double`, and `1e9` is a `double` (convertible to `long long` exactly, but not an integer literal). To write a billion as an integer, use `1'000'000'000` or `1000000000`." },
        ],
      },
      {
        title: "size_t and unsigned traps",
        blocks: [
          { kind: "text", text: "Container sizes (`v.size()`) are `size_t`, an unsigned type. Mixing it with signed values is the classic source of off-by-everything bugs." },
          { kind: "pitfall", title: "Empty-vector wraparound", text: "For an empty vector, `v.size() - 1` is not -1; it wraps to the largest unsigned value. `for (size_t i = v.size() - 1; i >= 0; --i)` never ends, because an unsigned `i >= 0` is always true." },
          { kind: "code", caption: "Count down safely: convert once, up front.", code: `for (int i = static_cast<int>(v.size()) - 1; i >= 0; --i) {
    // use v[i]
}
` },
          { kind: "idiom", title: "Cast size once", text: "`const int n = static_cast<int>(v.size());` at the top of a function turns every later comparison and subtraction back into ordinary signed arithmetic." },
        ],
      },
    ],
  },
  {
    id: "s1-arithmetic", region: "R0", section: "S1",
    title: "Division, modulo and conversions",
    summary: "How / and % treat negatives, where conversions happen, and what auto really gives you.",
    cardIds: ["s1-negative-mod", "s1-int-division-double", "s1-halving-steps", "s1-auto-sizeof", "s1-narrowing-error", "s1-auto-noinit-error"],
    problemIds: ["wrap-dial", "vowel-census"],
    pages: [
      {
        title: "Integer division and modulo",
        blocks: [
          { kind: "text", text: "Between two integers, `/` discards the fraction by truncating toward zero, and `%` gives the remainder that makes `(a / b) * b + a % b == a` true. For negatives, the remainder takes the sign of the dividend." },
          { kind: "code", run: true, caption: "Truncation toward zero, remainder follows the dividend.", code: `#include <iostream>

int main() {
    std::cout << 7 / 2 << ' ' << 7 % 2 << '\\n';
    std::cout << -7 / 2 << ' ' << -7 % 2 << '\\n';
    std::cout << 7 / -2 << ' ' << 7 % -2 << '\\n';
}
` },
          { kind: "idiom", title: "Floor modulo for rings", text: "To wrap an index into [0, m) even when it can be negative, write `((x % m) + m) % m`. It appears in circular buffers, clock arithmetic and hashing." },
          { kind: "interview", text: "Mention the negative case before you are asked. \"I'll use floor modulo because the offset can be negative\" is a one-line verification that separates careful candidates." },
        ],
      },
      {
        title: "Conversions, narrowing and auto",
        blocks: [
          { kind: "text", text: "A conversion happens where the types meet, not where the result is stored. `double d = 7 / 2;` divides two ints first (3) and then converts. Make one operand floating-point before the division." },
          { kind: "code", run: true, caption: "Where the conversion happens decides the answer.", code: `#include <iostream>

int main() {
    double a = 7 / 2;
    double b = 7 / 2.0;
    double c = static_cast<double>(7) / 2;
    std::cout << a << ' ' << b << ' ' << c << '\\n';
}
` },
          { kind: "text", text: "Brace initialisation (`int x{3.5};`) refuses conversions that could lose information. That is a feature: it turns a silent truncation into a compile error." },
          { kind: "text", text: "`auto` deduces the type from the initialiser: `auto n = 5;` is an `int` and `auto n = 5LL;` is a `long long`. It never widens for you, so choose the literal on purpose. Use it where the type is obvious or long (iterators, lambdas), and spell the type out when it documents intent, like `long long total = 0;`." },
          { kind: "pitfall", title: "auto and accumulators", text: "`auto total = 0;` is an `int`. If you will add large values to it, write `long long total = 0;`." },
        ],
      },
    ],
  },
];
