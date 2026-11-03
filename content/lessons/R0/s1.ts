import type { Lesson } from "@/lib/lessons/types";

/** R0 Syntax Shores, S1 "Program basics" lesson (CUR §2). Original text. */
export const s1Lesson: Lesson = {
  id: "s1-program-basics",
  region: "R0",
  title: "Program Basics",
  motivation:
    "Phone screen, shared editor, 35 minutes on the clock. The interviewer says: \"Take your time, just read the input and print the answer.\" Candidates lose minutes here, not on the algorithm: a missing include, a flushed newline, an int that quietly wrapped around. This lesson makes the first 30 lines of every solution automatic.",
  screens: [
    {
      title: "The smallest useful program",
      blocks: [
        { kind: "text", text: "Every C++ program starts in `main`. Anything from the standard library has to be announced with `#include`, and its names live in the `std` namespace." },
        {
          kind: "code", run: true, caption: "Read a number, print it doubled.",
          code: `#include <iostream>
using namespace std;

int main() {
    int n = 21;            // on a judge this would be: cin >> n;
    cout << n * 2 << '\\n';
}
`,
        },
        { kind: "text", text: "`using namespace std;` saves typing `std::` everywhere. In a single interview file that is fine. In a header it is not, because it forces the choice on every file that includes yours." },
        {
          kind: "idiom", title: "Fast input and output",
          code: `#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // ... all reading and writing with cin / cout only
}
`,
        },
        { kind: "pitfall", title: "endl is a flush", text: "`endl` writes a newline and flushes the stream. Do that a million times and the program spends its time in the operating system. Write `'\\n'` instead. After `sync_with_stdio(false)`, never mix `cin`/`cout` with `scanf`/`printf`." },
        { kind: "recall", id: "s1-r1", prompt: "You print 200 000 answers, one per line. Which line ending is right?", choices: ["endl", "'\\n'", "flush", "\"\\r\""], answer: 1, explanation: "`'\\n'` ends the line without forcing a flush. `endl` flushes every time." },
      ],
    },
    {
      title: "Numbers have sizes",
      blocks: [
        { kind: "text", text: "An `int` is a box with 32 bits on every judge you will meet. One bit is the sign, so it holds about plus or minus two billion. A `long long` has 64 bits and holds about 9.2 quintillion." },
        {
          kind: "picture", caption: "Where the limits come from.",
          lines: [
            "int        [ s | 31 bits of magnitude          ]  -2^31 .. 2^31-1",
            "                                                  (-2.1e9 .. 2.1e9)",
            "long long  [ s | 63 bits of magnitude ........ ]  -2^63 .. 2^63-1",
            "                                                  (-9.2e18 .. 9.2e18)",
          ],
        },
        { kind: "text", text: "Rule of thumb for constraints: if a value, a sum or a product can pass 2·10^9, use `long long`. Ten thousand values of 10^9 added together is already 10^13." },
        { kind: "pitfall", title: "Overflow is silent", text: "Signed overflow is undefined behaviour: no error, no warning at runtime, just wrong answers (or worse, an optimiser that assumes it never happens). The fix is to pick the wider type before the arithmetic." },
        { kind: "recall", id: "s1-r2", prompt: "N is up to 10^5 and each a[i] is up to 10^9. What type holds sum(a)?", choices: ["int", "unsigned int", "long long", "float"], answer: 2, explanation: "The sum can reach 10^14, far beyond 2.1e9. `long long` holds it, and so does nothing else on this list." },
      ],
    },
    {
      title: "Literals and the 1LL habit",
      blocks: [
        { kind: "text", text: "A literal has a type of its own. `1000000007` is an int. `1LL` is a long long. `1e9` looks like an integer but is a `double`." },
        {
          kind: "code", run: true, caption: "Same value, different types.",
          code: `#include <iostream>
using namespace std;

int main() {
    cout << (long long)1e9 + 7 << '\\n';
    cout << 1e9 + 7 << '\\n';
    cout << 1LL * 100000 * 100000 << '\\n';
}
`,
        },
        { kind: "text", text: "The middle line prints `1e+09`: a `double` shows six significant digits by default. The last line multiplies in 64-bit because the `1LL` goes first; `100000 * 100000 * 1LL` would multiply the two ints first and wrap." },
        { kind: "idiom", title: "The modulus constant", code: `const int MOD = 1'000'000'007;   // digit separators are C++14\nlong long x = 1LL * a * b % MOD;\n` },
        { kind: "recall", id: "s1-r3", prompt: "Which expression multiplies two ints a and b without overflowing for a, b up to 10^9?", choices: ["a * b", "(long long)(a * b)", "1LL * a * b", "a * b * 1LL"], answer: 2, explanation: "`1LL * a` promotes to long long before the second multiplication. Casting the product afterwards is too late, and `a * b * 1LL` multiplies the ints first." },
      ],
    },
    {
      title: "Division and modulo with negatives",
      blocks: [
        { kind: "text", text: "Integer division throws the fraction away by rounding toward zero. The remainder is then whatever makes `(a / b) * b + a % b == a` true, so it takes the sign of `a`." },
        {
          kind: "code", run: true, caption: "Negative numbers do not floor.",
          code: `#include <iostream>
using namespace std;

int main() {
    cout << 7 / 2 << ' ' << 7 % 2 << '\\n';
    cout << -7 / 2 << ' ' << -7 % 2 << '\\n';
    cout << 7 / -2 << ' ' << 7 % -2 << '\\n';
}
`,
        },
        { kind: "idiom", title: "Always-non-negative modulo", code: `int mod(int x, int m) {\n    return ((x % m) + m) % m;   // m > 0\n}\n` },
        { kind: "text", text: "You need this for circular arrays, clocks, hash buckets and every \"wrap around\" problem. The inner `% m` lands in (-m, m), the `+ m` lifts it above zero, the outer `% m` folds it back." },
        { kind: "recall", id: "s1-r4", prompt: "In C++, what does -9 % 4 evaluate to?", choices: ["1", "-1", "3", "-3"], answer: 1, explanation: "-9 / 4 truncates to -2, and -2 * 4 + r = -9 gives r = -1. The remainder takes the dividend's sign." },
      ],
    },
    {
      title: "Conversions, narrowing and auto",
      blocks: [
        { kind: "text", text: "Mixed arithmetic converts to the wider type: int with double gives double. Assigning a wider value to a narrower variable truncates silently, unless you use braces: `int x{big};` is a narrowing error in clang and at least a warning in g++." },
        {
          kind: "code", caption: "Braces catch the lossy conversion.",
          code: `#include <iostream>
using namespace std;

int main() {
    long long big = 5000000000LL;
    int silent = big;      // compiles, keeps only the low 32 bits
    // int caught{big};    // clang: error (narrowing), g++: warning
    cout << (silent == big ? "kept" : "lost") << '\\n';
}
`,
          run: true,
        },
        { kind: "text", text: "`auto` copies the type of its initialiser and nothing more. `auto x = 7 / 2;` is an int holding 3. It does not make arithmetic smarter." },
        { kind: "pitfall", title: "size_t is unsigned", text: "`v.size()` returns an unsigned type. On an empty vector `v.size() - 1` does not give -1; it wraps to a huge number, and a loop `for (i = 0; i <= v.size() - 1; ++i)` runs off the end. Use `(int)v.size() - 1` or test `empty()` first." },
        { kind: "recall", id: "s1-r5", prompt: "std::vector<int> v is empty. What does `v.size() - 1 > 0` give?", choices: ["false, because the size is 0", "true, because the subtraction wraps", "a compile error", "undefined: depends on the compiler"], answer: 1, explanation: "`size_t` is unsigned, so 0 - 1 wraps to 2^64 - 1, which is greater than 0. This is well-defined, and a classic bug." },
      ],
    },
    {
      title: "Midpoint check",
      blocks: [
        { kind: "text", text: "One last habit that earns trust in an interview: the midpoint. `(lo + hi) / 2` is the textbook line, and it overflows when `lo + hi` passes 2·10^9, which happens in binary searches over large ranges." },
        { kind: "idiom", title: "Overflow-safe midpoint", code: `int mid = lo + (hi - lo) / 2;\n` },
        { kind: "text", text: "`hi - lo` never exceeds `hi`, so the sum stays in range. Interviewers watch for it, and for the same reason for the 1LL, the `'\\n'` and the size_t. Now try the Syntax Shores exercises: each one is built to trip exactly one of these." },
        { kind: "recall", id: "s1-r6", prompt: "lo = 2'000'000'000 and hi = 2'100'000'000 (both fit in int). Which midpoint is safe?", choices: ["(lo + hi) / 2", "lo + (hi - lo) / 2", "(lo + hi) >> 1", "hi / 2 + lo / 2 + 1"], answer: 1, explanation: "`lo + hi` is 4.1e9, which overflows int, so the first and third options fail. The last is off by one for many inputs (try lo = hi = 4). `lo + (hi - lo) / 2` is exact." },
      ],
    },
  ],
};
