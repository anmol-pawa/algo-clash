(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,7584,14284,e=>{"use strict";var t=e.i(43476),n=e.i(71645),i=e.i(93432);function s({text:e}){return(0,t.jsx)(t.Fragment,{children:e.split("`").map((e,t)=>({code:t%2==1,text:e})).filter(e=>""!==e.text).map((e,n)=>e.code?(0,t.jsx)("code",{className:"rounded bg-black/40 px-1 font-mono text-[0.9em] [font-variant-ligatures:none]",children:e.text},n):(0,t.jsx)("span",{children:e.text},n))})}let a={idiom:{label:"Idiom",cls:"border-emerald-400/60 bg-emerald-500/10"},pitfall:{label:"Pitfall",cls:"border-rose-400/60 bg-rose-500/10"},interview:{label:"Interview",cls:"border-sky-400/60 bg-sky-500/10"}};function o({block:e,output:n}){switch(e.kind){case"text":return(0,t.jsx)("p",{className:"text-sm leading-6",children:(0,t.jsx)(s,{text:e.text})});case"code":return(0,t.jsxs)("figure",{className:"flex flex-col gap-1",children:[(0,t.jsx)("pre",{className:"overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono text-[13px] leading-5 [font-variant-ligatures:none]","aria-label":"code",children:e.code.replace(/\n$/,"")}),e.run&&void 0!==n?(0,t.jsxs)("pre",{className:"overflow-x-auto rounded border border-emerald-400/30 bg-emerald-500/10 p-2 font-mono text-xs leading-5","aria-label":"program output","data-testid":"lesson-output",children:[(0,t.jsx)("span",{className:"mb-1 block font-display text-[10px] uppercase tracking-wider opacity-60",children:"Output"}),n.replace(/\n$/,"")]}):null,e.caption?(0,t.jsx)("figcaption",{className:"text-xs opacity-70",children:e.caption}):null]});default:{let n=a[e.kind];return(0,t.jsxs)("aside",{className:`rounded border p-3 text-sm leading-6 ${n.cls}`,children:[(0,t.jsxs)("strong",{className:"mr-1 font-display text-xs uppercase tracking-wider",children:[n.label,"title"in e?`: ${e.title}`:""]}),(0,t.jsx)(s,{text:e.text})]})}}}e.s(["f",0,function({lesson:e,cards:s,computed:a,outputs:r,onComplete:d}){let[l,c]=(0,n.useState)(0),h=e.pages.length,u=l>=h,p=s.filter(t=>e.cardIds.includes(t.id));if((0,n.useEffect)(()=>{u&&d?.()},[u,d]),u)return(0,t.jsxs)("div",{className:"mx-auto flex max-w-2xl flex-col gap-3","data-testid":"lesson-practice",children:[(0,t.jsx)(i.f,{cards:p,computed:a,size:Math.min(5,p.length),seed:11}),(0,t.jsxs)("div",{className:"panel p-3 text-sm",children:[(0,t.jsx)("h3",{className:"font-display text-xs uppercase tracking-wider text-[var(--gold)]",children:"Exercises that use this"}),(0,t.jsx)("ul",{className:"mt-1 flex flex-wrap gap-2",children:e.problemIds.map(e=>(0,t.jsx)("li",{className:"rounded border border-white/15 bg-black/30 px-2 py-1 font-mono text-xs",children:e},e))})]}),(0,t.jsx)("button",{className:"px-btn min-h-11 self-start px-4",onClick:()=>c(0),children:"Read the lesson again"})]});let m=e.pages[l];return(0,t.jsxs)("section",{className:"panel mx-auto flex max-w-2xl flex-col gap-3 p-4","aria-label":"Lesson",children:[(0,t.jsxs)("header",{className:"flex flex-col gap-1",children:[(0,t.jsxs)("span",{className:"font-display text-[10px] uppercase tracking-wider opacity-60",children:[e.section," · ",e.title]}),(0,t.jsx)("h2",{className:"font-display text-lg text-[var(--gold)]",children:m.title})]}),(0,t.jsx)("div",{className:"flex flex-col gap-3","data-testid":"lesson-page",children:m.blocks.map((n,i)=>{let s;return(0,t.jsx)(o,{block:n,output:r[s=e.id,`${s}:${l}:${i}`]},`${l}-${i}`)})}),(0,t.jsxs)("footer",{className:"flex items-center justify-between gap-2",children:[(0,t.jsx)("button",{className:"px-btn min-h-11 px-4",disabled:0===l,onClick:()=>c(l-1),children:"Back"}),(0,t.jsxs)("span",{className:"text-xs opacity-70","aria-live":"polite",children:["Page ",l+1," / ",h]}),(0,t.jsx)("button",{className:"px-btn px-btn-primary min-h-11 px-4",onClick:()=>c(l+1),children:l+1===h?"Practice":"Next"})]})]})}],7584);var r=e.i(59808);let d=[{id:"s1-first-program",region:"R0",section:"S1",title:"Your first program",summary:"main, includes, and the input/output habits that keep a solution fast.",cardIds:["s1-missing-include","s1-endl-vs-newline","s1-sync-stdio","s1-fast-io-cloze"],problemIds:["ledger-digits"],pages:[{title:"main and includes",blocks:[{kind:"text",text:"A C++ program starts at `main`. Everything else you use, from `cout` to `vector`, is declared in a header that you pull in with `#include`."},{kind:"code",run:!0,caption:"The smallest useful program.",code:`#include <iostream>

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
`},{kind:"text",text:"The method does not use any member data here, so it could be `static`, but leaving it as a normal method matches the signature the judge expects. Keep per-call state in parameters or local variables: the same `Solution` object may be reused across tests, so a leftover member field from the last test would leak into the next."},{kind:"pitfall",title:"State that survives",text:"A member like `int best;` that you update during one call is still holding its old value on the next call. Reset it at the start of the method, or pass state down as an argument."},{kind:"interview",text:"Mention the signature you were given and keep it unchanged. Adding a helper is fine; changing the public method breaks the harness."}]}]},{id:"r1-reading-cost",region:"R1",section:"R1",title:"Reading the cost of code",summary:"Count loops, drop constants, add sequential steps and multiply nested ones. Know what amortised means.",cardIds:["r1-drop-constants","r1-triangle-loop","r1-halving-loop","r1-sqrt-loop","r1-amortized-push","r1-sort-then-scan","r1-bsearch-in-loop","r1-recursion-space","r1-which-linear"],problemIds:[],pages:[{title:"Big-O in practice",blocks:[{kind:"text",text:"Big-O describes how the work grows with the input size `n`. You keep the fastest-growing term and drop constants: `3n² + 50n + 7` is `O(n²)`. `O` is an upper bound, `Ω` a lower bound and `Θ` means both, but interviewers say 'O' and mean the tight bound for the worst case unless you say otherwise."},{kind:"text",text:"Two rules read almost any code. **Sequential steps add** (a sort then a scan is `O(n log n) + O(n) = O(n log n)`). **Nested steps multiply** (`n` iterations each doing a binary search is `O(n log n)`). A loop whose variable is divided or multiplied by a constant each pass runs `O(log n)` times, and a loop that stops when `d * d > n` runs `O(√n)` times."},{kind:"code",run:!0,caption:"A dependent inner loop: count the work.",code:`#include <iostream>

int main() {
    int n = 10, count = 0;
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < i; ++j)
            ++count;
    std::cout << count << '\\n';   // n(n-1)/2
}
`},{kind:"pitfall",title:"Hidden linear work",text:"`v.insert(v.begin(), x)`, `s.substr(i)` in a loop, `s += s2` copies and `std::find` on a vector each cost `O(n)`. Put one inside an `O(n)` loop and the program is `O(n²)`. Check what each library call costs before you total the loop."},{kind:"interview",text:"State the time and the space complexity without being asked, and name the dominant step ('the sort dominates'). Interviewers score that habit under Communication."}]},{title:"Amortised cost and space",blocks:[{kind:"text",text:"Some operations are cheap almost always and expensive rarely. `vector::push_back` doubles the capacity when full: the copy costs `O(n)` once, but it happens after 1, 2, 4, 8, … pushes, so `n` pushes copy fewer than `2n` elements in total. The **amortised** cost per push is `O(1)`, while the worst single push is `O(n)`."},{kind:"text",text:"Space complexity counts what you allocate **beyond the input**, including the recursion stack. A recursive walk of a linked list with `n` nodes keeps `n` frames alive, so it uses `O(n)` space even though it allocates nothing; the loop version uses `O(1)`. Recursion depth also decides whether the stack can overflow."},{kind:"code",caption:"Same answer, different space.",code:`int lengthRec(const ListNode* p) {      // O(n) stack frames
    return p ? 1 + lengthRec(p->next) : 0;
}

int lengthLoop(const ListNode* p) {     // O(1) extra space
    int n = 0;
    for (; p; p = p->next) ++n;
    return n;
}
`},{kind:"idiom",title:"Say the assumption",text:"'Average O(1) for the hash map; worst case O(n) if everything collides.' Naming the assumption beats a bare O(1)."}]}]},{id:"r1-budgets-recurrences",region:"R1",section:"R1",title:"Constraints and recurrences",summary:"Turn the input limits into the complexity you can afford, and solve divide-and-conquer recurrences with the master theorem.",cardIds:["r1-budget-1","r1-budget-2","r1-budget-3","r1-budget-4","r1-budget-5","r1-budget-6","r1-recurrence-1","r1-recurrence-2","r1-recurrence-3","r1-recurrence-4","r1-recurrence-5","r1-recurrence-6"],problemIds:[],pages:[{title:"The constraint table",blocks:[{kind:"text",text:"A judge runs roughly `10⁸` simple operations per second natively (less in WebAssembly). Divide the time limit by that and you know the complexity the setter expects. Read the constraints **before** you think about the algorithm."},{kind:"text",text:"`n ≤ 10` allows `O(n!)`; `n ≤ 20` allows `O(2ⁿ)` (subsets, bitmasks); `n ≤ 500` allows `O(n³)`; `n ≤ 5 000` allows `O(n²)`; `n ≤ 10⁶` allows `O(n log n)`; `n ≤ 10⁸` allows `O(n)`; anything bigger needs `O(log n)` or `O(1)`. Several limits can appear in one problem, and the tightest one names the pattern."},{kind:"idiom",title:"Constraint-first reading",text:"Write the largest `n` on the board and the budget it implies before you propose anything. 'n is 2·10⁵, so I need O(n log n) or better, which rules out the pair loop.'"},{kind:"pitfall",title:"Overflow hides in the constraints",text:"If values reach `10⁹` and you add or multiply two of them, `int` overflows. A sum of `n = 10⁵` values of `10⁹` needs `long long`. Note the value range as well as `n`."},{kind:"interview",text:"Quoting the budget shows you can pick an algorithm from the limits instead of guessing. It is the quickest way to rule out brute force out loud."}]},{title:"Recurrences and the master theorem",blocks:[{kind:"text",text:"A divide-and-conquer algorithm splits into `a` subproblems of size `n/b` and spends `f(n)` combining them: `T(n) = a·T(n/b) + f(n)`. Compare the combine cost with the leaf cost `n^(log_b a)`."},{kind:"text",text:"If the combine step is **smaller** than the leaf cost, the leaves dominate and `T(n) = Θ(n^(log_b a))`. If they are **equal** (every level of the recursion tree does the same work), multiply by the number of levels: `Θ(f(n) · log n)`. If the combine step is **larger**, the root dominates and `T(n) = Θ(f(n))`."},{kind:"text",text:"Merge sort: `T(n) = 2T(n/2) + n`. Here `log₂ 2 = 1`, the combine cost `n` equals the leaf cost `n¹`, so every level costs `n` and there are `log n` levels: `Θ(n log n)`. Binary search: `T(n) = T(n/2) + 1` gives `Θ(log n)`. Karatsuba: `T(n) = 3T(n/2) + n` gives `Θ(n^1.585)` because the leaves dominate."},{kind:"pitfall",title:"Unbalanced splits",text:"The master theorem needs equal-sized subproblems. Quicksort with a bad pivot is `T(n) = T(n-1) + n = Θ(n²)`, which is why random or median-of-three pivots matter. For `T(n) = T(n-1) + …`, unroll the sum instead."},{kind:"interview",text:"Draw the recursion tree: levels, work per level, number of levels. It earns the same marks as quoting the theorem and works when the theorem does not apply."}]}]},{id:"r2-hash-lookup",region:"R2",section:"R2",title:"Hash lookup: have I seen it before?",summary:"Trade memory for time: store what you have seen in an unordered_map or unordered_set and answer pair, duplicate and grouping questions in one pass.",cardIds:["r2-hash-signal","r2-hash-cost","r2-map-bracket-insert","r2-count-loop","r2-pair-complement","r2-set-insert-result","r2-hash-pair-order","r2-find-vs-count","r2-hash-key-sorted","r2-hash-const-bracket","r2-hash-chain-start","r2-hash-iteration-order"],problemIds:["matching-pairs","echo-gate","scramble-check","badge-chain","scramble-clans"],pages:[{title:"The lookup habit",blocks:[{kind:"text",text:"The brute force for 'is there a pair that sums to `t`?' tries every pair: `O(n²)`. The hash version asks a different question at each element: has the partner I need already appeared? A lookup in `unordered_map` or `unordered_set` is `O(1)` on average, so one pass gives `O(n)` time and `O(n)` extra space."},{kind:"text",text:"Order matters: look the partner up before you insert the current element. That is what stops an element from pairing with itself, and it still finds every pair because the earlier element of the pair is already stored when the later one arrives."},{kind:"code",run:!0,caption:"Count pairs that add to a target, one pass.",code:`#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {3, 1, 4, 1, 5, 9, 2, 6};
    int target = 7;
    std::unordered_map<int, int> seen;   // value -> how many times so far
    long long pairs = 0;
    for (int x : a) {
        auto it = seen.find(target - x);  // look up first
        if (it != seen.end()) pairs += it->second;
        ++seen[x];                         // then insert
    }
    std::cout << pairs << '\\n';
}
`},{kind:"pitfall",title:"operator[] inserts",text:"`seen[k]` on a missing key creates it with value `0`. Reading with `[]` while you are also testing membership silently grows the map and can change a later `size()` or iteration. Use `find`, `count` or `contains` (C++20) to ask without inserting."},{kind:"interview",text:"Say the trade out loud: 'I spend O(n) memory to turn an O(n) inner scan into an O(1) lookup, so the pair search drops from O(n²) to O(n).' Then state the average-versus-worst-case caveat for hashing."}]},{title:"Keys, grouping and chain starts",blocks:[{kind:"text",text:"Hashing is not only 'seen it'. Frequency maps answer 'how many'. Canonical keys answer 'same group': two words are anagrams exactly when their sorted letters match, so the sorted word is the map key and the value is the list of words. When the alphabet is small and fixed, a 26-slot count array is both the fastest map and the key."},{kind:"text",text:"A hash set can also replace sorting. To find the longest run of consecutive integers, put every value in a set, then only start counting from values whose predecessor `x - 1` is not in the set. Each run is walked once, so the total work is `O(n)` even though there is a loop inside the loop."},{kind:"code",run:!0,caption:"Longest run of consecutive values; only chain starts walk.",code:`#include <algorithm>
#include <iostream>
#include <unordered_set>
#include <vector>

int main() {
    std::vector<int> a = {100, 4, 200, 1, 3, 2, 101, 102};
    std::unordered_set<int> s(a.begin(), a.end());
    int best = 0;
    for (int x : s) {
        if (s.count(x - 1)) continue;      // not the start of a run
        int len = 1;
        while (s.count(x + len)) ++len;
        best = std::max(best, len);
    }
    std::cout << best << '\\n';
}
`},{kind:"idiom",title:"C++ Corner: the unordered_map API",text:"`m[k]` read-or-insert, `m.find(k)` returns an iterator (`it->second`), `m.count(k)` is 0 or 1, `m.emplace(k, v)` and `m.insert({k, v})` do not overwrite an existing key, `m.erase(k)` removes it. Iterate with `for (const auto& [key, value] : m)`. The iteration order is unspecified: never print a map's order and call it an answer."},{kind:"pitfall",title:"No hash for pair or vector",text:"`unordered_map<pair<int,int>, int>` does not compile because the standard provides no hash for `pair`. Encode the pair into one `long long` (`(long long)a * M + b`), build a string key, or use `map` (`O(log n)` but always legal). Hashwood Harbor goes deeper on custom hashes."},{kind:"interview",text:"Name the signal before the code: 'seen before', 'pair summing to', 'group by', 'count frequency'. Then mention the worst case: adversarial keys can degrade a hash table to O(n) per operation."}]}]},{id:"r2-two-pointers",region:"R2",section:"R2",title:"Two pointers: let order do the work",summary:"On sorted input or in-place rewriting, two indices that only move forward replace a nested loop with a single pass.",cardIds:["r2-tp-signal","r2-tp-why-move","r2-tp-sorted-pair","r2-tp-compact","r2-tp-compact-order","r2-tp-dedupe-3sum","r2-tp-water-move","r2-tp-trap-cost","r2-tp-dutch","r2-tp-boats","r2-tp-palindrome-skip","r2-tp-sort-cost"],problemIds:["mirror-check","triple-tally","widest-basin","ferry-pairs","tide-pools"],pages:[{title:"Opposite ends",blocks:[{kind:"text",text:"When the array is sorted and you want a pair with a target sum, put `l` at the left end and `r` at the right end. If `a[l] + a[r]` is too small, the only way to grow it is to move `l` right; if too large, move `r` left. Every step discards one element that can no longer be part of an answer, so the scan is `O(n)` after the sort."},{kind:"code",run:!0,caption:"Sorted pair sum with no extra memory.",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {1, 3, 4, 6, 8, 11};
    int target = 14;
    int l = 0, r = static_cast<int>(a.size()) - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == target) { std::cout << l << ' ' << r << '\\n'; return 0; }
        if (s < target) ++l; else --r;
    }
    std::cout << "none\\n";
}
`},{kind:"text",text:"The same shape solves *three sum*: sort, fix the first value, run the pair scan on the rest, and skip equal neighbours after each hit so a repeated value does not report the same trio twice. Container-with-most-water uses it too: the area is limited by the shorter wall, so only moving the shorter pointer can ever help. Trapping rain water keeps the running maximum from each side and always advances the side with the smaller maximum."},{kind:"pitfall",title:"Two pointers needs a reason to move",text:"Before you write the loop, be able to say why discarding one end is safe. If you cannot, the pattern does not apply (unsorted input with negatives usually wants a hash map or prefix sums instead)."},{kind:"interview",text:"Argue correctness in one sentence: 'if the sum is too small, a[l] paired with anything left of r is even smaller, so a[l] can never be in an answer, and I can drop it.'"}]},{title:"Same direction: read and write pointers",blocks:[{kind:"text",text:"For in-place filtering, a read pointer scans every element and a write pointer marks where the next kept element goes. Keep it when it passes the test, copy it to `write`, advance `write`. At the end `write` is the new length. Order is preserved and no extra array is used."},{kind:"code",run:!0,caption:"Move zeros to the back, keeping the order of the rest.",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {0, 4, 0, 5, 7, 0, 2};
    int write = 0;
    for (int read = 0; read < static_cast<int>(a.size()); ++read)
        if (a[read] != 0) a[write++] = a[read];
    while (write < static_cast<int>(a.size())) a[write++] = 0;
    for (int x : a) std::cout << x << ' ';
    std::cout << '\\n';
}
`},{kind:"text",text:"Three pointers give the Dutch national flag: `lo` marks the end of the zeros, `hi` the start of the twos, `i` scans. Swap a `0` to `lo` and advance both; swap a `2` to `hi` and move only `hi` (the swapped-in value is unchecked); step past a `1`. It sorts three values in one pass and `O(1)` space."},{kind:"idiom",title:"Greedy pairing on sorted weights",text:"To fit the most boats with a weight limit and at most two people each, sort, then try to pair the heaviest remaining with the lightest. If they do not fit together, the heaviest travels alone. This is two pointers plus an exchange argument."},{kind:"interview",text:"Mention the cost of getting the order: 'sorting is O(n log n), so the whole solution is O(n log n) even though the scan is O(n).' Forgetting this is a common slip."}]}]},{id:"r2-prefix-kadane",region:"R2",section:"R2",title:"Prefix sums, difference arrays and Kadane",summary:"Precompute running totals so any range sum is a subtraction, turn range updates into two point updates, and find the best subarray in one pass.",cardIds:["r2-ps-signal","r2-ps-build","r2-ps-range","r2-ps-subk-seed","r2-ps-subk-trace","r2-ps-negatives","r2-diff-array","r2-diff-order","r2-kadane-restart","r2-kadane-negative","r2-circular","r2-ps-overflow"],problemIds:["range-ledger","hot-streak","exact-stretches","sprinkler-lanes","ring-gain"],pages:[{title:"Prefix sums",blocks:[{kind:"text",text:"Let `pre[i]` be the sum of the first `i` elements, with `pre[0] = 0`. Then the sum of `a[l..r]` (inclusive) is `pre[r + 1] - pre[l]`. Building the table costs `O(n)` once; each of `q` queries is `O(1)`, so `q` queries cost `O(n + q)` instead of `O(n·q)`."},{kind:"text",text:"For 'count subarrays whose sum is `k`' with negative values allowed, a sliding window breaks because extending the window no longer makes the sum monotone. Use prefix sums instead: a subarray ending here sums to `k` exactly when some earlier prefix equals `current - k`. Keep a map of prefix → count and seed it with `{0: 1}` so subarrays that start at index 0 are counted."},{kind:"code",run:!0,caption:"Count subarrays with sum k, negatives allowed.",code:`#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {1, -1, 0, 3, -3, 3};
    int k = 0;
    std::unordered_map<long long, int> count{{0, 1}};   // the empty prefix
    long long pre = 0, answer = 0;
    for (int x : a) {
        pre += x;
        auto it = count.find(pre - k);
        if (it != count.end()) answer += it->second;
        ++count[pre];
    }
    std::cout << answer << '\\n';
}
`},{kind:"pitfall",title:"Overflow and the missing seed",text:"Sums of `10⁵` values up to `10⁹` need `long long`. Forgetting the `{0, 1}` seed loses every subarray that starts at the front: the bug passes small hand tests and fails the hidden ones."},{kind:"interview",text:"Tell the interviewer why not a window: 'negatives mean the sum is not monotone, so I use prefix sums with a hash map'. It signals you understand when each pattern is valid."}]},{title:"Difference arrays and Kadane",blocks:[{kind:"text",text:"A difference array is the prefix sum in reverse. To add `v` to every cell in `[l, r]`, do `d[l] += v` and `d[r + 1] -= v`, which is `O(1)` per update. After all updates, a running sum over `d` rebuilds the final array in `O(n)`. Many range updates followed by one read is its signal (sprinklers, bookings, car pooling)."},{kind:"code",run:!0,caption:"Three range additions, one rebuild.",code:`#include <iostream>
#include <vector>

int main() {
    int n = 6;
    std::vector<long long> d(n + 1, 0);
    auto add = [&](int l, int r, int v) { d[l] += v; d[r + 1] -= v; };
    add(1, 3, 5);
    add(2, 5, 2);
    add(0, 0, 1);
    long long run = 0;
    for (int i = 0; i < n; ++i) { run += d[i]; std::cout << run << ' '; }
    std::cout << '\\n';
}
`},{kind:"text",text:"Kadane's algorithm finds the best non-empty subarray sum in one pass. At each element decide: extend the run that ends at the previous element, or restart here. `cur = max(x, cur + x)`, `best = max(best, cur)`. Start from the first element (not `0`), or an all-negative array returns a wrong `0`."},{kind:"code",run:!0,caption:"Kadane with the correct start.",code:`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {-4, -2, -7, -3};
    int cur = a[0], best = a[0];
    for (std::size_t i = 1; i < a.size(); ++i) {
        cur = std::max(a[i], cur + a[i]);   // extend or restart
        best = std::max(best, cur);
    }
    std::cout << best << '\\n';
}
`},{kind:"idiom",title:"Circular arrays",text:"The best circular subarray is either an ordinary one or the total minus the worst ordinary one (the wrapped part is everything outside a minimum stretch). Take the larger. If every value is negative the 'total minus min' case would be empty, so return the plain Kadane answer."},{kind:"interview",text:"Name the invariant: 'cur is the best sum of a subarray ending at i'. Interviewers listen for a stated invariant, then ask about the all-negative case."}]}]},{id:"r3-sliding-window",region:"R3",section:"R3",title:"Sliding window: grow, shrink, never look back",summary:"A contiguous stretch with a rule becomes one pass: a right edge that only grows, a left edge that only follows, and a running summary of what is inside.",cardIds:["r3-win-signal","r3-win-fixed-cost","r3-win-fixed-sums","r3-win-monotone","r3-win-cost","r3-win-longest-trace","r3-win-update-spot","r3-win-shortest-parsons","r3-win-negatives","r3-win-counts","r3-win-exactly-k","r3-win-atmost-count","r3-win-count-add","r3-win-long-long","r3-win-lambda-capture","r3-win-fixed-cloze","r3-win-shrink-cloze","r3-win-multi-signal","r3-win-anagram"],problemIds:["peak-stretch","calm-window","tidy-tape","tight-patch","flip-budget","shuffle-spotter","odd-picks","cover-strip","distinct-picks"],pages:[{title:"Fixed window: slide, don't recompute",blocks:[{kind:"text",text:"When the question is about every stretch of exactly `k` neighbours (the best sum, the number of distinct letters, whether it is a rearrangement of a pattern), recomputing each stretch costs `O(n·k)`. Slide instead: when the window moves one step right, one element enters and one leaves, so update the summary by those two changes in `O(1)`."},{kind:"code",run:!0,caption:"Largest sum of k consecutive values; one element in, one out.",code:`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {2, 1, 5, 1, 3, 2, 8, 1};
    const int k = 3;
    long long window = 0;
    for (int i = 0; i < k; ++i) window += a[i];   // first window
    long long best = window;
    for (int i = k; i < static_cast<int>(a.size()); ++i) {
        window += a[i] - a[i - k];                 // enter a[i], leave a[i-k]
        best = std::max(best, window);
    }
    std::cout << best << '\\n';
}
`},{kind:"idiom",title:"Index of the leaver",text:"The element that leaves when the window ends at `i` is `a[i - k]`. Write that expression once and check it on the first step: the window `[0, k-1]` becomes `[1, k]`, so `a[0]` leaves when `i = k`."},{kind:"pitfall",title:"Short input",text:"If `k > n` there is no window at all. Decide the answer (often 0 or 'none') before the first loop, or the initial `for (i < k)` reads past the end."},{kind:"interview",text:"Name the signal: 'fixed size, contiguous, every window'. Then say the update rule in one sentence: 'add the entering element, remove the leaving one'. That sentence is most of the solution."}]},{title:"Variable window: expand right, shrink left",blocks:[{kind:"text",text:"When the window length is part of the answer ('longest ... such that', 'shortest ... with at least'), keep two indices `l` and `r`. Move `r` right one step at a time to add an element. If the rule is now broken, move `l` right until it holds again. Neither index ever moves backwards, so each element enters once and leaves once: `O(n)` total even though a `while` sits inside a `for`."},{kind:"text",text:"This only works when the rule is monotone: if a window is valid, every smaller window inside it is valid too (or the mirror image for a 'sum at least' rule). Then the shrink loop has a clear stopping point and nothing to the left of `l` is worth revisiting."},{kind:"code",run:!0,caption:"Longest stretch with no repeated letter.",code:`#include <algorithm>
#include <iostream>
#include <string>

int main() {
    std::string s = "abcabcbb";
    int cnt[128] = {};            // letters currently inside the window
    int best = 0, l = 0;
    for (int r = 0; r < static_cast<int>(s.size()); ++r) {
        ++cnt[static_cast<unsigned char>(s[r])];                 // expand
        while (cnt[static_cast<unsigned char>(s[r])] > 1) {      // rule broken: shrink
            --cnt[static_cast<unsigned char>(s[l])];
            ++l;
        }
        best = std::max(best, r - l + 1);                        // window is valid here
    }
    std::cout << best << '\\n';
}
`},{kind:"code",run:!0,caption:"Shortest stretch whose sum reaches a target (all values positive).",code:`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {2, 3, 1, 2, 4, 3};
    const long long target = 7;
    long long sum = 0;
    int best = static_cast<int>(a.size()) + 1, l = 0;
    for (int r = 0; r < static_cast<int>(a.size()); ++r) {
        sum += a[r];
        while (sum >= target) {                  // valid: try to make it shorter
            best = std::min(best, r - l + 1);    // record INSIDE the loop
            sum -= a[l++];
        }
    }
    std::cout << (best > static_cast<int>(a.size()) ? 0 : best) << '\\n';
}
`},{kind:"idiom",title:"Where the answer is recorded",text:"For a 'longest valid' window, record after the shrink loop, when the window is valid. For a 'shortest valid' window, record inside the shrink loop, while it is still valid and you are trying to make it smaller."},{kind:"pitfall",title:"Negative numbers break the window",text:"With negatives in a 'sum at least' rule, adding an element can lower the sum and removing one can raise it, so the rule is no longer monotone and shrinking from the left can skip the true answer. That is the case for prefix sums plus a deque (next lesson)."},{kind:"interview",text:"Before coding, state why the window is legal: 'the rule only gets harder as the window grows, so once it breaks, only moving the left edge can repair it'. Interviewers listen for that argument, not just the loop."}]},{title:"At most K, exactly K, and counting windows",blocks:[{kind:"text",text:"Counting windows is a variable window with one change: for each right edge `r`, every start from `l` to `r` gives a valid stretch ending at `r`, so add `r - l + 1`. That is 'count of subarrays with at most K ...'. The 'exactly K' version is not monotone, but it is a difference of two monotone ones: `exactly(K) = atMost(K) - atMost(K - 1)`."},{kind:"code",run:!0,caption:"Count subarrays containing at most k odd numbers.",code:`#include <iostream>
#include <vector>

long long atMostOdd(const std::vector<int>& a, int k) {
    if (k < 0) return 0;
    long long total = 0;
    int odd = 0, l = 0;
    for (int r = 0; r < static_cast<int>(a.size()); ++r) {
        odd += a[r] % 2;
        while (odd > k) odd -= a[l++] % 2;
        total += r - l + 1;                 // starts l..r all end at r
    }
    return total;
}

int main() {
    std::vector<int> a = {1, 1, 2, 1, 1};
    int k = 3;
    std::cout << atMostOdd(a, k) - atMostOdd(a, k - 1) << '\\n';
}
`},{kind:"pitfall",title:"Counts overflow int",text:"A window count can reach about `n²/2`. With `n = 10^5` that is `5·10^9`, past the range of `int`. Make the total `long long` even when every input fits in `int`."},{kind:"idiom",title:"Counting table for small alphabets",text:"For lowercase letters use `int cnt[26]` or `std::array<int, 26>`: faster than `unordered_map` and comparable with `==` for fixed-window anagram checks. Keep a separate `distinct` or `missing` counter when the rule needs 'how many kinds are inside' so you never rescan the table."},{kind:"interview",text:"Say 'at most is monotone, exactly is not, so I subtract two at-most passes' and show the small example. It signals you know why the trick works, not just that it does."}]}]},{id:"r3-monotonic-deque",region:"R3",section:"R3",title:"Monotonic deque: the window's champion",summary:"Keep candidates in a deque that stays sorted, so the best value in the window is always at the front and each index is pushed and popped once.",cardIds:["r3-dq-signal","r3-dq-why-pop","r3-dq-indices","r3-dq-cost","r3-dq-window-max","r3-dq-front-trace","r3-dq-equal","r3-dq-slide-parsons","r3-dq-expire","r3-dq-api","r3-dq-empty","r3-dq-min-cloze","r3-dq-prefix-why","r3-dq-prefix-rules","r3-dq-prefix-shortest","r3-dq-prefix-ll","r3-dq-no-push","r3-dq-vs-heap"],problemIds:["pane-peaks","quota-run"],pages:[{title:"Window maximum in O(n)",blocks:[{kind:"text",text:"A window of size `k` slides over the array and you need the maximum of every window. Scanning each is `O(n·k)`; a heap with lazy deletion is `O(n log n)`. A deque does it in `O(n)`. Keep indices in the deque in decreasing order of value. Before pushing index `i`, pop from the back every index whose value is `<= a[i]`: those elements are older and no bigger, so they can never be the maximum of any later window. The front is always the champion; drop it when it falls out of the window."},{kind:"code",run:!0,caption:"Maximum of every window of size k.",code:`#include <deque>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {1, 3, -1, -3, 5, 3, 6, 7};
    const int k = 3;
    std::deque<int> dq;                          // indices, values decreasing
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
        dq.push_back(i);
        if (dq.front() <= i - k) dq.pop_front(); // champion left the window
        if (i >= k - 1) std::cout << a[dq.front()] << ' ';
    }
    std::cout << '\\n';
}
`},{kind:"idiom",title:"Store indices, not values",text:"You need the index to know when the front has expired (`dq.front() <= i - k`) and you can always get the value back with `a[idx]`. Storing values loses the expiry information."},{kind:"pitfall",title:"Empty deque",text:"`front()` and `back()` on an empty `std::deque` are undefined behaviour. The `while` guard checks `!dq.empty()` first; after popping the expired front the deque still contains `i`, so reading the front for the answer is safe."},{kind:"interview",text:"Give the amortised argument: 'every index is pushed once and popped at most once, so the inner while loop costs O(n) in total'. That sentence is what separates a deque solution from a quadratic one."}]},{title:"Negatives: prefix sums plus a deque",blocks:[{kind:"text",text:"Shortest subarray with sum at least `K`, with negatives allowed, cannot use a plain window. Use prefix sums `P[0..n]` where `P[j] - P[i]` is the sum of `a[i..j-1]`. For each `j` you want the largest `i < j` with `P[i] <= P[j] - K`. Keep candidate starts in a deque with increasing prefix values."},{kind:"text",text:"Two pops keep it correct. Pop the front while `P[j] - P[front] >= K`: that start has answered for `j`, and any later `j` would only make the stretch longer, so it is finished. Pop the back while `P[back] >= P[j]`: a later start with a smaller or equal prefix is better for every future end. Then push `j`."},{kind:"code",run:!0,caption:"Shortest subarray with sum >= K, negatives allowed.",code:`#include <algorithm>
#include <deque>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {2, -1, 2};
    const long long K = 3;
    const int n = static_cast<int>(a.size());
    std::vector<long long> P(n + 1, 0);
    for (int i = 0; i < n; ++i) P[i + 1] = P[i] + a[i];
    int best = n + 1;
    std::deque<int> dq;                                  // starts, P increasing
    for (int j = 0; j <= n; ++j) {
        while (!dq.empty() && P[j] - P[dq.front()] >= K) {
            best = std::min(best, j - dq.front());
            dq.pop_front();
        }
        while (!dq.empty() && P[dq.back()] >= P[j]) dq.pop_back();
        dq.push_back(j);
    }
    std::cout << (best > n ? -1 : best) << '\\n';
}
`},{kind:"pitfall",title:"Prefix sums need long long",text:"Even when every value fits in `int`, a prefix sum of 10^5 values of 10^5 is 10^10. Store `P` as `long long`, and make `K` `long long` too so the comparison does not overflow."},{kind:"interview",text:"Explain why the plain window fails (not monotone with negatives) and why each pop is safe. Then give `O(n)` time and `O(n)` space and mention that prefix sums turn a range question into a two-index difference."}]}]},{id:"r4-hash-internals",region:"R4",section:"R4",title:"Inside the hash table: buckets, load and rehash",summary:"A hash map is an array of buckets plus a function that picks one. Knowing where it stays fast and where it quietly degrades is what lets you trust it in a loop.",cardIds:["r4-hash-signal","r4-hash-avg","r4-hash-chain-trace","r4-hash-load","r4-hash-rehash","r4-hash-openaddr","r4-hash-subscript","r4-hash-order","r4-hash-pair-error","r4-hash-anti","r4-hash-set-cloze","r4-hash-freq-parsons"],problemIds:["locker-board","drum-bag"],pages:[{title:"Buckets and chains",blocks:[{kind:"text",text:"A hash table keeps an array of buckets. To store a key, compute `hash(key) % bucketCount` and put the entry in that bucket. Two keys can land in the same bucket (a collision), so each bucket holds a small chain. A lookup hashes once, jumps to one bucket and walks its chain. If chains stay short, that is `O(1)` on average."},{kind:"code",run:!0,caption:"A toy chained table with 4 buckets: key % 4 picks the bucket.",code:`#include <iostream>
#include <list>
#include <vector>

int main() {
    std::vector<std::list<int>> bucket(4);
    for (int key : {3, 7, 11, 2, 6}) bucket[key % 4].push_back(key);
    for (int b = 0; b < 4; ++b) {
        std::cout << b << ':';
        for (int key : bucket[b]) std::cout << ' ' << key;
        std::cout << '\\n';
    }
}
`},{kind:"text",text:"Bucket 3 holds three keys, so finding `11` walks three nodes. A good hash function spreads keys evenly; a bad one (or hostile input) piles them into one chain and a lookup becomes `O(n)`."},{kind:"idiom",title:"Say 'average' and 'worst'",text:"Hash map insert, find and erase are `O(1)` on average and `O(n)` in the worst case. In an interview say both, and say what the average rests on: a spread-out hash and a bounded load factor."},{kind:"interview",text:"When you reach for a map, name the job: 'I need to ask have-I-seen-this or what-is-its-count in constant time'. That is the signal that a hash map or set replaces a nested loop."}]},{title:"Load factor, rehash and open addressing",blocks:[{kind:"text",text:"The load factor is `size / bucketCount`. When it passes a limit (`std::unordered_map` defaults to 1.0), the table allocates a bigger bucket array and re-inserts every entry: a rehash. One rehash costs `O(n)`, but growing by a constant factor makes the total over many inserts `O(n)`, so each insert is amortized `O(1)`."},{kind:"code",run:!0,caption:"Doubling the buckets whenever size passes the bucket count: count the moves.",code:`#include <cstddef>
#include <iostream>

int main() {
    std::size_t buckets = 8, size = 0;
    long long moved = 0;
    int rehashes = 0;
    for (int i = 0; i < 1000; ++i) {
        ++size;
        if (size > buckets) {          // load factor passed 1.0
            moved += static_cast<long long>(size - 1);
            buckets *= 2;
            ++rehashes;
        }
    }
    std::cout << rehashes << " rehashes moved " << moved << " entries for 1000 inserts\\n";
}
`},{kind:"text",text:"The moved entries add up to less than twice the inserts: 8 + 16 + 32 + ... is a geometric series. Expensive single steps, cheap on average."},{kind:"text",text:"Open addressing is the other design. There are no chains: every entry lives in the array itself, and on a collision you probe the next slot (linear probing) until you find a free one. It is cache friendly, but it needs a lower load factor, and erasing leaves a tombstone so later probes do not stop early. `std::unordered_map` uses chaining; many hand-written tables (and the Locker Board exercise) are free to choose."},{kind:"pitfall",title:"A rehash invalidates iterators",text:"After an insert that triggers a rehash, iterators into the table are invalid (references to elements stay valid for `std::unordered_map`). Do not hold an iterator across inserts. If you know the size, call `reserve(n)` first to avoid rehashes."}]},{title:"Using unordered_map and unordered_set well",blocks:[{kind:"code",run:!0,caption:"operator[] inserts a default value; count and find do not.",code:`#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<int, int> m;
    if (m[5] == 0) std::cout << "zero ";
    std::cout << m.size() << ' ' << m.count(9) << ' ' << m.size() << '\\n';
}
`},{kind:"text",text:"Reading `m[5]` created the entry `5 -> 0`. Use `count` or `find` to test for presence, and `m[key]` when you want 'insert if missing, then use'. That is exactly what you want for `++freq[x]`."},{kind:"text",text:"Keys must be hashable. `int`, `long long`, `char`, `std::string` work out of the box; `std::pair` and `std::vector` do not. Supply a hash functor as the third template argument. Mix the bits well: the finaliser below (splitmix64) also protects against inputs built to collide."},{kind:"code",run:!0,caption:"A pair key with a custom hash.",code:`#include <cstddef>
#include <cstdint>
#include <iostream>
#include <unordered_map>
#include <utility>

struct PairHash {
    std::size_t operator()(const std::pair<int, int>& p) const {
        std::uint64_t x = (static_cast<std::uint64_t>(static_cast<std::uint32_t>(p.first)) << 32)
                        | static_cast<std::uint32_t>(p.second);
        x += 0x9e3779b97f4a7c15ULL;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
        return static_cast<std::size_t>(x ^ (x >> 31));
    }
};

int main() {
    std::unordered_map<std::pair<int, int>, int, PairHash> seen;
    seen[{1, 2}] = 5;
    seen[{2, 1}] += 7;
    std::cout << seen.size() << ' ' << seen[{1, 2}] << ' ' << seen[{2, 1}] << '\\n';
}
`},{kind:"pitfall",title:"Iteration order is unspecified",text:"Never print or return the contents of an `unordered_map` in iteration order and expect the same order on another machine or compiler. Copy to a vector and sort, or use `std::map` when order is part of the answer."},{kind:"interview",text:"If asked why not an identity hash for `int`: an adversary can send keys that are all multiples of the bucket count and force one long chain. Mention a randomised or mixed hash and that you would not worry on a trusted judge. It shows you know the cost model, not just the API."}]}]},{id:"r4-key-design",region:"R4",section:"R4",title:"Designing keys: what should equal what?",summary:"Most hash-map problems are won or lost in the key. Choose a key so that two things are equal exactly when the problem says they are the same.",cardIds:["r4-key-def","r4-key-anagram","r4-key-delim","r4-key-delim-trace","r4-key-cell-cloze","r4-key-bijection","r4-key-bijection-trace","r4-key-prefix-predict","r4-key-prefix-parsons","r4-key-multi","r4-key-ordered","r4-key-const-error"],problemIds:["twin-scripts","verse-match","brick-gap","crate-variety"],pages:[{title:"Canonical forms: sorted and counted signatures",blocks:[{kind:"text",text:"Ask: what do two items have in common when the problem calls them 'the same'? Build a key from only that. Words that are rearrangements of each other share their sorted letters, so the sorted word is a canonical key. For long words with a small alphabet, a count array is faster than sorting."},{kind:"code",run:!0,caption:"A sorted signature: rearrangements collapse to one key.",code:`#include <algorithm>
#include <iostream>
#include <string>

std::string signature(std::string w) {   // by value: we sort our own copy
    std::sort(w.begin(), w.end());
    return w;
}

int main() {
    std::string a = signature("listen"), b = signature("silent"), c = signature("enlist!");
    std::cout << a << ' ' << (a == b) << ' ' << (a == c) << '\\n';
}
`},{kind:"text",text:"When the signature is a list of numbers, turn it into a string with a **separator**. Plain concatenation merges different lists into the same text."},{kind:"code",run:!0,caption:"Without a separator, {1, 11} and {11, 1} become the same key.",code:`#include <iostream>
#include <string>
#include <vector>

std::string bad(const std::vector<int>& v) {
    std::string s;
    for (int x : v) s += std::to_string(x);
    return s;
}

std::string good(const std::vector<int>& v) {
    std::string s;
    for (int x : v) s += std::to_string(x) + '#';   // '#' ends every number
    return s;
}

int main() {
    std::cout << (bad({1, 11}) == bad({11, 1})) << ' ' << (good({1, 11}) == good({11, 1})) << '\\n';
}
`},{kind:"pitfall",title:"Ambiguous encodings",text:"A key encoding must be injective: different inputs, different keys. Fixed width, a separator that cannot appear in the data, or a length prefix all work. 'Just glue them together' does not."},{kind:"interview",text:"State the key out loud and justify it: 'two words are anagrams exactly when their sorted forms match, so the sorted word is my key'. Then give the cost of building it, `O(L log L)` for length `L`, or `O(L + 26)` with counts."}]},{title:"Pairs, cells and bijections",blocks:[{kind:"text",text:"A grid cell `(r, c)` becomes one integer `r * cols + c`. It is reversible: `r = id / cols`, `c = id % cols`. The multiplier must be the number of columns (the range of `c`); any smaller value makes different cells collide. A `long long` key lets you pack two 32-bit values. Fixed-width packing is faster than a `std::pair` with a custom hash."},{kind:"text",text:"Pattern matching problems ask for a **bijection**: each symbol maps to one symbol, and no two symbols share a target. One map checks the first half only (`ab` to `aa` passes it). Keep a second map in the other direction, or store the index of the last occurrence per symbol."},{kind:"code",run:!0,caption:"Two maps give a two-way check.",code:`#include <iostream>
#include <string>
#include <unordered_map>

bool isomorphic(const std::string& s, const std::string& t) {
    if (s.size() != t.size()) return false;
    std::unordered_map<char, char> fwd, back;
    for (std::size_t i = 0; i < s.size(); ++i) {
        auto f = fwd.find(s[i]);
        auto b = back.find(t[i]);
        if (f == fwd.end() && b == back.end()) {      // both new: pair them up
            fwd[s[i]] = t[i];
            back[t[i]] = s[i];
        } else if (f == fwd.end() || b == back.end() || f->second != t[i]) {
            return false;                              // one side seen, the other not, or a mismatch
        }
    }
    return true;
}

int main() {
    std::cout << isomorphic("paper", "title") << isomorphic("badc", "baba") << isomorphic("ab", "aa") << '\\n';
}
`},{kind:"idiom",title:"Find, don't subscript, when absence matters",text:"`fwd.find(x)` tells you 'never seen' without inserting. `fwd[x]` would create an entry and make the next check lie."},{kind:"interview",text:"Word-pattern and isomorphic-string questions are the same bijection in different clothes. Say 'I need the mapping to be one-to-one in both directions' and you have shown the key insight."}]},{title:"State in a map: prefix sums and counts",blocks:[{kind:"text",text:"A hash map can also hold running state for another pattern. For 'how many subarrays sum to `k`', let `sum` be the prefix total after each element. A subarray ending here sums to `k` when an earlier prefix equals `sum - k`. So keep a map from prefix value to how often it occurred, and add that count. This works with negatives, where a sliding window does not."},{kind:"code",run:!0,caption:"Count subarrays with sum k: prefix value to number of times seen.",code:`#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {3, 4, -7, 1, 3, 3};
    const int k = 7;
    std::unordered_map<int, int> seen;
    seen[0] = 1;                       // the empty prefix
    int sum = 0;
    long long ways = 0;
    for (int x : a) {
        sum += x;
        auto it = seen.find(sum - k);
        if (it != seen.end()) ways += it->second;
        ++seen[sum];                   // record AFTER counting
    }
    std::cout << ways << '\\n';
}
`},{kind:"pitfall",title:"Seed the empty prefix",text:"Without `seen[0] = 1`, subarrays that start at index 0 are never counted. And record the current prefix after you look up `sum - k`, or `k = 0` counts an empty subarray."},{kind:"pitfall",title:"const maps and subscript",text:"`operator[]` may insert, so it does not compile on a `const` map. Use `find` or `at` in functions that take `const std::unordered_map<...>&`."},{kind:"idiom",title:"Pick the container by the question",text:"Need only equal/not equal and fast average time: `unordered_map`. Need keys in order, `lower_bound`, or a worst-case bound: `std::map` at `O(log n)`. Brick Wall is the first kind: count how many rows share each edge position."}]}]},{id:"r4-rolling-hash",region:"R4",section:"R4",title:"Rolling hash: fingerprints that slide",summary:"Turn a window of text into a number you can update in O(1). Compare numbers instead of strings, verify the rare match, and binary search on length for the hard problems.",cardIds:["r4-rh-signal","r4-rh-update","r4-rh-collision","r4-rh-cost","r4-rh-negative","r4-rh-overflow","r4-rh-2bit-predict","r4-rh-mask-cloze","r4-rh-bsearch-why","r4-rh-bsearch-trace","r4-rh-bsearch-parsons","r4-rh-anti","r4-rh-words"],problemIds:["echo-strand","longest-echo","word-chain-window"],pages:[{title:"A hash you can update in O(1)",blocks:[{kind:"text",text:"Comparing a pattern of length `m` against every window of a text costs `O(n·m)`. Give every window a fingerprint instead. Treat the window as a number in base `B`: `h = s[i]·B^(m-1) + ... + s[i+m-1]`, taken modulo a large prime. Sliding by one character is then `O(1)`: remove the leaving character's term, multiply by `B`, add the entering character."},{kind:"code",run:!0,caption:"Rabin-Karp: count the starts of a pattern, verifying every fingerprint match.",code:`#include <iostream>
#include <string>

int main() {
    const long long MOD = 1'000'000'007, BASE = 131;
    std::string s = "ababa", p = "aba";
    const int n = static_cast<int>(s.size()), m = static_cast<int>(p.size());
    long long top = 1;                           // BASE^(m-1) mod MOD
    for (int i = 1; i < m; ++i) top = top * BASE % MOD;
    long long hp = 0, hw = 0;
    for (int i = 0; i < m; ++i) {
        hp = (hp * BASE + p[i]) % MOD;
        hw = (hw * BASE + s[i]) % MOD;
    }
    int found = 0;
    for (int i = 0; i + m <= n; ++i) {
        if (hw == hp && s.compare(i, m, p) == 0) ++found;   // verify: equal hashes may collide
        if (i + m < n) {
            hw = (hw - s[i] * top % MOD + MOD) % MOD;       // + MOD keeps it non-negative
            hw = (hw * BASE + s[i + m]) % MOD;
        }
    }
    std::cout << found << '\\n';
}
`},{kind:"pitfall",title:"Negative remainders",text:"In C++ `%` of a negative number is negative. After subtracting the leaving term, add `MOD` before taking `% MOD`, or the fingerprint of a valid window goes wrong."},{kind:"pitfall",title:"Overflow in the product",text:"With `MOD` near `10^9`, `hash * BASE` fits in `long long`. With a 61-bit modulus the product needs `__int128`. A modulus of `2^64` (unsigned overflow) looks free but can be broken by structured strings such as Thue-Morse sequences."},{kind:"interview",text:"Say the guarantee honestly: 'equal strings always have equal fingerprints; equal fingerprints are only probably equal strings, so I verify, or use two moduli and accept a tiny failure chance'."}]},{title:"Exact keys: packing small alphabets",blocks:[{kind:"text",text:"When the alphabet is tiny and the window is short, you do not need a probabilistic hash at all. DNA letters need 2 bits each, so a 10-letter window is a 20-bit integer. Shift left by 2, OR in the new letter, and mask off the oldest bits. The key is exact: equal keys mean equal windows, no verification needed."},{kind:"code",run:!0,caption:"Rolling 2-bit key of width k = 4: A=0, C=1, G=2, T=3.",code:`#include <iostream>
#include <string>

int code(char c) { return c == 'A' ? 0 : c == 'C' ? 1 : c == 'G' ? 2 : 3; }

int main() {
    std::string s = "ACGTAC";
    const int k = 4;
    const int mask = (1 << (2 * k)) - 1;      // keep the newest 2k bits
    int key = 0;
    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        key = ((key << 2) | code(s[i])) & mask;
        if (i >= k - 1) std::cout << key << ' ';
    }
    std::cout << '\\n';
}
`},{kind:"text",text:"A `std::unordered_map<int, int>` or `unordered_set<int>` of these keys finds repeated windows in `O(n)`. Compare that with storing every `substr` of length 10: the same time but 10× the memory and a heap allocation per window."},{kind:"idiom",title:"Mask from the width",text:"`(1 << (2 * k)) - 1` for 2-bit letters, `(1 << (5 * k)) - 1` for 5-bit letters. Use `long long` (and `1LL`) once `2k` or `5k` reaches 31 bits."}]},{title:"Binary search on length, and hashing words",blocks:[{kind:"text",text:"To find the longest substring that appears twice, check a fixed length `L` with a rolling hash in `O(n)`. If some repeat has length `L`, trimming one letter gives a repeat of length `L-1`, so the question is monotone: binary search the largest `L` that passes. Total `O(n log n)`."},{kind:"code",run:!0,caption:"Binary search on the repeat length (the check here is exact and simple; the real exercise swaps in a rolling hash).",code:`#include <iostream>
#include <string>
#include <unordered_set>

bool hasRepeat(const std::string& s, int len) {
    std::unordered_set<std::string> seen;
    for (int i = 0; i + len <= static_cast<int>(s.size()); ++i)
        if (!seen.insert(s.substr(i, len)).second) return true;
    return false;
}

int main() {
    std::string s = "banana";
    int lo = 0, hi = static_cast<int>(s.size()) - 1;   // answer is in [lo, hi]
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;                   // round up so the range always shrinks
        if (hasRepeat(s, mid)) lo = mid; else hi = mid - 1;
    }
    std::cout << lo << '\\n';
}
`},{kind:"text",text:"Hashing also works above the character level. For 'find windows made of every given word exactly once', give each distinct word a small integer id, then run a count-based sliding window over the ids. Words of equal length `w` mean there are only `w` alignments to try, each a plain window over word-sized steps."},{kind:"pitfall",title:"Anti-hash tests",text:"One fixed base with one modulus can be attacked if tests are built against it. Use two moduli, or a random base chosen at run time, and verify candidate matches when the cost is acceptable."},{kind:"interview",text:"For a hard 'duplicate substring' prompt, outline: 'binary search on length, rolling hash to test a length in `O(n)`, verify or double-hash, total `O(n log n)`'. Then mention the suffix array as the alternative that avoids probability."}]}]}],l=r.default;e.s(["W",0,d,"C",0,l],14284)},59808,(e,t,n)=>{t.exports={"s1-first-program:0:1":"hello, mainville\n","s1-types:0:1":"char 1\nint 4\nlong long 8\ndouble 8\n","s1-types:1:1":"10000000000\n","s1-arithmetic:0:1":"3 1\n-3 -1\n-3 1\n","s1-arithmetic:1:1":"3 3.5 3.5\n","s2-branches-loops:0:1":"ABCF\n","s2-branches-loops:0:4":"weekend\n","s2-branches-loops:1:1":"1 3 5 \n","s2-functions:0:1":"1 11\n","s2-functions:1:2":"int double int \n","s2-recursion-static:0:1":"1594323\n","s2-recursion-static:1:1":"123 111\n","s3-vectors:0:1":"3 2 4\n","s3-vectors:0:4":"5 2x3\n","s3-vectors:1:1":"0 5 0 9\n","s3-vectors:1:4":"2 3 4 \n","s3-strings:0:1":"algo rithm or\n","s3-strings:0:3":"1 3 \n","s3-strings:1:1":"221\n","s3-strings:1:3":"1230 1231\n","s3-splitting:0:1":"3 []\n","s3-splitting:0:3":"2\n","s4-structs:0:2":"1\n","s4-structs:1:1":"abc\n","s4-lists:0:1":"123\n","s4-lists:1:1":"1 2 3 \n","s4-lists:1:3":"1 2 3 \n","s4-trees-solution:0:1":"2\n","s4-trees-solution:1:1":"2\n","r1-reading-cost:0:2":"45\n","r2-hash-lookup:0:2":"4\n","r2-hash-lookup:1:2":"4\n","r2-two-pointers:0:1":"1 5\n","r2-two-pointers:1:1":"4 5 7 2 0 0 0 \n","r2-prefix-kadane:0:2":"7\n","r2-prefix-kadane:1:1":"1 5 7 7 2 2 \n","r2-prefix-kadane:1:3":"-2\n","r3-sliding-window:0:1":"13\n","r3-sliding-window:1:2":"3\n","r3-sliding-window:1:3":"2\n","r3-sliding-window:2:1":"2\n","r3-monotonic-deque:0:1":"3 3 5 5 6 7 \n","r3-monotonic-deque:1:2":"3\n","r4-hash-internals:0:1":"0:\n1:\n2: 2 6\n3: 3 7 11\n","r4-hash-internals:1:1":"7 rehashes moved 1016 entries for 1000 inserts\n","r4-hash-internals:2:0":"zero 1 0 1\n","r4-hash-internals:2:3":"2 5 7\n","r4-key-design:0:1":"eilnst 1 0\n","r4-key-design:0:3":"1 0\n","r4-key-design:1:2":"100\n","r4-key-design:2:1":"3\n","r4-rolling-hash:0:1":"2\n","r4-rolling-hash:1:1":"27 108 177 \n","r4-rolling-hash:2:1":"3\n"}}]);