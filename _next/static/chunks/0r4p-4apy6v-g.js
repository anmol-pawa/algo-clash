(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,93432,45065,77421,7583,e=>{"use strict";var t=e.i(43476),n=e.i(71645);function o(e){return e.split("\n").map(e=>e.trim().replace(/\s+/g," ")).join("\n").replace(/\n+$/,"")}let i=e=>e.trim().replace(/\s+/g," ");function s(e,t,n){if(t.kind!==e.kind)throw Error(`response ${t.kind} does not match card ${e.id} (${e.kind})`);switch(e.kind){case"mcq":case"compilerError":return{correct:t.choice===e.answer,parts:[]};case"multi":{let n=[...new Set(t.choices)].sort(),o=[...e.answers].sort(),i=e.choices.map((e,t)=>n.includes(t)===o.includes(t));return{correct:i.every(Boolean),parts:i}}case"predict":case"trace":{let i=n[e.id]?.output;if(void 0===i)throw Error(`card ${e.id} has no computed output`);return{correct:o(t.text)===o(i),parts:[]}}case"parsons":{let n=t.lines.map(e=>e.trimEnd()),o=e.lines.map((e,t)=>n[t]===e.trimEnd());return{correct:n.length===e.lines.length&&o.every(Boolean),parts:o}}case"cloze":{let n=t.blanks,o=e.blanks.map((e,t)=>e.some(e=>i(e)===i(n[t]??"")));return{correct:o.every(Boolean),parts:o}}}}e.s(["J",0,"___","Y",0,function(e,t){let n=0;return e.replace(/___/g,()=>t[n++]??"")},"w",0,s],45065);var r=e.i(94801);function a({code:e,numbered:n}){let o=e.replace(/\n$/,"").split("\n");return(0,t.jsx)("pre",{className:"overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono [font-variant-ligatures:none] text-[13px] leading-5","aria-label":"code",children:o.map((e,o)=>(0,t.jsxs)("div",{children:[n&&(0,t.jsx)("span",{className:"mr-3 inline-block w-5 select-none text-right opacity-40",children:o+1}),e||" "]},o))})}let c=(e,t)=>`min-h-11 w-full rounded border px-3 py-2 text-left text-sm ${"right"===t?"border-emerald-400 bg-emerald-500/20":"wrong"===t?"border-rose-400 bg-rose-500/20":e?"border-[var(--accent)] bg-[var(--accent)]/15":"border-white/15 bg-black/25"}`;function l({card:e,computed:o,seed:i,locked:s,grade:d,onChange:u,onSubmit:h}){let[p,m]=(0,n.useState)(null),[g,f]=(0,n.useState)([]),[b,v]=(0,n.useState)(""),[w,x]=(0,n.useState)(()=>"cloze"===e.kind?e.blanks.map(()=>""):[]),y=(0,n.useMemo)(()=>"parsons"===e.kind?function(e,t){let n=e.lines.join("\n");for(let o=0;o<50;++o){let o=t.shuffle(e.lines);if(o.join("\n")!==n)return o}return[...e.lines].reverse()}(e,(0,r.f)(i)):[],[e,i]),[k,T]=(0,n.useState)([]);if("mcq"===e.kind||"compilerError"===e.kind)return(0,t.jsxs)(t.Fragment,{children:["compilerError"===e.kind&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a,{code:e.code,numbered:!0}),(0,t.jsxs)("div",{className:"rounded border border-rose-400/40 bg-rose-500/10 p-2 font-mono text-xs","data-testid":"diagnostic",children:[(0,t.jsx)("span",{className:"opacity-60",children:"g++ says: "}),o[e.id]?.diagnostic]})]}),(0,t.jsx)("div",{className:"flex flex-col gap-2",role:"radiogroup","aria-label":"choices",children:e.choices.map((n,o)=>(0,t.jsx)("button",{role:"radio","aria-checked":p===o,className:c(p===o,s?o===e.answer?"right":p===o?"wrong":"idle":"idle"),onClick:()=>{!s&&(m(o),u({kind:e.kind,choice:o}))},children:n},o))})]});if("multi"===e.kind)return(0,t.jsxs)("div",{className:"flex flex-col gap-2",role:"group","aria-label":"choices",children:[(0,t.jsx)("p",{className:"text-xs opacity-60",children:"Select all that apply."}),e.choices.map((e,n)=>(0,t.jsxs)("button",{role:"checkbox","aria-checked":g.includes(n),className:c(g.includes(n),s?d?.parts[n]?"right":"wrong":"idle"),onClick:()=>(e=>{if(s)return;let t=g.includes(e)?g.filter(t=>t!==e):[...g,e];f(t),u(t.length?{kind:"multi",choices:t}:null)})(n),children:[(0,t.jsx)("span",{className:"mr-2 font-mono",children:g.includes(n)?"[x]":"[ ]"}),e]},n))]});if("predict"===e.kind||"trace"===e.kind)return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a,{code:e.code}),(0,t.jsxs)("label",{className:"flex flex-col gap-1 text-xs",children:[(0,t.jsx)("span",{className:"opacity-70",children:"Program output (one line per output line)"}),(0,t.jsx)("textarea",{className:"min-h-24 rounded border border-white/15 bg-black/40 p-2 font-mono text-sm",value:b,disabled:s,rows:"trace"===e.kind?1:3,onChange:t=>{v(t.target.value),u(t.target.value.trim()?{kind:e.kind,text:t.target.value}:null)},onKeyDown:e=>{"Enter"===e.key&&(e.ctrlKey||e.metaKey)&&h()}})]}),s&&d&&!d.correct&&(0,t.jsxs)("div",{className:"rounded border border-emerald-400/50 bg-emerald-500/10 p-2 font-mono text-xs","data-testid":"expected",children:["Real output: ",o[e.id]?.output?.trimEnd().replace(/\n/g," ⏎ ")]})]});if("parsons"===e.kind)return(0,t.jsxs)("div",{className:"grid gap-3 sm:grid-cols-2",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h4",{className:"mb-1 font-display text-xs uppercase tracking-wider opacity-70",children:"Lines"}),(0,t.jsx)("div",{className:"flex flex-col gap-1",children:y.map((e,n)=>(0,t.jsx)("button",{disabled:k.includes(n)||s,className:"min-h-11 rounded border border-white/15 bg-black/30 px-2 text-left font-mono text-xs disabled:opacity-25",onClick:()=>(e=>{if(s||k.includes(e))return;let t=[...k,e];T(t),u(t.length===y.length?{kind:"parsons",lines:t.map(e=>y[e])}:null)})(n),children:e},n))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h4",{className:"mb-1 font-display text-xs uppercase tracking-wider opacity-70",children:"Your program (tap a line to remove it)"}),(0,t.jsxs)("div",{className:"flex flex-col gap-1","data-testid":"parsons-answer",children:[k.map((e,n)=>{let o=s&&d?d.parts[n]?"right":"wrong":"idle";return(0,t.jsx)("button",{className:`${c(!1,o)} font-mono text-xs`,onClick:()=>{s||(T(k.filter((e,t)=>t!==n)),u(null))},children:y[e]},n)}),0===k.length&&(0,t.jsx)("p",{className:"rounded border border-dashed border-white/20 p-3 text-xs opacity-60",children:"Tap lines on the left in the order they should run."})]})]})]});let N=e.template.replace(/\n$/,"").split("___");return(0,t.jsx)("pre",{className:"overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono [font-variant-ligatures:none] text-[12px] leading-6","aria-label":"code with blanks",children:N.map((e,n)=>(0,t.jsxs)("span",{children:[e,n<N.length-1&&(0,t.jsx)("input",{"aria-label":`blank ${n+1}`,className:`mx-0.5 h-7 w-10 rounded border bg-black/60 px-1 text-center font-mono [font-variant-ligatures:none] text-[13px] ${s&&d?d.parts[n]?"border-emerald-400":"border-rose-400":"border-[var(--accent)]"}`,value:w[n],disabled:s,autoCapitalize:"off",autoCorrect:"off",spellCheck:!1,onChange:e=>{var t;let o;return t=e.target.value,void((o=w.slice())[n]=t,x(o),u(o.every(e=>e.trim())?{kind:"cloze",blanks:o}:null))},onKeyDown:e=>{"Enter"===e.key&&h()}})]},n))})}e.s(["f",0,function({cards:e,computed:o,size:i=5,seed:a=1,onFinish:c}){let d=(0,n.useMemo)(()=>(function(e,t,n,o=new Set){return[...n.shuffle(e.filter(e=>!o.has(e.id))),...n.shuffle(e.filter(e=>o.has(e.id)))].slice(0,t)})(e,i,(0,r.f)(a)),[e,i,a]),[u,h]=(0,n.useState)(0),[p,m]=(0,n.useState)(null),[g,f]=(0,n.useState)(null),[b,v]=(0,n.useState)({total:0,correct:0,xp:0,bestStreak:0}),[w,x]=(0,n.useState)(0),[y,k]=(0,n.useState)(!1),T=d[u],N=()=>{if(!p||g)return;let e=s(T,p,o),t=e.correct?w+1:0;f(e),x(t),v(n=>{var o;return{total:n.total+1,correct:n.correct+ +!!e.correct,xp:n.xp+(o=e.correct,o?15+Math.min(5,Math.max(0,w)):2),bestStreak:Math.max(n.bestStreak,t)}})};return y?(0,t.jsxs)("section",{className:"panel mx-auto flex w-full min-w-0 max-w-xl flex-col gap-3 p-4","aria-label":"Card results","data-testid":"card-results",children:[(0,t.jsx)("h2",{className:"font-display text-xl text-[var(--gold)]",children:b.correct===b.total?"Flawless!":"Encounter cleared"}),(0,t.jsxs)("p",{className:"text-sm",children:[b.correct," / ",b.total," correct · best streak ",b.bestStreak," · ",(0,t.jsxs)("strong",{className:"text-[var(--gold)]",children:["+",b.xp," XP"]})]}),(0,t.jsx)("button",{className:"px-btn px-btn-primary min-h-11 px-4",onClick:()=>{h(0),m(null),f(null),v({total:0,correct:0,xp:0,bestStreak:0}),x(0),k(!1)},children:"Again"})]}):(0,t.jsxs)("section",{className:"panel mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-3 p-4","aria-label":"Concept card",children:[(0,t.jsxs)("header",{className:"flex items-center justify-between text-xs",children:[(0,t.jsxs)("span",{className:"font-display uppercase tracking-wider opacity-70",children:["Card ",u+1," / ",d.length]}),(0,t.jsxs)("span",{children:["Streak ",w," · ",b.xp," XP"]})]}),(0,t.jsx)("h2",{className:"font-display text-lg text-[var(--gold)]",children:T.prompt}),(0,t.jsx)(l,{card:T,computed:o,seed:131*a+u,locked:!!g,grade:g,onChange:m,onSubmit:N},T.id+u),g?(0,t.jsxs)("div",{className:`rounded border p-3 text-sm ${g.correct?"border-emerald-400/60 bg-emerald-500/10":"border-rose-400/60 bg-rose-500/10"}`,role:"status","data-testid":"feedback",children:[(0,t.jsx)("strong",{children:g.correct?"Correct!":"Not quite."})," ",T.explanation]}):null,(0,t.jsx)("div",{className:"flex justify-end gap-2",children:g?(0,t.jsx)("button",{className:"px-btn px-btn-primary min-h-11 px-5",onClick:()=>{if(u+1>=d.length){k(!0),c?.(b);return}h(u+1),m(null),f(null)},children:u+1>=d.length?"Finish":"Next"}):(0,t.jsx)("button",{className:"px-btn px-btn-primary min-h-11 px-5",disabled:!p,onClick:N,children:"Check"})})]})}],93432);var d=e.i(82134);let u=`#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    long long pouchSum(vector<int> coins, int minValue) {
        long long total = 0;
        for (const auto& coin : coins) {
            if (coin >= minValue) total += coin;
        }
        return total;
    }
};
`,h=[{id:"forge-accumulate-trace-basic",kind:"trace",region:"R0",tags:["forge","accumulate","trace"],prompt:"What does this program print?",code:`${u}
int main() {
    cout << Solution().pouchSum({5, 1, 7, 3}, 4) << "\\n";
}
`,explanation:"The 5 and the 7 pass the filter (>= 4); the 1 and the 3 are skipped. 5 + 7 = 12."},{id:"forge-accumulate-trace-boundary",kind:"trace",region:"R0",tags:["forge","accumulate","boundary"],prompt:"Every coin equals minValue. What is printed?",code:`${u}
int main() {
    cout << Solution().pouchSum({4, 4, 4}, 4) << "\\n";
}
`,explanation:'"At least" means >=, so a coin exactly equal to minValue is accepted: 4 + 4 + 4 = 12. With a strict > the answer would be 0.'},{id:"forge-accumulate-trace-wide",kind:"trace",region:"R0",tags:["forge","accumulate","long-long"],prompt:"Two heavy coins. What is printed?",code:`${u}
int main() {
    cout << Solution().pouchSum({2000000000, 2000000000}, 1) << "\\n";
}
`,explanation:"The total 4,000,000,000 is more than an int can hold (about 2.1 billion), but `total` is a long long, so the sum is exact. An `int total` would overflow."},{id:"forge-accumulate-trace-adds",kind:"trace",region:"R0",tags:["forge","accumulate","loop"],prompt:"The loop is instrumented with two counters. Which pair of numbers is printed (looked at, added)?",code:`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> coins = {5, 1, 7, 3, 4};
    int minValue = 4;
    long long total = 0;
    int looked = 0, added = 0;
    for (const auto& coin : coins) {
        ++looked;
        if (coin >= minValue) {
            total += coin;
            ++added;
        }
    }
    cout << looked << " " << added << "\\n";
}
`,explanation:"The loop looks at all 5 coins. The 5, the 7 and the 4 pass (>= 4), the 1 and the 3 do not, so the addition runs 3 times."},{id:"forge-accumulate-trace-empty",kind:"trace",region:"R0",tags:["forge","accumulate","edge"],prompt:"No coin reaches minValue. What is printed?",code:`${u}
int main() {
    cout << Solution().pouchSum({1, 2, 3}, 10) << " " << Solution().pouchSum({}, 0) << "\\n";
}
`,explanation:"Nothing passes the filter and an empty pouch has nothing to loop over, so `total` keeps its initial 0 both times. Initialising the accumulator to 0 is what makes the empty case free."}],p=[{id:"s1-endl-vs-newline",kind:"mcq",region:"R0",tags:["io","endl"],prompt:"A solution prints 200,000 lines. Why do experienced C++ programmers write '\\n' instead of std::endl?",choices:["endl flushes the stream every time, which is slow for many lines","endl was removed in C++20","'\\n' flushes the buffer more safely","endl prints two line breaks"],answer:0,explanation:"std::endl writes '\\n' and then flushes the output buffer. Flushing 200,000 times costs real time; '\\n' only appends to the buffer. Flush explicitly only when you need the text to appear immediately."},{id:"s1-sync-stdio",kind:"mcq",region:"R0",tags:["io","sync_with_stdio"],prompt:"What does std::ios::sync_with_stdio(false) change?",choices:["cin and cout stop sharing buffers with C stdio, which makes them faster, so you must not mix them with scanf/printf","cout becomes safe to use from several threads","Output is no longer buffered at all","cin reads a whole line at a time instead of one token"],answer:0,explanation:"By default the C++ streams stay synchronised with C's stdin/stdout so mixing scanf and cin is safe, at a speed cost. Turning it off removes that cost, and mixing the two styles afterwards gives out-of-order results."},{id:"s1-wide-types",kind:"multi",region:"R0",tags:["types","ranges"],prompt:"Select every type guaranteed to hold at least 64 bits on any conforming platform (assume <cstdint> is included).",choices:["long long","std::int64_t","unsigned long long","int","unsigned int","short"],answers:[0,1,2],explanation:"The standard promises long long (and unsigned long long) at least 64 bits, and int64_t is exactly 64. int is only guaranteed 16 bits (32 in practice) and short 16, so never assume they are wide enough for sums that can reach 10^10."},{id:"s1-unsigned-wrap",kind:"predict",region:"R0",tags:["types","unsigned","overflow"],prompt:"What does this program print (32-bit unsigned int)?",code:`#include <iostream>
int main() {
    unsigned int u = 0;
    u -= 1;
    std::cout << u << "\\n";
}
`,explanation:"Unsigned arithmetic wraps modulo 2^32, so 0 - 1 becomes 4294967295. This is the same trap as v.size() - 1 on an empty vector. (Signed overflow, by contrast, is undefined behaviour, not wrapping.)"},{id:"s1-negative-mod",kind:"predict",region:"R0",tags:["arithmetic","modulo","negatives"],prompt:"What does this program print? Three lines.",code:`#include <iostream>
int main() {
    int a = -7, b = 2;
    std::cout << a / b << "\\n";
    std::cout << a % b << "\\n";
    std::cout << ((a % b) + b) % b << "\\n";
}
`,explanation:"C++ division truncates toward zero, so -7 / 2 is -3, and the remainder takes the sign of the dividend: -7 % 2 is -1. Adding the divisor and taking % again gives the non-negative remainder 1, the idiom for indexing a ring."},{id:"s1-int-division-double",kind:"predict",region:"R0",tags:["arithmetic","conversions"],prompt:"What does this program print? Two lines.",code:`#include <iostream>
int main() {
    double d = 7 / 2;
    double e = 7 / 2.0;
    std::cout << d << "\\n";
    std::cout << e << "\\n";
}
`,explanation:"7 / 2 is an integer division, so it yields 3 before it is stored in the double. Making one operand a double (2.0) makes the division floating-point: 3.5. Where you convert matters."},{id:"s1-auto-sizeof",kind:"predict",region:"R0",tags:["auto","types","sizeof"],prompt:"What does this program print? Four lines (a typical desktop or server target).",code:`#include <iostream>
int main() {
    auto a = 5;
    auto b = 5.0;
    auto c = 5LL;
    auto d = 'x';
    std::cout << sizeof(a) << "\\n" << sizeof(b) << "\\n" << sizeof(c) << "\\n" << sizeof(d) << "\\n";
}
`,explanation:"auto takes the type of its initialiser: 5 is int (4 bytes), 5.0 is double (8), 5LL is long long (8) and 'x' is char (1). Pick the literal suffix on purpose, because auto will faithfully give you an int when you wanted 64 bits."},{id:"s1-halving-steps",kind:"trace",region:"R0",tags:["loops","integer-division","trace"],prompt:"Trace the loop. What is printed?",code:`#include <iostream>
int main() {
    int x = 100;
    int steps = 0;
    while (x > 1) {
        x /= 3;
        ++steps;
    }
    std::cout << steps << "\\n";
}
`,explanation:"Integer division floors positive values: x goes 100, 33, 11, 3, 1, so the loop body runs 4 times. Counting how many times you can divide before reaching 1 is the shape of every logarithmic loop."},{id:"s1-literal-1e9",kind:"trace",region:"R0",tags:["literals","types","trace"],prompt:"Trace the program. What is printed?",code:`#include <iostream>
int main() {
    long long a = 1e9;
    long long b = a * 5;
    std::cout << b << "\\n";
}
`,explanation:"1e9 is a double literal, but 1,000,000,000 is exactly representable, so converting it to long long is safe. The multiplication a * 5 then happens in 64 bits: 5,000,000,000, which would have overflowed a 32-bit int."},{id:"s1-narrowing-error",kind:"compilerError",region:"R0",tags:["conversions","narrowing","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`int main() {
    int x{3.5};
    return x;
}
`,choices:["Brace initialisation forbids a narrowing conversion from double to int","3.5 is not a valid number","x must be declared double before it is used","main cannot return a variable"],answer:0,explanation:"Initialising with braces refuses conversions that can lose information. int x = 3.5; would compile silently and truncate, which is why braces are a useful guard. Use static_cast<int>(3.5) when you really mean it."},{id:"s1-missing-include",kind:"compilerError",region:"R0",tags:["includes","stl","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`#include <iostream>
using namespace std;
int main() {
    vector<int> v = {1, 2, 3};
    cout << v.size() << "\\n";
}
`,choices:["vector is declared in <vector>, which was never included","using namespace std must come after main","v.size() returns void","the braces make the vector const"],answer:0,explanation:"using namespace std only makes names visible; it does not declare them. Include the header that defines the container. In an interview, name your headers explicitly rather than hoping another one pulls them in."},{id:"s1-auto-noinit-error",kind:"compilerError",region:"R0",tags:["auto","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`int main() {
    auto total;
    total = 10;
    return total;
}
`,choices:["auto needs an initialiser to deduce the type from","total is a reserved word","auto can only be used for floating-point values","10 is too large for an auto variable"],answer:0,explanation:"auto asks the compiler to read the type off the initialiser, so there must be one. Write auto total = 0LL; (and choose the suffix deliberately) or spell out the type."},{id:"s1-big-sum-order",kind:"parsons",region:"R0",tags:["types","long-long","parsons"],prompt:"Put the lines in order so the program prints the sum of the two large values without overflow.",lines:["#include <iostream>","int main() {","    long long a = 3000000000LL;","    long long b = 4000000000LL;",'    std::cout << a + b << "\\n";',"}"],explanation:"Headers, then main; declare both 64-bit values before the statement that uses them. Both need the LL suffix because 3,000,000,000 does not fit in an int."},{id:"s1-fast-io-cloze",kind:"cloze",region:"R0",tags:["io","cloze"],prompt:"Fill the blanks with the standard fast-I/O preamble: stop syncing with C stdio and untie cin from cout.",template:`#include <iostream>
int main() {
    std::ios::sync_with_stdio(___);
    std::cin.tie(___);
    std::cout << "ready" << '\\n';
}
`,blanks:[["false","0"],["nullptr","0","NULL"]],explanation:"sync_with_stdio(false) detaches the C++ streams from C stdio. cin.tie(nullptr) stops cin from flushing cout before every read, so a read-heavy loop is not slowed by constant flushes."},{id:"s1-widen-cloze",kind:"cloze",region:"R0",tags:["types","overflow","cloze"],prompt:"Fill the blanks so the product of two 100000s is computed in 64 bits.",template:`#include <iostream>
int main() {
    int n = 100000;
    ___ area = (___)n * n;
    std::cout << area << "\\n";
}
`,blanks:[["long long","auto"],["long long"]],explanation:"int * int is computed in int and overflows before any assignment can rescue it. Widening one operand first (the cast) makes the whole multiplication 64-bit; storing into a long long alone would be too late."}],m=[{id:"s2-switch-fallthrough",kind:"predict",region:"R0",tags:["switch","fallthrough"],prompt:"What does this program print? Two lines.",code:`#include <iostream>
int main() {
    int x = 2;
    switch (x) {
        case 1: std::cout << "one\\n";
        case 2: std::cout << "two\\n";
        case 3: std::cout << "three\\n"; break;
        default: std::cout << "other\\n";
    }
}
`,explanation:"A switch jumps to the matching label and then keeps running until a break or the closing brace. Without `break` after case 2, control falls through into case 3, so you see two and three. Fallthrough is rarely intended; end every case with break or return."},{id:"s2-dangling-else",kind:"predict",region:"R0",tags:["if-else","braces"],prompt:"What does this program print? Two lines.",code:`#include <iostream>
int main() {
    int a = 1, b = 0;
    if (a)
        if (b) std::cout << "A\\n";
        else std::cout << "B\\n";
    std::cout << "C\\n";
}
`,explanation:"An `else` belongs to the nearest unmatched `if`, whatever the indentation suggests. Here it pairs with `if (b)`, so with a = 1 and b = 0 the program prints B, then C. Braces around every branch make the pairing visible and immune to this mistake."},{id:"s2-continue-trace",kind:"trace",region:"R0",tags:["loops","break","continue","trace"],prompt:"Trace the loop. What is printed?",code:`#include <iostream>
int main() {
    int sum = 0;
    for (int i = 1; i <= 10; ++i) {
        if (i % 3 == 0) continue;
        sum += i;
        if (sum > 20) break;
    }
    std::cout << sum << "\\n";
}
`,explanation:"`continue` skips the rest of this iteration (3, 6 and 9 are never added); `break` leaves the loop at once. The running sum is 1, 3, 7, 12, 19 and then 27 at i = 8, which exceeds 20, so the loop stops and prints 27."},{id:"s2-break-nested",kind:"mcq",region:"R0",tags:["loops","break","nested"],prompt:"A `break` statement runs inside the inner of two nested for loops. What does it leave?",choices:["Only the innermost loop; the outer loop continues with its next iteration","Both loops at once","The whole function","Nothing; break only works inside a switch"],answer:0,explanation:"`break` exits the nearest enclosing loop or switch only. To leave several loops at once, move them into a function and `return`, or set a flag the outer loop checks. Returning from a helper is usually the cleanest."},{id:"s2-switch-types",kind:"multi",region:"R0",tags:["switch","types"],prompt:"Select every type that can be the controlling expression of a switch statement.",choices:["int","char","an enum","long long","std::string","double"],answers:[0,1,2,3],explanation:"A switch needs an integral or enumeration type, because each case label is a compile-time integer constant. `char`, `int`, `long long` and enums all qualify. `std::string` and `double` do not: use an if/else chain, or a map, for those."},{id:"s2-switch-init-error",kind:"compilerError",region:"R0",tags:["switch","compiler-errors","scope"],prompt:"The compiler rejects this. What is the cause?",code:`int main() {
    int x = 1;
    switch (x) {
        case 1:
            int y = 5;
            return y;
        case 2:
            return 0;
    }
}
`,choices:["The jump to `case 2` would skip over the initialisation of y, which is still in scope","A switch cannot contain a return statement","y must be declared before the switch keyword","case labels must be written in descending order"],answer:0,explanation:"All cases share one scope, so jumping to `case 2` would enter the scope of `y` without running its initialiser. Wrap the case body in braces (`case 1: { int y = 5; ... }`) to give the variable its own scope."},{id:"s2-by-value-tle",kind:"mcq",region:"R0",tags:["functions","const-reference","performance"],prompt:"`int count(vector<int> v, int x)` is called 100,000 times on a vector of 100,000 elements, and the solution times out. What is the cheapest correct fix?",choices:["Take the vector as `const vector<int>& v`, so no copy is made on each call","Take it as `vector<int> v` but call `v.shrink_to_fit()` first","Return the result as `long long` instead of `int`","Mark the function `static`"],answer:0,explanation:"Passing a vector by value copies all its elements on every call: 100,000 calls times 100,000 elements is 10^10 element copies. A `const&` parameter binds to the caller's vector with no copy and forbids accidental modification. Default to `const T&` for anything bigger than a few machine words that the function only reads."},{id:"s2-ref-vs-value",kind:"predict",region:"R0",tags:["functions","references"],prompt:"What does this program print? Two lines.",code:`#include <iostream>
void bumpCopy(int x) { ++x; }
void bumpRef(int& x) { ++x; }
int main() {
    int a = 5;
    bumpCopy(a);
    std::cout << a << "\\n";
    bumpRef(a);
    std::cout << a << "\\n";
}
`,explanation:"`bumpCopy` receives its own copy of `a`, so the increment is lost when the function returns. `bumpRef` receives a reference to the caller's variable, so the change is visible. Use `T&` for out-parameters and `const T&` for large read-only inputs."},{id:"s2-const-ref-error",kind:"compilerError",region:"R0",tags:["const","references","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`#include <vector>
void addOne(const std::vector<int>& v) {
    v.push_back(1);
}
int main() {
    std::vector<int> v;
    addOne(v);
}
`,choices:["push_back modifies the vector, but v is a reference to const and cannot be modified","push_back does not exist on vectors","References cannot refer to vectors","addOne must return a value"],answer:0,explanation:"`const` on the parameter is a promise not to modify the argument, and the compiler enforces it: only const member functions may be called on `v`. If the function must change the caller's vector, take `vector<int>&`; if it only reads, keep `const&`."},{id:"s2-overload-pick",kind:"predict",region:"R0",tags:["overloading","conversions"],prompt:"What does this program print? Four lines.",code:`#include <iostream>
void show(int) { std::cout << "int\\n"; }
void show(long long) { std::cout << "long long\\n"; }
void show(double) { std::cout << "double\\n"; }
int main() {
    show(3);
    show(3LL);
    show('a');
    show(2.5f);
}
`,explanation:"The compiler prefers an exact match, then a promotion, then a conversion. `3` is an int and `3LL` a long long. A `char` promotes to `int`, and a `float` promotes to `double`, so those pick the promotion over a conversion to the other types. When two overloads are equally good the call is ambiguous and does not compile."},{id:"s2-default-arg-cloze",kind:"cloze",region:"R0",tags:["functions","default-arguments","cloze"],prompt:"Give `factor` a default so that `scale(7)` returns 70 while `scale(7, 3)` still returns 21.",template:`#include <iostream>
int scale(int x, int factor = ___) {
    return x * factor;
}
int main() {
    std::cout << scale(7) << " " << scale(7, 3) << "\\n";
}
`,blanks:[["10"]],explanation:"A default argument is filled in by the caller's compiler when the argument is omitted, so `scale(7)` becomes `scale(7, 10)`. Defaults go on the rightmost parameters, and they are written once, in the declaration the caller sees."},{id:"s2-recursion-trace",kind:"trace",region:"R0",tags:["recursion","call-stack","trace"],prompt:"Trace the recursion. What is printed?",code:`#include <iostream>
int f(int n) {
    if (n <= 1) return 1;
    return f(n - 1) + f(n - 2);
}
int main() {
    std::cout << f(6) << "\\n";
}
`,explanation:"Each call splits into two smaller calls until it hits the base case n <= 1, which returns 1. That gives f(2)=2, f(3)=3, f(4)=5, f(5)=8 and f(6)=13. The call tree has about 2^n nodes, which is why naive Fibonacci recursion is exponential and needs memoisation later in the game."},{id:"s2-missing-base-case",kind:"mcq",region:"R0",tags:["recursion","call-stack","stack-overflow"],prompt:"A recursive function has no reachable base case. What happens when it runs?",choices:["Each call adds a stack frame until the stack is exhausted and the program crashes (stack overflow)","The compiler detects it and refuses to build the program","The function returns 0 after a fixed number of calls","It loops forever using constant memory"],answer:0,explanation:"Every active call keeps a frame (parameters, locals, return address) on the call stack, typically one to a few megabytes in total. Without a base case the frames pile up until the stack runs out and the process dies. Even correct recursion that goes 10^6 levels deep can overflow, so estimate the depth before choosing it."},{id:"s2-static-local",kind:"predict",region:"R0",tags:["static","functions"],prompt:"What does this program print? Three lines.",code:`#include <iostream>
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
`,explanation:"A `static` local is initialised once, the first time control reaches it, and keeps its value between calls. A plain local would be re-created as 0 each time and print 1 three times. Use static locals for one-time tables; be wary of mutable ones, because hidden state makes functions harder to test."},{id:"s2-digit-sum-parsons",kind:"parsons",region:"R0",tags:["recursion","parsons"],prompt:"Put the lines in order so the program prints the digit sum of 1234 using recursion.",lines:["#include <iostream>","int digitSum(int n) {","    if (n == 0) return 0;","    return n % 10 + digitSum(n / 10);","}","int main() {",'    std::cout << digitSum(1234) << "\\n";',"}"],explanation:"The base case comes first, so the recursion stops at 0; then the recursive step peels off the last digit (n % 10) and recurses on the rest (n / 10). The function must be defined before `main` uses it. The output is 10."}],g=[{id:"s3-ctor-forms",kind:"predict",region:"R0",tags:["vector","constructors"],prompt:"What does this program print? Four numbers on one line.",code:`#include <iostream>
#include <vector>
int main() {
    std::vector<int> a(5);
    std::vector<int> b{5};
    std::vector<int> c(2, 9);
    std::cout << a.size() << ' ' << b.size() << ' ' << b[0] << ' ' << c[1] << "\\n";
}
`,explanation:'Parentheses call the count constructor: `a(5)` is five zeros and `c(2, 9)` is two nines. Braces are a literal element list, so `b{5}` is a single element whose value is 5. Reach for parentheses for "n copies" and braces only for explicit values.'},{id:"s3-reserve-resize",kind:"predict",region:"R0",tags:["vector","reserve","resize"],prompt:"What does this program print? Two lines.",code:`#include <iostream>
#include <vector>
int main() {
    std::vector<int> v;
    v.reserve(50);
    std::cout << v.size() << "\\n";
    v.resize(3);
    v.push_back(4);
    std::cout << v.size() << ' ' << v[0] << ' ' << v[3] << "\\n";
}
`,explanation:"`reserve` only prepares capacity; the size is still 0, and writing `v[0]` at that point would be undefined behaviour. `resize(3)` creates three value-initialised elements (zeros), and `push_back(4)` then appends a fourth, so the size is 4 with v[0] = 0 and v[3] = 4."},{id:"s3-oob-index",kind:"multi",region:"R0",tags:["vector","at","undefined-behaviour"],prompt:"Select every true statement about indexing a `vector<int> v` with an index `i >= v.size()`.",choices:["`v[i]` is undefined behaviour: no check is made","`v.at(i)` throws `std::out_of_range`","`v[i]` grows the vector so that index i exists","`v[i]` always throws an exception when i is out of range"],answers:[0,1],explanation:"`operator[]` trusts you: out of range it reads or writes memory that is not yours, which may crash, may silently corrupt data, or may appear to work. `at` checks the bound and throws. Unlike `map::operator[]`, a vector never grows on indexing; use `push_back` or `resize`."},{id:"s3-size-unsigned",kind:"mcq",region:"R0",tags:["vector","size","unsigned","off-by-one"],prompt:"`v` is an empty `vector<int>`. What does `for (size_t i = 0; i < v.size() - 1; ++i) use(v[i]);` do?",choices:["`v.size() - 1` wraps around to a huge unsigned number, so the loop runs far past the end of the vector","It does nothing, because 0 - 1 is -1 and 0 < -1 is false","It does not compile, because size() cannot be subtracted from","It throws `std::out_of_range` on the first iteration"],answer:0,explanation:"`size()` is unsigned, so on an empty vector `size() - 1` is 2^64 - 1, and the loop condition stays true until it crashes. Rewrite the condition as `i + 1 < v.size()`, which never subtracts, or guard against empty input first."},{id:"s3-2d-init",kind:"mcq",region:"R0",tags:["vector","2d","grid"],prompt:"Which line creates an `n` by `m` grid of zeros that you can index as `g[r][c]` straight away?",choices:["`vector<vector<int>> g(n, vector<int>(m, 0));`","`vector<vector<int>> g(n);`","`vector<int> g(n * m);`","`vector<vector<int>> g; g.reserve(n);`"],answer:0,explanation:"The second constructor argument is the row that is copied n times, so every row exists and has m zeros. `g(n)` makes n empty rows, so `g[r][c]` is out of range. A flat `vector<int>` is indexed `g[r * m + c]`, not `g[r][c]`. `reserve` leaves the size at 0."},{id:"s3-erase-cost",kind:"mcq",region:"R0",tags:["vector","erase","complexity"],prompt:"A loop removes every zero from a vector of n integers by calling `v.erase(v.begin() + i)` on each zero it finds. What is the worst-case total cost?",choices:["O(n^2), because each erase shifts every later element left","O(n), because erase is constant time","O(n log n), because erase rebalances the vector","O(1), because only the zeros are touched"],answer:0,explanation:"Erasing from the middle of a vector moves all the elements after it, which is O(n) per call, so removing up to n/2 zeros costs O(n^2). The erase-remove idiom, `v.erase(remove(v.begin(), v.end(), 0), v.end())`, compacts the survivors in one pass and erases the tail once: O(n)."},{id:"s3-auto-ref",kind:"predict",region:"R0",tags:["range-for","auto","references"],prompt:"What does this program print?",code:`#include <iostream>
#include <vector>
int main() {
    std::vector<int> v{1, 2, 3};
    for (auto x : v) x += 5;
    for (auto& y : v) y *= 2;
    for (const auto& z : v) std::cout << z << ' ';
    std::cout << "\\n";
}
`,explanation:"The first loop's `auto x` is a copy, so adding 5 changes nothing in the vector. The second loop's `auto& y` is a reference to each element, so doubling it changes the vector to 2 4 6. The third only reads, so `const auto&` avoids a copy."},{id:"s3-const-auto-error",kind:"compilerError",region:"R0",tags:["range-for","const","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`#include <vector>
int main() {
    std::vector<int> v{1, 2, 3};
    for (const auto& x : v) {
        x += 1;
    }
}
`,choices:["`x` is a reference to const, so the loop body may not modify it; use `auto&` to edit elements","A range-for cannot iterate a vector of ints","`+=` is not defined for int","`x` must be declared before the loop"],answer:0,explanation:"`const auto&` promises read-only access and the compiler enforces it. If the loop should change the elements, write `auto&`; if it only reads, keep `const auto&`, which is also the cheapest form for large element types."},{id:"s3-substr-args",kind:"predict",region:"R0",tags:["string","substr"],prompt:"What does this program print? Four parts separated by `|`.",code:`#include <iostream>
#include <string>
int main() {
    std::string s = "interview";
    std::cout << s.substr(2, 3) << '|' << s.substr(5) << '|' << s.substr(0, 0) << '|' << s.substr(6, 100) << "\\n";
}
`,explanation:'The second argument of `substr` is a length, not an end index: `substr(2, 3)` takes three characters from index 2 ("ter"). Leaving it out takes everything from the start position ("view"). A length of 0 gives an empty string, and a length that is too large is clipped to the end ("iew"). Only a start position past the end throws.'},{id:"s3-find-npos",kind:"predict",region:"R0",tags:["string","find","npos"],prompt:"What does this program print? Three values on one line.",code:`#include <iostream>
#include <string>
int main() {
    std::string s = "mississippi";
    std::cout << s.find("ss") << ' ' << s.find('s', 4) << ' ' << (s.find('z') == std::string::npos) << "\\n";
}
`,explanation:"`find(\"ss\")` returns the first index where the pattern starts (2). `find('s', 4)` starts looking at index 4, so it skips the first two s characters and finds the one at index 5. A missing character returns `npos`, and the comparison prints 1. Never test the result against -1 through an `int`; compare with `npos`."},{id:"s3-char-arith",kind:"trace",region:"R0",tags:["string","char","arithmetic"],prompt:"Trace the character arithmetic. What is printed?",code:`#include <iostream>
int main() {
    char c = 'a';
    c += 3;
    std::cout << c << ' ' << ('z' - c) << ' ' << char(c + 1) << ' ' << c + 1 << "\\n";
}
`,explanation:"`c += 3` moves 'a' to 'd'. `'z' - c` is integer arithmetic on the character codes, 122 - 100 = 22. `char(c + 1)` casts back to a character ('e'), while the bare `c + 1` is promoted to an `int` and prints its code, 101. Cast back to `char` whenever you want a letter."},{id:"s3-to-string-stoi",kind:"predict",region:"R0",tags:["string","to_string","stoi"],prompt:"What does this program print?",code:`#include <iostream>
#include <string>
int main() {
    std::string s = std::to_string(7) + std::to_string(8);
    int n = std::stoi(s) + 1;
    std::cout << s.size() << ' ' << n << "\\n";
}
`,explanation:'`to_string` produces text, so the `+` concatenates "7" and "8" into "78" (length 2) instead of adding. `stoi` parses it back to the integer 78, and adding 1 gives 79. Use `stoll` when the value can exceed 32 bits, and remember both throw on text that is not a number.'},{id:"s3-substr-tle",kind:"mcq",region:"R0",tags:["string","substr","performance"],prompt:"A loop over a 200,000-character string calls `s.substr(i)` once per position `i` just to compare the suffix, and times out. What is the cause?",choices:["Each `substr(i)` copies the rest of the string, so the loop copies O(n^2) characters in total","`substr` runs a regular expression engine internally","A string can only be indexed once per loop","`substr` modifies the original string and forces a reallocation"],answer:0,explanation:"`substr` returns a brand-new string, so every call allocates and copies up to n characters: about n^2 / 2 copies for the loop. Compare in place with `s.compare(i, len, pat)`, walk indices manually, or use `find` with a start position, which does not copy anything."},{id:"s3-letter-count-cloze",kind:"cloze",region:"R0",tags:["string","counting","cloze"],prompt:"Fill the blank so the loop counts each lowercase letter into its slot.",template:`#include <iostream>
#include <string>
#include <vector>
int main() {
    std::string s = "banana";
    std::vector<int> cnt(26, 0);
    for (char c : s) ++cnt[___];
    std::cout << cnt['a' - 'a'] << cnt['n' - 'a'] << "\\n";
}
`,blanks:[["c - 'a'","c-'a'"]],explanation:"Subtracting 'a' turns the letter's code into a slot number: 'a' maps to 0, 'b' to 1 and 'z' to 25. This needs lowercase-only input; with other characters the index would leave 0..25, so ask about the alphabet first. In \"banana\" the letter a appears three times and n twice, so it prints 32."},{id:"s3-split-parsons",kind:"parsons",region:"R0",tags:["string","split","stringstream","parsons"],prompt:"Put the lines in order so the program prints the length of each comma-separated colour name.",lines:["#include <iostream>","#include <sstream>","#include <string>","int main() {",'    std::stringstream ss("red,green,blue");',"    std::string part;","    while (std::getline(ss, part, ',')) {",'        std::cout << part.size() << " ";',"    }",'    std::cout << "\\n";',"}"],explanation:"The stream and the string it reads into are declared first. `getline(ss, part, ',')` reads up to each comma and returns false at the end of the stream, which ends the loop; the body prints the length of each field. The program prints 3 5 4."}],f=[{id:"s4-struct-class-access",kind:"mcq",region:"R0",tags:["struct","class","access"],prompt:"What is the only language-level difference between 'struct' and 'class' in C++?",choices:["The default access: struct members are public, class members are private (and the default inheritance follows the same rule)","A struct cannot have member functions or constructors","A class is stored on the heap and a struct on the stack","A struct cannot be passed by reference"],answer:0,explanation:"Both can have fields, constructors, methods and inheritance, and both can live on the stack or the heap. Only the default access differs: `struct` starts public, `class` starts private. By convention, `struct` marks plain data and `class` marks a type with invariants."},{id:"s4-init-order",kind:"predict",region:"R0",tags:["constructor","initialiser-list","order"],prompt:"What does this program print?",code:`#include <iostream>
struct Loud {
    explicit Loud(int x) { std::cout << x; }
};
struct Pair {
    Loud first;
    Loud second;
    Pair() : second(2), first(1) {}
};
int main() {
    Pair p;
    std::cout << "\\n";
}
`,explanation:"Members are constructed in the order they are declared in the struct (`first`, then `second`), not in the order written in the initialiser list, so it prints 12 even though the list says `second(2)` first. Compilers warn about the mismatch (-Wreorder); keep the list in declaration order so nobody has to remember the rule, and never make one member's initialiser depend on a later member."},{id:"s4-this-shadow",kind:"predict",region:"R0",tags:["constructor","this","shadowing"],prompt:"What does this program print?",code:`#include <iostream>
struct Meter {
    int n;
    explicit Meter(int n) : n(n) { n += 5; }
};
int main() {
    Meter m(1);
    std::cout << m.n << "\\n";
}
`,explanation:"In `n(n)` the outer `n` is the member and the inner `n` is the parameter, so the member becomes 1. In the body, the bare `n` is the parameter, so `n += 5` changes a local copy and the member stays 1. To change the member there you would write `this->n += 5;`."},{id:"s4-no-default-ctor",kind:"compilerError",region:"R0",tags:["constructor","default-constructor","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`struct P {
    int x;
    P(int x) : x(x) {}
};
int main() {
    P p;
}
`,choices:["Once a struct declares any constructor, the compiler no longer generates a default one, and `P p;` needs a no-argument constructor","A struct cannot have a constructor with a parameter named like a member","`P p;` must be written `P p = P;`","Constructors must be declared after `main`"],answer:0,explanation:"A user-declared constructor suppresses the implicit default constructor. Either construct with an argument (`P p(3);`), add `P() : x(0) {}`, or give the parameter a default (`P(int x = 0)`). The same rule explains why a `ListNode` with a constructor needs `ListNode(0)`, not `ListNode n;`."},{id:"s4-operator-less",kind:"cloze",region:"R0",tags:["operator<","sort","struct","cloze"],prompt:"Fill the blank so 'sort' puts the lightest item first.",template:`#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
struct Item {
    int w;
    std::string name;
    bool operator<(const Item& o) const { return ___; }
};
int main() {
    std::vector<Item> v{{3, "c"}, {1, "a"}, {2, "b"}};
    std::sort(v.begin(), v.end());
    for (const auto& it : v) std::cout << it.name;
    std::cout << "\\n";
}
`,blanks:[["w < o.w","this->w < o.w","w<o.w"]],explanation:'`operator<` answers "must `*this` come before `o`?". Comparing the weights with `<` gives ascending order, so the program prints abc. Use `<`, never `<=`: the ordering must be strict, or `sort` can misbehave on equal elements. The `const` after the parameter list lets it be called on const objects.'},{id:"s4-nullptr",kind:"mcq",region:"R0",tags:["nullptr","pointers"],prompt:"Why do modern C++ solutions write 'nullptr' instead of '0' or 'NULL' for an empty pointer?",choices:["`nullptr` has its own pointer type, so it can never be mistaken for the integer 0 in overloads or templates","`nullptr` is faster at run time than `0`","`0` cannot be assigned to a pointer in C++","`nullptr` frees the memory the pointer was holding"],answer:0,explanation:"`0` and `NULL` are integers that happen to convert to pointers, so a call like `f(NULL)` can pick the `int` overload. `nullptr` has type `std::nullptr_t`, which converts only to pointer types. It costs nothing at run time and it does not free anything."},{id:"s4-list-walk",kind:"trace",region:"R0",tags:["linked-list","pointer","traversal"],prompt:"What does this program print?",code:`#include <iostream>
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
    std::cout << acc << "\\n";
}
`,explanation:"The loop visits the nodes in link order 1, 2, 3 and stops when `p` becomes null at the end of the list. Each step shifts `acc` one decimal place and adds the node value, so it prints 123. Note that the loop never dereferences a null pointer, because the check happens before `p->val`."},{id:"s4-dummy-head",kind:"mcq",region:"R0",tags:["linked-list","dummy-head"],prompt:"You build a result list node by node. What does a dummy head node buy you?",choices:["The first real node is appended like any other, so there is no special case for an empty result; you return `dummy.next`","It makes the list doubly linked","It stops the nodes from needing `new`","It makes traversal O(1) instead of O(n)"],answer:0,explanation:'With a dummy, `tail` always points at a real node object, so `tail->next = ...` works even for the first element. It does not change complexity or ownership; it only removes the "is the list empty yet?" branch, which is the usual source of head bugs when you also delete the first node.'},{id:"s4-new-pointer",kind:"compilerError",region:"R0",tags:["new","pointers","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`struct ListNode {
    int val;
    ListNode* next;
    explicit ListNode(int x) : val(x), next(nullptr) {}
};
int main() {
    ListNode node = new ListNode(1);
}
`,choices:["`new` returns a `ListNode*`, which cannot initialise a `ListNode` object; declare `ListNode* node`","`new` cannot be used with a struct that has a constructor","A `ListNode` must be declared with `auto&`","`next` must be initialised to `0`, not `nullptr`"],answer:0,explanation:"`new T(args)` allocates on the heap and returns a pointer. Store it in a `T*`: `ListNode* node = new ListNode(1);`. To make a stack object you would write `ListNode node(1);` with no `new`. In interview code you normally leave heap nodes undeleted."},{id:"s4-append-parsons",kind:"parsons",region:"R0",tags:["linked-list","tail","parsons"],prompt:"Put the lines in order so the program builds the list 1, 2, 3 with a dummy head and prints it.",lines:["#include <iostream>","struct ListNode { int val; ListNode* next; ListNode(int x) : val(x), next(nullptr) {} };","int main() {","    ListNode dummy(0);","    ListNode* tail = &dummy;","    for (int x = 1; x <= 3; ++x) {","        tail->next = new ListNode(x);","        tail = tail->next;","    }",'    for (ListNode* p = dummy.next; p; p = p->next) std::cout << p->val << " ";','    std::cout << "\\n";',"}"],explanation:"The dummy and the tail pointer come first. Each loop pass hangs a new node off `tail->next` and then moves `tail` onto it, so appending is O(1). The final loop starts at `dummy.next`, the real head, and prints 1 2 3."},{id:"s4-tree-height",kind:"predict",region:"R0",tags:["tree","recursion","height"],prompt:"What does this program print?",code:`#include <algorithm>
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
    TreeNode a(1), b(2), c(3), d(4);
    a.left = &b;
    b.left = &c;
    b.right = &d;
    std::cout << height(&a) << ' ' << height(&b) << ' ' << height(nullptr) << "\\n";
}
`,explanation:"A null tree has height 0. Node `c` and `d` are leaves of height 1, so `b` has height 2 and the root `a`, whose only child is `b`, has height 3. The three calls therefore print 3 2 0."},{id:"s4-arrow-dot",kind:"compilerError",region:"R0",tags:["pointers","arrow","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
int main() {
    TreeNode* p = new TreeNode(4);
    int v = p.val;
}
`,choices:["`p` is a pointer, so its member is reached with `p->val` (or `(*p).val`), not `p.val`","`val` is private and cannot be read from `main`","A `TreeNode*` cannot be initialised with `new`","`int v` must be declared before `p`"],answer:0,explanation:"`.` works on an object or a reference, `->` on a pointer. The compiler says that a member was requested on a pointer type. In recursive tree code this decides most of the typos: `root->left`, but `node.left` when `node` is an object."},{id:"s4-tree-null-base",kind:"mcq",region:"R0",tags:["tree","recursion","null","undefined-behaviour"],prompt:"A recursive 'height(TreeNode* root)' omits the line 'if (root == nullptr) return 0;'. What happens on any non-empty tree?",choices:["The recursion reaches a leaf and then evaluates `root->left` on a null pointer: undefined behaviour, in practice a crash","It returns 0 for every tree","It loops forever on a finite tree without crashing","The compiler inserts the check automatically"],answer:0,explanation:"A leaf's children are null. Without the base case, the call on that null child reads `->left` from address 0, which is undefined behaviour and normally a segmentation fault. The compiler does not add null checks for you. Write the null case first, and decide what it returns (0 for height, 0 for a sum, an empty result for a collection)."},{id:"s4-leaf-cloze",kind:"cloze",region:"R0",tags:["tree","leaf","cloze"],prompt:"Fill the blank so the function counts leaves (nodes with no children).",template:`#include <iostream>
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
int leaves(const TreeNode* root) {
    if (root == nullptr) return 0;
    if (___) return 1;
    return leaves(root->left) + leaves(root->right);
}
int main() {
    TreeNode a(1), b(2), c(3), d(4);
    a.left = &b;
    a.right = &c;
    b.left = &d;
    std::cout << leaves(&a) << "\\n";
}
`,blanks:[["!root->left && !root->right","root->left == nullptr && root->right == nullptr","!root->left&&!root->right"]],explanation:"A leaf is a non-null node whose left and right children are both null. A null child is falsy, so `!root->left && !root->right` says exactly that. The tree has leaves c (3) and d (4), while b has a child and a is internal, so it prints 2."},{id:"s4-solution-private",kind:"compilerError",region:"R0",tags:["class","access","solution","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`class Solution {
    int twice(int x) { return 2 * x; }
};
int main() {
    Solution s;
    return s.twice(3);
}
`,choices:["Members of a `class` are private by default; add `public:` before the method","A method cannot be called on a local object","`twice` must be declared `static`","`class` types cannot be returned from `main`"],answer:0,explanation:"Everything in a `class` is private until a `public:` label. The judge calls your method from outside the class, so it must be public: `class Solution { public: int twice(int x) {...} };`. A `struct` would have worked, but LeetCode's template uses `class Solution { public: ... };`, so keep the label."}],b=[{id:"r0-vector-header",kind:"mcq",region:"R0",tags:["stl","includes"],prompt:"Which header gives you std::vector?",choices:["<array>","<vector>","<list>","<cstddef>"],answer:1,explanation:"std::vector lives in <vector>. <array> is the fixed-size std::array, <list> is the doubly linked list."},{id:"r0-contiguous",kind:"multi",region:"R0",tags:["stl","memory"],prompt:"Select every container that stores its elements in one contiguous block.",choices:["std::vector<int>","std::array<int, 4>","std::list<int>","std::deque<int>","std::string"],answers:[0,1,4],explanation:"vector, array and string are contiguous, so &v[0] + i reaches element i. list is nodes linked by pointers, and deque is a set of separate blocks, so neither guarantees contiguity."},{id:"r0-int-division",kind:"predict",region:"R0",tags:["arithmetic","integer-division"],prompt:"What does this program print? Two lines.",code:`#include <iostream>
int main() {
    int a = 17, b = 5;
    std::cout << a / b << "\\n";
    std::cout << a % b << "\\n";
}
`,explanation:"Integer division truncates toward zero: 17 / 5 is 3, and 17 % 5 is the remainder 2."},{id:"r0-loop-sum",kind:"trace",region:"R0",tags:["loops","trace"],prompt:"Trace the loop. What is printed?",code:`#include <iostream>
int main() {
    long long total = 0;
    for (int i = 1; i <= 10; i += 3) {
        total += i;
    }
    std::cout << total << "\\n";
}
`,explanation:"i takes 1, 4, 7, 10 and each is added: 1 + 4 + 7 + 10 = 22. The bound is inclusive, so 10 counts."},{id:"r0-scope-error",kind:"compilerError",region:"R0",tags:["scope","compiler-errors"],prompt:"The compiler rejects this. What is the cause?",code:`#include <iostream>
int main() {
    for (int i = 0; i < 3; ++i) {
    }
    std::cout << i << "\\n";
}
`,choices:["A missing semicolon","i only exists inside the for loop","iostream was not included","i must be declared long long"],answer:1,explanation:"A variable declared in the for-init lives only for that loop. Declare it before the loop if you need it afterwards."},{id:"r0-const-error",kind:"compilerError",region:"R0",tags:["const","compiler-errors"],prompt:"Why does this not compile?",code:`int main() {
    const int limit = 10;
    limit = 20;
    return limit;
}
`,choices:["limit is const, so it cannot be assigned to","main must return void","20 does not fit in an int","limit is declared too early"],answer:0,explanation:"A const object cannot be modified after initialisation. Drop const, or compute a new value instead of reassigning."},{id:"r0-sum-vector-order",kind:"parsons",region:"R0",tags:["vector","loops","parsons"],prompt:"Put the lines in order so the program prints the sum of the vector.",lines:["#include <iostream>","#include <vector>","int main() {","    std::vector<int> v = {4, 8, 15, 16};","    long long sum = 0;","    for (int x : v) sum += x;",'    std::cout << sum << "\\n";',"}"],explanation:"Headers first, then main: build the data, initialise the accumulator before the loop, loop, print. Declaring sum after the loop would not compile."},{id:"r0-count-up-cloze",kind:"cloze",region:"R0",tags:["loops","cloze"],prompt:"Fill the blanks so it prints 0 1 2 3 4 (one per line).",template:`#include <iostream>
int main() {
    int n = 5;
    for (int i = ___; i ___ n; ++i) {
        std::cout << i << "\\n";
    }
}
`,blanks:[["0"],["<"]],explanation:"Zero-based loops start at 0 and use i < n, so exactly n iterations run. i <= n would print 5 as well."}];e.s(["f",0,b],77421);let v=[...b,...p,...m,...g,...f,...h],w=d.default;e.s(["_",0,v,"F",0,w],7583)},82134,(e,t,n)=>{t.exports={"r0-vector-header":{},"r0-contiguous":{},"r0-int-division":{output:"3\n2\n"},"r0-loop-sum":{output:"22\n"},"r0-scope-error":{diagnostic:"line 5: 'i' was not declared in this scope"},"r0-const-error":{diagnostic:"line 3: assignment of read-only variable 'limit'"},"r0-sum-vector-order":{output:"43\n"},"r0-count-up-cloze":{output:"0\n1\n2\n3\n4\n"},"s1-endl-vs-newline":{},"s1-sync-stdio":{},"s1-wide-types":{},"s1-unsigned-wrap":{output:"4294967295\n"},"s1-negative-mod":{output:"-3\n-1\n1\n"},"s1-int-division-double":{output:"3\n3.5\n"},"s1-auto-sizeof":{output:"4\n8\n8\n1\n"},"s1-halving-steps":{output:"4\n"},"s1-literal-1e9":{output:"5000000000\n"},"s1-narrowing-error":{diagnostic:"line 2: narrowing conversion of '3.5e+0' from 'double' to 'int' [-Wnarrowing]"},"s1-missing-include":{diagnostic:"line 4: 'vector' was not declared in this scope"},"s1-auto-noinit-error":{diagnostic:"line 2: declaration of 'auto total' has no initializer"},"s1-big-sum-order":{output:"7000000000\n"},"s1-fast-io-cloze":{output:"ready\n"},"s1-widen-cloze":{output:"10000000000\n"},"s2-switch-fallthrough":{output:"two\nthree\n"},"s2-dangling-else":{output:"B\nC\n"},"s2-continue-trace":{output:"27\n"},"s2-break-nested":{},"s2-switch-types":{},"s2-switch-init-error":{diagnostic:"line 7: jump to case label"},"s2-by-value-tle":{},"s2-ref-vs-value":{output:"5\n6\n"},"s2-const-ref-error":{diagnostic:"line 3: passing 'const std::vector<int>' as 'this' argument discards qualifiers [-fpermissive]"},"s2-overload-pick":{output:"int\nlong long\nint\ndouble\n"},"s2-default-arg-cloze":{output:"70 21\n"},"s2-recursion-trace":{output:"13\n"},"s2-missing-base-case":{},"s2-static-local":{output:"1\n2\n3\n"},"s2-digit-sum-parsons":{output:"10\n"},"s3-ctor-forms":{output:"5 1 5 9\n"},"s3-reserve-resize":{output:"0\n4 0 4\n"},"s3-oob-index":{},"s3-size-unsigned":{},"s3-2d-init":{},"s3-erase-cost":{},"s3-auto-ref":{output:"2 4 6 \n"},"s3-const-auto-error":{diagnostic:"line 5: assignment of read-only reference 'x'"},"s3-substr-args":{output:"ter|view||iew\n"},"s3-find-npos":{output:"2 5 1\n"},"s3-char-arith":{output:"d 22 e 101\n"},"s3-to-string-stoi":{output:"2 79\n"},"s3-substr-tle":{},"s3-letter-count-cloze":{output:"32\n"},"s3-split-parsons":{output:"3 5 4 \n"},"s4-struct-class-access":{},"s4-init-order":{output:"12\n"},"s4-this-shadow":{output:"1\n"},"s4-no-default-ctor":{diagnostic:"line 6: no matching function for call to 'P::P()'"},"s4-operator-less":{output:"abc\n"},"s4-nullptr":{},"s4-list-walk":{output:"123\n"},"s4-dummy-head":{},"s4-new-pointer":{diagnostic:"line 7: conversion from 'ListNode*' to non-scalar type 'ListNode' requested"},"s4-append-parsons":{output:"1 2 3 \n"},"s4-tree-height":{output:"3 2 0\n"},"s4-arrow-dot":{diagnostic:"line 9: request for member 'val' in 'p', which is of pointer type 'TreeNode*' (maybe you meant to use '->' ?)"},"s4-tree-null-base":{},"s4-leaf-cloze":{output:"2\n"},"s4-solution-private":{diagnostic:"line 6: 'int Solution::twice(int)' is private within this context"},"forge-accumulate-trace-basic":{output:"12\n"},"forge-accumulate-trace-boundary":{output:"12\n"},"forge-accumulate-trace-wide":{output:"4000000000\n"},"forge-accumulate-trace-adds":{output:"5 3\n"},"forge-accumulate-trace-empty":{output:"0 0\n"}}}]);