(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,7584,14284,e=>{"use strict";var t=e.i(43476),n=e.i(71645),i=e.i(93432);function s({text:e}){return(0,t.jsx)(t.Fragment,{children:e.split("`").map((e,t)=>({code:t%2==1,text:e})).filter(e=>""!==e.text).map((e,n)=>e.code?(0,t.jsx)("code",{className:"rounded bg-black/40 px-1 font-mono text-[0.9em] [font-variant-ligatures:none]",children:e.text},n):(0,t.jsx)("span",{children:e.text},n))})}let o={idiom:{label:"Idiom",cls:"border-emerald-400/60 bg-emerald-500/10"},pitfall:{label:"Pitfall",cls:"border-rose-400/60 bg-rose-500/10"},interview:{label:"Interview",cls:"border-sky-400/60 bg-sky-500/10"}};function a({block:e,output:n}){switch(e.kind){case"text":return(0,t.jsx)("p",{className:"text-sm leading-6",children:(0,t.jsx)(s,{text:e.text})});case"code":return(0,t.jsxs)("figure",{className:"flex flex-col gap-1",children:[(0,t.jsx)("pre",{className:"overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono text-[13px] leading-5 [font-variant-ligatures:none]","aria-label":"code",children:e.code.replace(/\n$/,"")}),e.run&&void 0!==n?(0,t.jsxs)("pre",{className:"overflow-x-auto rounded border border-emerald-400/30 bg-emerald-500/10 p-2 font-mono text-xs leading-5","aria-label":"program output","data-testid":"lesson-output",children:[(0,t.jsx)("span",{className:"mb-1 block font-display text-[10px] uppercase tracking-wider opacity-60",children:"Output"}),n.replace(/\n$/,"")]}):null,e.caption?(0,t.jsx)("figcaption",{className:"text-xs opacity-70",children:e.caption}):null]});default:{let n=o[e.kind];return(0,t.jsxs)("aside",{className:`rounded border p-3 text-sm leading-6 ${n.cls}`,children:[(0,t.jsxs)("strong",{className:"mr-1 font-display text-xs uppercase tracking-wider",children:[n.label,"title"in e?`: ${e.title}`:""]}),(0,t.jsx)(s,{text:e.text})]})}}}e.s(["f",0,function({lesson:e,cards:s,computed:o,outputs:r,onComplete:l}){let[d,c]=(0,n.useState)(0),u=e.pages.length,h=d>=u,p=s.filter(t=>e.cardIds.includes(t.id));if((0,n.useEffect)(()=>{h&&l?.()},[h,l]),h)return(0,t.jsxs)("div",{className:"mx-auto flex max-w-2xl flex-col gap-3","data-testid":"lesson-practice",children:[(0,t.jsx)(i.f,{cards:p,computed:o,size:Math.min(5,p.length),seed:11}),(0,t.jsxs)("div",{className:"panel p-3 text-sm",children:[(0,t.jsx)("h3",{className:"font-display text-xs uppercase tracking-wider text-[var(--gold)]",children:"Exercises that use this"}),(0,t.jsx)("ul",{className:"mt-1 flex flex-wrap gap-2",children:e.problemIds.map(e=>(0,t.jsx)("li",{className:"rounded border border-white/15 bg-black/30 px-2 py-1 font-mono text-xs",children:e},e))})]}),(0,t.jsx)("button",{className:"px-btn min-h-11 self-start px-4",onClick:()=>c(0),children:"Read the lesson again"})]});let m=e.pages[d];return(0,t.jsxs)("section",{className:"panel mx-auto flex max-w-2xl flex-col gap-3 p-4","aria-label":"Lesson",children:[(0,t.jsxs)("header",{className:"flex flex-col gap-1",children:[(0,t.jsxs)("span",{className:"font-display text-[10px] uppercase tracking-wider opacity-60",children:[e.section," · ",e.title]}),(0,t.jsx)("h2",{className:"font-display text-lg text-[var(--gold)]",children:m.title})]}),(0,t.jsx)("div",{className:"flex flex-col gap-3","data-testid":"lesson-page",children:m.blocks.map((n,i)=>{let s;return(0,t.jsx)(a,{block:n,output:r[s=e.id,`${s}:${d}:${i}`]},`${d}-${i}`)})}),(0,t.jsxs)("footer",{className:"flex items-center justify-between gap-2",children:[(0,t.jsx)("button",{className:"px-btn min-h-11 px-4",disabled:0===d,onClick:()=>c(d-1),children:"Back"}),(0,t.jsxs)("span",{className:"text-xs opacity-70","aria-live":"polite",children:["Page ",d+1," / ",u]}),(0,t.jsx)("button",{className:"px-btn px-btn-primary min-h-11 px-4",onClick:()=>c(d+1),children:d+1===u?"Practice":"Next"})]})]})}],7584);var r=e.i(59808);let l=[{id:"s1-first-program",region:"R0",section:"S1",title:"Your first program",summary:"main, includes, and the input/output habits that keep a solution fast.",cardIds:["s1-missing-include","s1-endl-vs-newline","s1-sync-stdio","s1-fast-io-cloze"],problemIds:["ledger-digits"],pages:[{title:"main and includes",blocks:[{kind:"text",text:"A C++ program starts at `main`. Everything else you use, from `cout` to `vector`, is declared in a header that you pull in with `#include`."},{kind:"code",run:!0,caption:"The smallest useful program.",code:`#include <iostream>

int main() {
    std::cout << "hello, mainville" << '\\n';
    return 0;
}
`},{kind:"text",text:"`main` returns an `int` status; falling off the end of `main` returns 0 for you, so most programs omit `return 0`."},{kind:"idiom",title:"Name your headers",text:"Include the header for every library name you use (`<vector>`, `<string>`, `<algorithm>`). A name that compiles on your machine only because another header happened to include it will fail somewhere else."},{kind:"text",text:"`using namespace std;` lets you write `cout` instead of `std::cout`. That is fine inside a single `.cpp` file and common in interview code, but never put it in a header: every file that includes the header inherits it, and names start to collide."},{kind:"interview",text:"Interviewers do not mind `using namespace std;` in a coding round. They do notice a missing `#include <algorithm>` or a guessed signature, so state the headers you need out loud."}]},{title:"Fast input and output",blocks:[{kind:"text",text:"`cin >> x` reads one whitespace-separated token into `x`; `cout << x` writes it. Both chain: `cin >> a >> b;`."},{kind:"pitfall",title:"endl is a flush",text:"`std::endl` writes a newline and then flushes the buffer. Do that 200,000 times and the program spends its time flushing. Write `'\\n'` and let the buffer fill."},{kind:"code",caption:"The usual preamble for stdin/stdout problems (online assessments, contest-style tasks).",code:`#include <iostream>

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
`},{kind:"text",text:"`sync_with_stdio(false)` stops the C++ streams from staying in lock-step with C's `stdin`/`stdout`, and `cin.tie(nullptr)` stops `cin` flushing `cout` before every read. After the first call, never mix `cin` with `scanf` or `cout` with `printf`."},{kind:"idiom",title:"Two lines, then forget them",text:"Paste the two-line preamble at the top of `main` for any stdin-heavy task. Function-style problems (you write `Solution::solve`) do no I/O of their own, so you will not need it there."}]}]},{id:"s1-types",region:"R0",section:"S1",title:"Types, ranges and overflow",summary:"Which integer type to reach for, and the three ways a sum silently goes wrong.",cardIds:["s1-wide-types","s1-unsigned-wrap","s1-literal-1e9","s1-big-sum-order","s1-widen-cloze"],problemIds:["cargo-total","safe-midpoint"],pages:[{title:"The types you use",blocks:[{kind:"text",text:"The standard only promises minimum sizes. In practice: `char` is 1 byte, `int` is 32 bits (about ±2.1 billion), `long long` is 64 bits (about ±9.2 quintillion) and `double` is a 64-bit float. Ask the compiler instead of guessing:"},{kind:"code",run:!0,caption:"sizeof reports bytes on this target.",code:`#include <iostream>

int main() {
    std::cout << "char " << sizeof(char) << '\\n';
    std::cout << "int " << sizeof(int) << '\\n';
    std::cout << "long long " << sizeof(long long) << '\\n';
    std::cout << "double " << sizeof(double) << '\\n';
}
`},{kind:"idiom",title:"Default to int, widen on purpose",text:"Use `int` for counts and indices that stay small. The moment a value can be a sum or product of many inputs (money, distances, products of two ints), use `long long`. `long` is 32 bits on some platforms and 64 on others, so avoid it."},{kind:"interview",text:'Saying "the sum can reach n times the maximum element, about 10^5 * 10^9, so I\'ll use long long" is exactly the verification signal interviewers listen for.'}]},{title:"Overflow and literals",blocks:[{kind:"text",text:"Signed overflow is undefined behaviour: the compiler may assume it never happens, so the result is not guaranteed to wrap. Unsigned overflow is defined and wraps modulo 2^N. Both are bugs when you did not mean them."},{kind:"code",run:!0,caption:"Widen one operand before multiplying.",code:`#include <iostream>

int main() {
    int n = 100000;
    long long wide = 1LL * n * n;   // 64-bit from the start
    std::cout << wide << '\\n';
}
`},{kind:"pitfall",title:"Too late to widen",text:"`long long x = n * n;` multiplies in `int` first and overflows, then widens the garbage. The literal suffix `LL` or a cast on one operand must come before the operation."},{kind:"pitfall",title:"accumulate's init decides the type",text:"`std::accumulate(v.begin(), v.end(), 0)` sums in `int` because `0` is an int, even if `v` holds `long long`. Pass `0LL`."},{kind:"text",text:"Literals: `5` is `int`, `5LL` is `long long`, `5.0` is `double`, and `1e9` is a `double` (convertible to `long long` exactly, but not an integer literal). To write a billion as an integer, use `1'000'000'000` or `1000000000`."}]},{title:"size_t and unsigned traps",blocks:[{kind:"text",text:"Container sizes (`v.size()`) are `size_t`, an unsigned type. Mixing it with signed values is the classic source of off-by-everything bugs."},{kind:"pitfall",title:"Empty-vector wraparound",text:"For an empty vector, `v.size() - 1` is not -1; it wraps to the largest unsigned value. `for (size_t i = v.size() - 1; i >= 0; --i)` never ends, because an unsigned `i >= 0` is always true."},{kind:"code",caption:"Count down safely: convert once, up front.",code:`for (int i = static_cast<int>(v.size()) - 1; i >= 0; --i) {
    // use v[i]
}
`},{kind:"idiom",title:"Cast size once",text:"`const int n = static_cast<int>(v.size());` at the top of a function turns every later comparison and subtraction back into ordinary signed arithmetic."}]}]},{id:"s1-arithmetic",region:"R0",section:"S1",title:"Division, modulo and conversions",summary:"How / and % treat negatives, where conversions happen, and what auto really gives you.",cardIds:["s1-negative-mod","s1-int-division-double","s1-halving-steps","s1-auto-sizeof","s1-narrowing-error","s1-auto-noinit-error"],problemIds:["wrap-dial","vowel-census"],pages:[{title:"Integer division and modulo",blocks:[{kind:"text",text:"Between two integers, `/` discards the fraction by truncating toward zero, and `%` gives the remainder that makes `(a / b) * b + a % b == a` true. For negatives, the remainder takes the sign of the dividend."},{kind:"code",run:!0,caption:"Truncation toward zero, remainder follows the dividend.",code:`#include <iostream>

int main() {
    std::cout << 7 / 2 << ' ' << 7 % 2 << '\\n';
    std::cout << -7 / 2 << ' ' << -7 % 2 << '\\n';
    std::cout << 7 / -2 << ' ' << 7 % -2 << '\\n';
}
`},{kind:"idiom",title:"Floor modulo for rings",text:"To wrap an index into [0, m) even when it can be negative, write `((x % m) + m) % m`. It appears in circular buffers, clock arithmetic and hashing."},{kind:"interview",text:'Mention the negative case before you are asked. "I\'ll use floor modulo because the offset can be negative" is a one-line verification that separates careful candidates.'}]},{title:"Conversions, narrowing and auto",blocks:[{kind:"text",text:"A conversion happens where the types meet, not where the result is stored. `double d = 7 / 2;` divides two ints first (3) and then converts. Make one operand floating-point before the division."},{kind:"code",run:!0,caption:"Where the conversion happens decides the answer.",code:`#include <iostream>

int main() {
    double a = 7 / 2;
    double b = 7 / 2.0;
    double c = static_cast<double>(7) / 2;
    std::cout << a << ' ' << b << ' ' << c << '\\n';
}
`},{kind:"text",text:"Brace initialisation (`int x{3.5};`) refuses conversions that could lose information. That is a feature: it turns a silent truncation into a compile error."},{kind:"text",text:"`auto` deduces the type from the initialiser: `auto n = 5;` is an `int` and `auto n = 5LL;` is a `long long`. It never widens for you, so choose the literal on purpose. Use it where the type is obvious or long (iterators, lambdas), and spell the type out when it documents intent, like `long long total = 0;`."},{kind:"pitfall",title:"auto and accumulators",text:"`auto total = 0;` is an `int`. If you will add large values to it, write `long long total = 0;`."}]}]},{id:"s2-branches-loops",region:"R0",section:"S2",title:"Branches and loops",summary:"if/else chains, switch and its fallthrough trap, and steering loops with break and continue.",cardIds:["s2-switch-fallthrough","s2-dangling-else","s2-continue-trace","s2-break-nested","s2-switch-types","s2-switch-init-error"],problemIds:["toll-booth","charge-meter"],pages:[{title:"if, else and switch",blocks:[{kind:"text",text:"An `if / else if / else` chain tests its conditions top to bottom and runs only the first branch that matches. Order matters: put the narrowest or cheapest-to-rule-out condition first, and make every range boundary explicit (`<` or `<=`) so no value falls between two branches."},{kind:"code",run:!0,caption:"The first matching branch wins; the rest are skipped.",code:`#include <iostream>

const char* grade(int score) {
    if (score >= 90) return "A";
    else if (score >= 75) return "B";
    else if (score >= 50) return "C";
    return "F";
}

int main() {
    std::cout << grade(95) << grade(75) << grade(74) << grade(10) << '\\n';
}
`},{kind:"pitfall",title:"Dangling else",text:"An `else` pairs with the nearest unmatched `if`, regardless of indentation. Always use braces on branches that contain another `if`."},{kind:"text",text:"`switch` selects among integer constants. The controlling value must be an integer or enum type, and each `case` label a compile-time constant. Execution starts at the matching label and runs straight on to the end of the block unless something stops it."},{kind:"code",run:!0,caption:"Missing breaks fall through into the next case.",code:`#include <iostream>

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
`},{kind:"idiom",title:"Break every case",text:"Stack empty case labels to share a body, and end every non-empty case with `break` or `return`. If a fallthrough is really intended, write `[[fallthrough]];` so the next reader knows."},{kind:"interview",text:'For a rule table with ranges (tax brackets, tolls, grades), say the boundaries out loud: "inclusive at the top, exclusive at the bottom". Off-by-one on a range edge is the most common bug in this kind of question.'}]},{title:"Loops, break and continue",blocks:[{kind:"text",text:"Use `for` when you know the counting range, `while` when you loop until a condition changes, and a range-for (`for (const auto& x : v)`) when you only need each element. Declare the loop variable in the `for` header so it cannot leak into later code."},{kind:"code",run:!0,caption:"continue skips one iteration; break leaves the loop.",code:`#include <iostream>

int main() {
    for (int i = 1; i <= 8; ++i) {
        if (i % 2 == 0) continue;     // skip even numbers
        if (i > 6) break;             // stop for good
        std::cout << i << ' ';
    }
    std::cout << '\\n';
}
`},{kind:"pitfall",title:"break leaves one loop",text:"`break` exits only the innermost loop or switch. To escape two loops at once, put them in a function and `return`, or test a flag in the outer loop's condition."},{kind:"text",text:'A useful habit before writing any loop: state the invariant and the exit condition in one sentence ("i is the next index to read; stop when i == n"). It makes both the boundaries and the loop\'s termination easy to check.'},{kind:"interview",text:"When you finish a loop, walk the smallest input through it (empty, one element) and say what it does. Interviewers score that dry run under Verification."}]}]},{id:"s2-functions",region:"R0",section:"S2",title:"Functions and how arguments travel",summary:"Pass by value, reference and const reference, and why the wrong choice times out.",cardIds:["s2-by-value-tle","s2-ref-vs-value","s2-const-ref-error","s2-overload-pick","s2-default-arg-cloze"],problemIds:["shelf-rank"],pages:[{title:"Value, reference, const reference",blocks:[{kind:"text",text:"A parameter declared `int x` is a copy: changing it never affects the caller. A parameter declared `int& x` is another name for the caller's variable. A parameter declared `const T& x` is a read-only name, with no copy."},{kind:"code",run:!0,caption:"Only the reference parameter changes the caller's variable.",code:`#include <iostream>

void addCopy(int x) { x += 10; }
void addRef(int& x) { x += 10; }

int main() {
    int n = 1;
    addCopy(n);
    std::cout << n << ' ';
    addRef(n);
    std::cout << n << '\\n';
}
`},{kind:"idiom",title:"The default rule",text:"Small things (ints, doubles, chars, pointers) by value. Large read-only things (`vector`, `string`, `map`) by `const T&`. Things the function must update by `T&`."},{kind:"pitfall",title:"Copying a vector per call",text:"`bool has(vector<int> v, int x)` copies every element on every call. Called inside a loop over n items, an O(n) lookup becomes O(n^2) work just from copying, and a solution that was correct on paper times out. Write `const vector<int>& v`."},{kind:"interview",text:"Declaring parameters `const&` signals that you know what a copy costs. Interviewers notice the unprompted `const vector<int>&` in a LeetCode signature, and they notice its absence."}]},{title:"Return types, overloads and defaults",blocks:[{kind:"text",text:"Return by value for results (the compiler moves or elides the copy for you). Return `bool` for yes/no, `int` or `long long` for counts and totals, and `void` only when the function exists for its side effect. Never return a reference or pointer to a local variable: it is destroyed when the function returns."},{kind:"text",text:"Overloading lets several functions share a name when their parameter types differ. The compiler picks the best match: exact type first, then a promotion (`char` to `int`, `float` to `double`), then a conversion. If two candidates tie, the call is ambiguous and does not compile."},{kind:"code",run:!0,caption:"Exact match beats promotion.",code:`#include <iostream>

void show(int) { std::cout << "int "; }
void show(double) { std::cout << "double "; }

int main() {
    show(1);
    show(1.0);
    show('x');     // char promotes to int
    std::cout << '\\n';
}
`},{kind:"text",text:"A default argument (`int scale(int x, int factor = 10)`) is filled in when the caller omits it. Defaults must be the rightmost parameters and are written only in the declaration the caller sees."},{kind:"idiom",title:"Prefer a clear name",text:"Overloads are handy for the same operation on different types. If two functions do different things, give them different names; `scoreByLength` and `scoreByVowels` read better than two `score` overloads."}]}]},{id:"s2-recursion-static",region:"R0",section:"S2",title:"Recursion, the call stack and static",summary:"Base case plus smaller subproblem, how deep is too deep, and state that outlives a call.",cardIds:["s2-recursion-trace","s2-missing-base-case","s2-static-local","s2-digit-sum-parsons"],problemIds:["echo-chamber","pocket-calendar"],pages:[{title:"Recursion and the call stack",blocks:[{kind:"text",text:"A recursive function solves a problem by calling itself on a smaller version of it. Every recursive function needs two things: a **base case** that returns without recursing, and a **recursive step** that moves strictly toward the base case."},{kind:"code",run:!0,caption:"Halving the exponent: depth is about log2(n), not n.",code:`#include <iostream>

long long power(long long base, int exp) {
    if (exp == 0) return 1;                       // base case
    long long half = power(base, exp / 2);        // smaller problem
    return exp % 2 == 0 ? half * half : half * half * base;
}

int main() {
    std::cout << power(3, 13) << '\\n';
}
`},{kind:"text",text:"Each active call occupies a **stack frame** (parameters, locals, return address) on the call stack, which is a small fixed region of memory, often one to a few megabytes. Depth about 10^4 is usually safe; depth 10^6 usually is not."},{kind:"pitfall",title:"Stack overflow",text:"A missing base case, or a recursion that is linear in a large input (one call per element of a 10^6-long list), exhausts the stack and the process crashes. Estimate depth first; switch to a loop or an explicit stack if it can be large."},{kind:"interview",text:'State the recurrence\'s base case and depth before coding it. "Depth is log n, so the stack is fine" or "depth is n up to 10^5, so I\'ll convert this to a loop" are the sentences that earn Problem Solving credit.'}]},{title:"static: state that outlives a call",blocks:[{kind:"text",text:"Inside a function, `static` gives a local variable one shared copy that is initialised the first time control reaches it and keeps its value between calls."},{kind:"code",run:!0,caption:"A static local remembers; a plain local starts over.",code:`#include <iostream>

int countStatic() { static int n = 0; return ++n; }
int countPlain()  { int n = 0;        return ++n; }

int main() {
    std::cout << countStatic() << countStatic() << countStatic() << ' ';
    std::cout << countPlain() << countPlain() << countPlain() << '\\n';
}
`},{kind:"text",text:"On a class member, `static` means the member belongs to the class, not to any object. A `static` member function can be called without an object and cannot touch non-static members. A `static const` table is a good way to hold fixed data (days per month) that is built once."},{kind:"idiom",title:"Static helpers and tables",text:"Put pure helper functions (`isLeapYear`) in the class as `static` member functions, and fixed lookup tables as `static const`. Avoid mutable static state in solutions: a hidden counter that leaks from one test case to the next is a classic source of wrong answers that only appear on the second call."}]}]},{id:"s3-vectors",region:"R0",section:"S3",title:"Vectors and grids",summary:"Building vectors and 2D grids, what push_back, reserve, resize, insert and erase really cost, and looping without copies.",cardIds:["s3-ctor-forms","s3-reserve-resize","s3-oob-index","s3-size-unsigned","s3-2d-init","s3-erase-cost","s3-auto-ref","s3-const-auto-error"],problemIds:["grid-turn","run-squash"],pages:[{title:"Building vectors",blocks:[{kind:"text",text:"`std::vector<T>` is a growable array that owns its elements in one contiguous block. It is the default container for almost every interview problem: indexing is O(1), `push_back` is amortised O(1), and the memory layout is cache friendly. A fixed-size `std::array<int, 5>` has the same indexing but its length is part of the type and it never grows."},{kind:"code",run:!0,caption:"Parentheses give a count, braces give the elements.",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> a(3, 7);     // three elements, each 7
    std::vector<int> b{3, 7};     // two elements: 3 and 7
    std::vector<int> c(4);        // four zeros
    std::cout << a.size() << ' ' << b.size() << ' ' << c.size() << '\\n';
}
`},{kind:"pitfall",title:"(n) is not {n}",text:'`vector<int> v(5)` is five zeros; `vector<int> v{5}` is one element whose value is 5. Use parentheses for "n copies of x" and braces only for a literal list.'},{kind:"text",text:"A grid is a vector of vectors. Build it with the row template as the second constructor argument, so every row is a separate vector of the right length. Indexing is `g[row][col]`, and the shape is `g.size()` by `g[0].size()` (check for an empty grid before touching `g[0]`)."},{kind:"code",run:!0,caption:"An n by m grid of zeros, then a row-major fill.",code:`#include <iostream>
#include <vector>

int main() {
    int n = 2, m = 3;
    std::vector<std::vector<int>> g(n, std::vector<int>(m, 0));
    for (int r = 0; r < n; ++r)
        for (int c = 0; c < m; ++c)
            g[r][c] = r * m + c;
    std::cout << g[1][2] << ' ' << g.size() << 'x' << g[0].size() << '\\n';
}
`},{kind:"idiom",title:"Size first, then fill",text:"If you know the final length, either size the vector up front and assign by index, or call `reserve(n)` and then `push_back`. Both avoid repeated reallocation."},{kind:"interview",text:'Say the shape before you write the loops: "the grid is n rows by m columns, so the result of a transpose is m by n". Non-square inputs are where silent shape mix-ups hide.'}]},{title:"Costs and safe loops",blocks:[{kind:"text",text:"`reserve(n)` only sets aside capacity: the size stays 0 and indexing past the size is still undefined. `resize(n)` changes the size, creating value-initialised elements (zeros for `int`). `push_back` appends at the end, and when the capacity is full the vector moves everything to a bigger block, which is why the cost is O(1) amortised, not worst case."},{kind:"code",run:!0,caption:"size() counts elements, not reserved room.",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    v.reserve(100);
    std::cout << v.size() << ' ';
    v.resize(4);
    v.push_back(9);
    std::cout << v.size() << ' ' << v[3] << ' ' << v.back() << '\\n';
}
`},{kind:"text",text:"Anything that is not at the back is expensive. `insert` and `erase` in the middle or at the front shift every later element, so each call is O(n). Deleting many elements one at a time in a loop is therefore O(n^2); the standard fix is the erase-remove idiom (`v.erase(std::remove(...), v.end())`), which compacts the survivors in one O(n) pass."},{kind:"pitfall",title:"size() is unsigned",text:"`v.size()` returns an unsigned type. On an empty vector `v.size() - 1` wraps to a huge number, so `i < v.size() - 1` loops far out of bounds. Write `i + 1 < v.size()` instead."},{kind:"code",run:!0,caption:"auto& edits the element; auto edits a copy; const auto& reads without copying.",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> v{1, 2, 3};
    for (auto x : v) x *= 10;        // changes a copy
    for (auto& x : v) x += 1;        // changes the element
    for (const auto& x : v) std::cout << x << ' ';
    std::cout << '\\n';
}
`},{kind:"idiom",title:"Range-for defaults",text:"Use `const auto&` to read, `auto&` to modify, and plain `auto` only for cheap values like `int`. With strings or vectors as elements, a plain `auto` silently copies every element."},{kind:"interview",text:'Mention the cost of a mutation as you choose it: "erasing from the front is O(n) each, so I will compact in one pass". Naming the complexity before the interviewer asks is a Problem Solving signal.'}]}]},{id:"s3-strings",region:"R0",section:"S3",title:"Strings, characters and costs",summary:"Indexing, substr and its copying cost, find and npos, character arithmetic, and numbers to and from text.",cardIds:["s3-substr-args","s3-find-npos","s3-char-arith","s3-to-string-stoi","s3-substr-tle"],problemIds:["letter-tally","overlap-count"],pages:[{title:"Indexing, substr and find",blocks:[{kind:"text",text:"`std::string` behaves like a `vector<char>` with text helpers: `s[i]` is O(1), `s.size()` is the length, and `s += x` appends. `s.substr(pos, len)` returns a new string holding a copy of up to `len` characters starting at `pos`; leave `len` out to take everything from `pos`. The copy costs time proportional to its length."},{kind:"code",run:!0,caption:"substr copies; its second argument is a length, not an end index.",code:`#include <iostream>
#include <string>

int main() {
    std::string s = "algorithm";
    std::cout << s.substr(0, 4) << ' ' << s.substr(4) << ' ' << s.substr(3, 2) << '\\n';
}
`},{kind:"text",text:"`s.find(x)` returns the index of the first occurrence of a character or substring, or the special value `std::string::npos` when it is absent. `npos` is the largest `size_t`, so never compare the result with `-1` through an `int`. `find(x, from)` starts the search at `from`, which is how you walk through every occurrence."},{kind:"code",run:!0,caption:"Find every occurrence by restarting just after the last hit.",code:`#include <iostream>
#include <string>

int main() {
    std::string s = "banana";
    std::size_t at = s.find("an");
    while (at != std::string::npos) {
        std::cout << at << ' ';
        at = s.find("an", at + 1);
    }
    std::cout << '\\n';
}
`},{kind:"pitfall",title:"substr in a loop",text:"Calling `s.substr(i)` on every iteration copies the rest of the string each time: O(n^2) for the whole loop. Compare in place with `s.compare(i, len, other)`, or keep indices instead of building new strings."},{kind:"interview",text:'Expect to be asked about the cost of string operations. "Concatenating in a loop with `+=` is fine; building a new substring per position is quadratic" is the answer they want to hear.'}]},{title:"Characters and numbers",blocks:[{kind:"text",text:"A `char` is a small integer, so arithmetic works on it. `c - 'a'` maps `'a'..'z'` to `0..25`, which is the standard way to index a 26-slot counting array. Adding to a letter and casting back (`char('a' + 2)`) goes the other way. Add a plain `'a' + 1` and you get the `int` 98, not a char."},{kind:"code",run:!0,caption:"Counting letters with an array indexed by c - 'a'.",code:`#include <iostream>
#include <string>
#include <vector>

int main() {
    std::string s = "level";
    std::vector<int> count(26, 0);
    for (char c : s) ++count[c - 'a'];
    std::cout << count['l' - 'a'] << count['e' - 'a'] << count['v' - 'a'] << '\\n';
}
`},{kind:"text",text:"From `<cctype>`: `isdigit`, `isalpha` and `tolower` take and return `int`. Pass them an `unsigned char` (or a char you know is ASCII), because a negative value is undefined behaviour. For numbers use `std::to_string(n)` to produce text, and `std::stoi` or `std::stoll` to parse it; they throw on bad input, so only call them on text you have already validated."},{kind:"code",run:!0,caption:"Numbers to text and back.",code:`#include <iostream>
#include <string>

int main() {
    std::string t = std::to_string(12) + std::to_string(30);
    long long n = std::stoll(t) + 1;
    std::cout << t << ' ' << n << '\\n';
}
`},{kind:"idiom",title:"Counting table",text:"For lowercase-only input, `vector<int> count(26)` beats a map: O(1) per character and no hashing. If the alphabet is unknown, use 256 slots indexed by `unsigned char`."},{kind:"interview",text:'Ask about the alphabet before choosing: "lowercase letters only, or any ASCII?". It changes the table size and shows you do not assume.'}]}]},{id:"s3-splitting",region:"R0",section:"S3",title:"Splitting text",summary:"Cut a line into fields with find and substr, or with getline over a stringstream, and know what happens at the edges.",cardIds:["s3-split-parsons","s3-letter-count-cloze"],problemIds:["field-split"],pages:[{title:"Fields from a line",blocks:[{kind:"text",text:"Splitting on a delimiter is a staple of parsing questions. The manual way keeps two indices: where the current field starts and where the next delimiter is. Cut a field out with `substr(start, end - start)`, then move `start` just past the delimiter."},{kind:"code",run:!0,caption:"Manual split on commas; empty fields stay in.",code:`#include <iostream>
#include <string>
#include <vector>

int main() {
    std::string line = "ab,,c";
    std::vector<std::string> out;
    std::size_t start = 0;
    while (true) {
        std::size_t at = line.find(',', start);
        if (at == std::string::npos) { out.push_back(line.substr(start)); break; }
        out.push_back(line.substr(start, at - start));
        start = at + 1;
    }
    std::cout << out.size() << ' ' << '[' << out[1] << ']' << '\\n';
}
`},{kind:"text",text:"The shorter way is a `std::stringstream` with `getline(ss, part, ',')`, which reads up to each delimiter. It is neat, but it has one edge difference: it drops a final empty field, so \"a,b,\" gives two fields, not three. Decide which behaviour the problem wants before you pick the tool."},{kind:"code",run:!0,caption:"getline splitting, and the dropped trailing field.",code:`#include <iostream>
#include <sstream>
#include <string>

int main() {
    std::stringstream ss("a,b,");
    std::string part;
    int fields = 0;
    while (std::getline(ss, part, ',')) ++fields;
    std::cout << fields << '\\n';
}
`},{kind:"pitfall",title:"Edge fields",text:"Always test the input that is empty, the input with no delimiter, a leading delimiter, doubled delimiters and a trailing delimiter. Each one exposes a different off-by-one in a hand-written split."},{kind:"interview",text:'State your edge-case policy first: "I keep empty fields, so \\"a,,b\\" has three". Then run the doubled and trailing cases through your loop out loud.'}]}]},{id:"s4-structs",region:"R0",section:"S4",title:"Structs, constructors and ordering",summary:"A struct bundles fields; a constructor with an initialiser list sets them up; operator< teaches sort how to order your type.",cardIds:["s4-struct-class-access","s4-init-order","s4-this-shadow","s4-no-default-ctor","s4-operator-less"],problemIds:["rank-roster","step-counter"],pages:[{title:"Fields and constructors",blocks:[{kind:"text",text:"A `struct` groups related fields into one type. It is the same as a `class` except for the default access: members of a `struct` are public unless you say otherwise, members of a `class` are private. Interview code uses `struct` for plain data (nodes, points, records) and `class` when there is an invariant to protect."},{kind:"text",text:"A constructor runs when an object is created. The member initialiser list (`: a(x), b(y)`) builds each member directly, which is the right place to set them: the body of the constructor runs after every member already exists. Members are initialised in the order they are *declared* in the struct, not the order you write them in the list."},{kind:"code",run:!0,caption:"Initialiser list, then the body.",code:`#include <iostream>

struct Meter {
    int n;
    explicit Meter(int n) : n(n) {   // member n(parameter n)
        n += 5;                      // changes only the parameter
    }
};

int main() {
    Meter m(1);
    std::cout << m.n << '\\n';
}
`},{kind:"pitfall",title:"The shadowed member",text:"When a parameter has the same name as a member, the bare name means the parameter. `n = n;` in the body assigns the parameter to itself and leaves the member uninitialised. Use the initialiser list, or write `this->n = n;`."},{kind:"idiom",title:"Initialise in the list",text:"`Point(int x, int y) : x(x), y(y) {}` is the standard shape. Declare members in the order you want them initialised and keep the list in that same order, so no one has to guess."},{kind:"interview",text:"Writing a constructor with an initialiser list on the first try signals that you have written real C++ and not only C. Say why you mark single-argument constructors `explicit`: it stops silent conversions like `Meter m = 5;`."}]},{title:"Ordering your own type",blocks:[{kind:"text",text:"`std::sort` orders elements with `operator<`. For your own struct you teach it by defining `bool operator<(const T& other) const`: return true when `*this` must come before `other`. The trailing `const` matters, because the sort compares through const references."},{kind:"code",run:!0,caption:"Sort records by weight, then print their names.",code:`#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Item {
    int w;
    std::string name;
    bool operator<(const Item& o) const { return w < o.w; }
};

int main() {
    std::vector<Item> v{{3, "c"}, {1, "a"}, {2, "b"}};
    std::sort(v.begin(), v.end());
    for (const auto& it : v) std::cout << it.name;
    std::cout << '\\n';
}
`},{kind:"text",text:'A struct without a user constructor can be built with braces, as above (`{3, "c"}`). The moment you write any constructor, the compiler stops generating the default one: `P p;` no longer compiles unless you also provide a no-argument constructor or default arguments.'},{kind:"pitfall",title:"Ties and strictness",text:"`operator<` must be a strict ordering: `a < a` is false. Writing `<=` can crash `std::sort` on equal elements. For a tie-break, compare the next field only when the first is equal, for example with `std::tie(a, b) < std::tie(o.a, o.b)`."},{kind:"idiom",title:"A comparator when you cannot edit the type",text:"`sort(v.begin(), v.end(), [](const Item& a, const Item& b) { return a.w > b.w; });` orders descending without touching the struct."},{kind:"interview",text:'Name the ordering out loud: "smaller weight first, ties by name". A vague comparator is where most sort bugs and most follow-up questions come from.'}]}]},{id:"s4-lists",region:"R0",section:"S4",title:"Linked lists as LeetCode gives them",summary:"ListNode, nullptr, walking with a pointer, the dummy head, and why interview code uses new and does not free.",cardIds:["s4-nullptr","s4-list-walk","s4-dummy-head","s4-new-pointer","s4-append-parsons"],problemIds:["drop-negatives","middle-link","forge-chain"],pages:[{title:"ListNode and pointers",blocks:[{kind:"text",text:"LeetCode hands you a singly linked list as a pointer to the first `ListNode`. Each node holds a value and a pointer to the next node; the last node's `next` is `nullptr`, and an empty list is a null head. Use `nullptr`, not `0` or `NULL`: it has its own pointer type, so overload resolution and templates cannot mistake it for an integer."},{kind:"code",run:!0,caption:"Nodes on the stack, linked by address, walked with a pointer.",code:`#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int main() {
    ListNode a(1), b(2), c(3);
    a.next = &b;
    b.next = &c;
    int acc = 0;
    for (ListNode* p = &a; p != nullptr; p = p->next)
        acc = acc * 10 + p->val;
    std::cout << acc << '\\n';
}
`},{kind:"text",text:"A pointer uses `->` to reach a member (`p->val`); an object or reference uses `.`. `p->val` is shorthand for `(*p).val`. Dereferencing a null pointer is undefined behaviour and usually a crash, so every walk checks for `nullptr` first."},{kind:"pitfall",title:"Dot versus arrow",text:"`p.val` on a pointer does not compile: the compiler tells you the member was requested on a pointer type. Use `p->val`. The mirror mistake, `obj->val` on an object, is rejected too."},{kind:"interview",text:'Before you write any list loop, state the empty and single-node cases out loud. "head is null" and "head->next is null" are the two inputs that break most first attempts.'}]},{title:"Building, the dummy head, and new",blocks:[{kind:"text",text:"Nodes you return from a function must outlive it, so you create them on the heap with `new ListNode(x)`, which returns a `ListNode*`. Interview solutions conventionally do not `delete` them: the judge ends the process right after, and freeing correctly is rarely the point of the question. Mention it once if asked, and prefer `unique_ptr` in real code."},{kind:"code",run:!0,caption:"Append to the tail with a tail pointer: O(1) per node.",code:`#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int main() {
    ListNode* head = nullptr;
    ListNode* tail = nullptr;
    for (int x = 1; x <= 3; ++x) {
        ListNode* node = new ListNode(x);
        if (tail == nullptr) head = tail = node;
        else { tail->next = node; tail = node; }
    }
    for (ListNode* p = head; p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
`},{kind:"text",text:"The `if (tail == nullptr)` special case exists only because the list can start empty. A dummy head removes it: create a throwaway node `ListNode dummy(0); ListNode* tail = &dummy;`, always append with `tail->next = ...`, and return `dummy.next`. The same trick makes deleting the head node just another delete."},{kind:"code",run:!0,caption:"Same list, no special case.",code:`#include <iostream>

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int main() {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (int x = 1; x <= 3; ++x) {
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    for (ListNode* p = dummy.next; p; p = p->next) std::cout << p->val << ' ';
    std::cout << '\\n';
}
`},{kind:"idiom",title:"Dummy head by default",text:"Whenever the answer list might lose or gain its first node, start with a dummy head and return `dummy.next`."}]}]},{id:"s4-trees-solution",region:"R0",section:"S4",title:"TreeNode and class Solution",summary:"TreeNode with two child pointers, the null base case, and the class Solution wrapper with its public section.",cardIds:["s4-tree-height","s4-arrow-dot","s4-tree-null-base","s4-leaf-cloze","s4-solution-private"],problemIds:["tree-height","leaf-sum"],pages:[{title:"TreeNode and the null base case",blocks:[{kind:"text",text:"A binary tree node is a value plus two child pointers; a missing child is `nullptr`, and an empty tree is a null root. Almost every tree function is recursive with the same skeleton: handle the null pointer first, then combine the answers of the left and right subtrees."},{kind:"code",run:!0,caption:"Height of a three-node tree: null is height 0.",code:`#include <algorithm>
#include <iostream>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int height(const TreeNode* root) {
    if (root == nullptr) return 0;
    return 1 + std::max(height(root->left), height(root->right));
}

int main() {
    TreeNode root(1), l(2), r(3);
    root.left = &l;
    root.right = &r;
    std::cout << height(&root) << '\\n';
}
`},{kind:"pitfall",title:"Forgetting the null check",text:"Without `if (root == nullptr) return ...;` the recursion walks off a leaf into `root->left` on a null pointer: undefined behaviour, in practice a crash. Write the null case first, every time."},{kind:"idiom",title:"Leaf test",text:"A leaf has no children: `!root->left && !root->right`. Test it after the null check, and take care to say what an empty tree returns."},{kind:"interview",text:'State the recursion\'s contract in one sentence before coding: "height(node) returns the number of nodes on the longest downward path, 0 for null". Then the code writes itself, and the complexity is O(n) time and O(h) stack.'}]},{title:"class Solution",blocks:[{kind:"text",text:"LeetCode wraps your code in `class Solution { public: ... };` and calls a method on it. Remember the `public:` label, because members of a `class` are private by default, and the judge cannot call a private method. Helper functions can sit below it, either as extra methods or as private members."},{kind:"code",run:!0,caption:"A helper method inside Solution, called with a small tree.",code:`#include <iostream>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int countLeaves(TreeNode* root) {
        if (root == nullptr) return 0;
        if (!root->left && !root->right) return 1;
        return countLeaves(root->left) + countLeaves(root->right);
    }
};

int main() {
    TreeNode a(1), b(2), c(3), d(4);
    a.left = &b; a.right = &c; b.left = &d;
    Solution s;
    std::cout << s.countLeaves(&a) << '\\n';
}
`},{kind:"text",text:"The method does not use any member data here, so it could be `static`, but leaving it as a normal method matches the signature the judge expects. Keep per-call state in parameters or local variables: the same `Solution` object may be reused across tests, so a leftover member field from the last test would leak into the next."},{kind:"pitfall",title:"State that survives",text:"A member like `int best;` that you update during one call is still holding its old value on the next call. Reset it at the start of the method, or pass state down as an argument."},{kind:"interview",text:"Mention the signature you were given and keep it unchanged. Adding a helper is fine; changing the public method breaks the harness."}]}]}],d=r.default;e.s(["W",0,l,"C",0,d],14284)},59808,(e,t,n)=>{t.exports={"s1-first-program:0:1":"hello, mainville\n","s1-types:0:1":"char 1\nint 4\nlong long 8\ndouble 8\n","s1-types:1:1":"10000000000\n","s1-arithmetic:0:1":"3 1\n-3 -1\n-3 1\n","s1-arithmetic:1:1":"3 3.5 3.5\n","s2-branches-loops:0:1":"ABCF\n","s2-branches-loops:0:4":"weekend\n","s2-branches-loops:1:1":"1 3 5 \n","s2-functions:0:1":"1 11\n","s2-functions:1:2":"int double int \n","s2-recursion-static:0:1":"1594323\n","s2-recursion-static:1:1":"123 111\n","s3-vectors:0:1":"3 2 4\n","s3-vectors:0:4":"5 2x3\n","s3-vectors:1:1":"0 5 0 9\n","s3-vectors:1:4":"2 3 4 \n","s3-strings:0:1":"algo rithm or\n","s3-strings:0:3":"1 3 \n","s3-strings:1:1":"221\n","s3-strings:1:3":"1230 1231\n","s3-splitting:0:1":"3 []\n","s3-splitting:0:3":"2\n","s4-structs:0:2":"1\n","s4-structs:1:1":"abc\n","s4-lists:0:1":"123\n","s4-lists:1:1":"1 2 3 \n","s4-lists:1:3":"1 2 3 \n","s4-trees-solution:0:1":"2\n","s4-trees-solution:1:1":"2\n"}},94801,e=>{"use strict";e.s(["f",0,function(e){let t=e>>>0,n=()=>{let e=t=t+0x6d2b79f5>>>0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000},i=(e,t)=>e+Math.floor(n()*(t-e+1));return{next:n,int:i,pick:e=>e[i(0,e.length-1)],shuffle(e){let t=[...e];for(let e=t.length-1;e>0;--e){let n=i(0,e);[t[e],t[n]]=[t[n],t[e]]}return t},ints:(e,t,n)=>Array.from({length:e},()=>i(t,n))}}])}]);