(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,93432,45065,77421,7583,e=>{"use strict";var t=e.i(43476),n=e.i(71645);function i(e){return e.split("\n").map(e=>e.trim().replace(/\s+/g," ")).join("\n").replace(/\n+$/,"")}let o=e=>e.trim().replace(/\s+/g," ");function s(e,t,n){if(t.kind!==e.kind)throw Error(`response ${t.kind} does not match card ${e.id} (${e.kind})`);switch(e.kind){case"mcq":case"compilerError":return{correct:t.choice===e.answer,parts:[]};case"multi":{let n=[...new Set(t.choices)].sort(),i=[...e.answers].sort(),o=e.choices.map((e,t)=>n.includes(t)===i.includes(t));return{correct:o.every(Boolean),parts:o}}case"predict":case"trace":{let o=n[e.id]?.output;if(void 0===o)throw Error(`card ${e.id} has no computed output`);return{correct:i(t.text)===i(o),parts:[]}}case"parsons":{let n=t.lines.map(e=>e.trimEnd()),i=e.lines.map((e,t)=>n[t]===e.trimEnd());return{correct:n.length===e.lines.length&&i.every(Boolean),parts:i}}case"cloze":{let n=t.blanks,i=e.blanks.map((e,t)=>e.some(e=>o(e)===o(n[t]??"")));return{correct:i.every(Boolean),parts:i}}}}e.s(["J",0,"___","Y",0,function(e,t){let n=0;return e.replace(/___/g,()=>t[n++]??"")},"w",0,s],45065);var a=e.i(94801);function r({code:e,numbered:n}){let i=e.replace(/\n$/,"").split("\n");return(0,t.jsx)("pre",{className:"overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono [font-variant-ligatures:none] text-[13px] leading-5","aria-label":"code",children:i.map((e,i)=>(0,t.jsxs)("div",{children:[n&&(0,t.jsx)("span",{className:"mr-3 inline-block w-5 select-none text-right opacity-40",children:i+1}),e||" "]},i))})}let d=(e,t)=>`min-h-11 w-full rounded border px-3 py-2 text-left text-sm ${"right"===t?"border-emerald-400 bg-emerald-500/20":"wrong"===t?"border-rose-400 bg-rose-500/20":e?"border-[var(--accent)] bg-[var(--accent)]/15":"border-white/15 bg-black/25"}`;function l({card:e,computed:i,seed:o,locked:s,grade:c,onChange:h,onSubmit:p}){let[u,m]=(0,n.useState)(null),[g,f]=(0,n.useState)([]),[w,b]=(0,n.useState)(""),[v,y]=(0,n.useState)(()=>"cloze"===e.kind?e.blanks.map(()=>""):[]),k=(0,n.useMemo)(()=>"parsons"===e.kind?function(e,t){let n=e.lines.join("\n");for(let i=0;i<50;++i){let i=t.shuffle(e.lines);if(i.join("\n")!==n)return i}return[...e.lines].reverse()}(e,(0,a.f)(o)):[],[e,o]),[x,q]=(0,n.useState)([]);if("mcq"===e.kind||"compilerError"===e.kind)return(0,t.jsxs)(t.Fragment,{children:["compilerError"===e.kind&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r,{code:e.code,numbered:!0}),(0,t.jsxs)("div",{className:"rounded border border-rose-400/40 bg-rose-500/10 p-2 font-mono text-xs","data-testid":"diagnostic",children:[(0,t.jsx)("span",{className:"opacity-60",children:"g++ says: "}),i[e.id]?.diagnostic]})]}),(0,t.jsx)("div",{className:"flex flex-col gap-2",role:"radiogroup","aria-label":"choices",children:e.choices.map((n,i)=>(0,t.jsx)("button",{role:"radio","aria-checked":u===i,className:d(u===i,s?i===e.answer?"right":u===i?"wrong":"idle":"idle"),onClick:()=>{!s&&(m(i),h({kind:e.kind,choice:i}))},children:n},i))})]});if("multi"===e.kind)return(0,t.jsxs)("div",{className:"flex flex-col gap-2",role:"group","aria-label":"choices",children:[(0,t.jsx)("p",{className:"text-xs opacity-60",children:"Select all that apply."}),e.choices.map((e,n)=>(0,t.jsxs)("button",{role:"checkbox","aria-checked":g.includes(n),className:d(g.includes(n),s?c?.parts[n]?"right":"wrong":"idle"),onClick:()=>(e=>{if(s)return;let t=g.includes(e)?g.filter(t=>t!==e):[...g,e];f(t),h(t.length?{kind:"multi",choices:t}:null)})(n),children:[(0,t.jsx)("span",{className:"mr-2 font-mono",children:g.includes(n)?"[x]":"[ ]"}),e]},n))]});if("predict"===e.kind||"trace"===e.kind)return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r,{code:e.code}),(0,t.jsxs)("label",{className:"flex flex-col gap-1 text-xs",children:[(0,t.jsx)("span",{className:"opacity-70",children:"Program output (one line per output line)"}),(0,t.jsx)("textarea",{className:"min-h-24 rounded border border-white/15 bg-black/40 p-2 font-mono text-sm",value:w,disabled:s,rows:"trace"===e.kind?1:3,onChange:t=>{b(t.target.value),h(t.target.value.trim()?{kind:e.kind,text:t.target.value}:null)},onKeyDown:e=>{"Enter"===e.key&&(e.ctrlKey||e.metaKey)&&p()}})]}),s&&c&&!c.correct&&(0,t.jsxs)("div",{className:"rounded border border-emerald-400/50 bg-emerald-500/10 p-2 font-mono text-xs","data-testid":"expected",children:["Real output: ",i[e.id]?.output?.trimEnd().replace(/\n/g," ⏎ ")]})]});if("parsons"===e.kind)return(0,t.jsxs)("div",{className:"grid gap-3 sm:grid-cols-2",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h4",{className:"mb-1 font-display text-xs uppercase tracking-wider opacity-70",children:"Lines"}),(0,t.jsx)("div",{className:"flex flex-col gap-1",children:k.map((e,n)=>(0,t.jsx)("button",{disabled:x.includes(n)||s,className:"min-h-11 rounded border border-white/15 bg-black/30 px-2 text-left font-mono text-xs disabled:opacity-25",onClick:()=>(e=>{if(s||x.includes(e))return;let t=[...x,e];q(t),h(t.length===k.length?{kind:"parsons",lines:t.map(e=>k[e])}:null)})(n),children:e},n))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h4",{className:"mb-1 font-display text-xs uppercase tracking-wider opacity-70",children:"Your program (tap a line to remove it)"}),(0,t.jsxs)("div",{className:"flex flex-col gap-1","data-testid":"parsons-answer",children:[x.map((e,n)=>{let i=s&&c?c.parts[n]?"right":"wrong":"idle";return(0,t.jsx)("button",{className:`${d(!1,i)} font-mono text-xs`,onClick:()=>{s||(q(x.filter((e,t)=>t!==n)),h(null))},children:k[e]},n)}),0===x.length&&(0,t.jsx)("p",{className:"rounded border border-dashed border-white/20 p-3 text-xs opacity-60",children:"Tap lines on the left in the order they should run."})]})]})]});let T=e.template.replace(/\n$/,"").split("___");return(0,t.jsx)("pre",{className:"overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono [font-variant-ligatures:none] text-[12px] leading-6","aria-label":"code with blanks",children:T.map((e,n)=>(0,t.jsxs)("span",{children:[e,n<T.length-1&&(0,t.jsx)("input",{"aria-label":`blank ${n+1}`,className:`mx-0.5 h-7 w-10 rounded border bg-black/60 px-1 text-center font-mono [font-variant-ligatures:none] text-[13px] ${s&&c?c.parts[n]?"border-emerald-400":"border-rose-400":"border-[var(--accent)]"}`,value:v[n],disabled:s,autoCapitalize:"off",autoCorrect:"off",spellCheck:!1,onChange:e=>{var t;let i;return t=e.target.value,void((i=v.slice())[n]=t,y(i),h(i.every(e=>e.trim())?{kind:"cloze",blanks:i}:null))},onKeyDown:e=>{"Enter"===e.key&&p()}})]},n))})}e.s(["f",0,function({cards:e,computed:i,size:o=5,seed:r=1,onFinish:d}){let c=(0,n.useMemo)(()=>(function(e,t,n,i=new Set){return[...n.shuffle(e.filter(e=>!i.has(e.id))),...n.shuffle(e.filter(e=>i.has(e.id)))].slice(0,t)})(e,o,(0,a.f)(r)),[e,o,r]),[h,p]=(0,n.useState)(0),[u,m]=(0,n.useState)(null),[g,f]=(0,n.useState)(null),[w,b]=(0,n.useState)({total:0,correct:0,xp:0,bestStreak:0}),[v,y]=(0,n.useState)(0),[k,x]=(0,n.useState)(!1),q=c[h],T=()=>{if(!u||g)return;let e=s(q,u,i),t=e.correct?v+1:0;f(e),y(t),b(n=>{var i;return{total:n.total+1,correct:n.correct+ +!!e.correct,xp:n.xp+(i=e.correct,i?15+Math.min(5,Math.max(0,v)):2),bestStreak:Math.max(n.bestStreak,t)}})};return k?(0,t.jsxs)("section",{className:"panel mx-auto flex w-full min-w-0 max-w-xl flex-col gap-3 p-4","aria-label":"Card results","data-testid":"card-results",children:[(0,t.jsx)("h2",{className:"font-display text-xl text-[var(--gold)]",children:w.correct===w.total?"Flawless!":"Encounter cleared"}),(0,t.jsxs)("p",{className:"text-sm",children:[w.correct," / ",w.total," correct · best streak ",w.bestStreak," · ",(0,t.jsxs)("strong",{className:"text-[var(--gold)]",children:["+",w.xp," XP"]})]}),(0,t.jsx)("button",{className:"px-btn px-btn-primary min-h-11 px-4",onClick:()=>{p(0),m(null),f(null),b({total:0,correct:0,xp:0,bestStreak:0}),y(0),x(!1)},children:"Again"})]}):(0,t.jsxs)("section",{className:"panel mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-3 p-4","aria-label":"Concept card",children:[(0,t.jsxs)("header",{className:"flex items-center justify-between text-xs",children:[(0,t.jsxs)("span",{className:"font-display uppercase tracking-wider opacity-70",children:["Card ",h+1," / ",c.length]}),(0,t.jsxs)("span",{children:["Streak ",v," · ",w.xp," XP"]})]}),(0,t.jsx)("h2",{className:"font-display text-lg text-[var(--gold)]",children:q.prompt}),(0,t.jsx)(l,{card:q,computed:i,seed:131*r+h,locked:!!g,grade:g,onChange:m,onSubmit:T},q.id+h),g?(0,t.jsxs)("div",{className:`rounded border p-3 text-sm ${g.correct?"border-emerald-400/60 bg-emerald-500/10":"border-rose-400/60 bg-rose-500/10"}`,role:"status","data-testid":"feedback",children:[(0,t.jsx)("strong",{children:g.correct?"Correct!":"Not quite."})," ",q.explanation]}):null,(0,t.jsx)("div",{className:"flex justify-end gap-2",children:g?(0,t.jsx)("button",{className:"px-btn px-btn-primary min-h-11 px-5",onClick:()=>{if(h+1>=c.length){x(!0),d?.(w);return}p(h+1),m(null),f(null)},children:h+1>=c.length?"Finish":"Next"}):(0,t.jsx)("button",{className:"px-btn px-btn-primary min-h-11 px-5",disabled:!u,onClick:T,children:"Check"})})]})}],93432);var c=e.i(82134);let h=`#include <iostream>
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
`,p=[{id:"forge-accumulate-trace-basic",kind:"trace",region:"R0",tags:["forge","accumulate","trace"],prompt:"What does this program print?",code:`${h}
int main() {
    cout << Solution().pouchSum({5, 1, 7, 3}, 4) << "\\n";
}
`,explanation:"The 5 and the 7 pass the filter (>= 4); the 1 and the 3 are skipped. 5 + 7 = 12."},{id:"forge-accumulate-trace-boundary",kind:"trace",region:"R0",tags:["forge","accumulate","boundary"],prompt:"Every coin equals minValue. What is printed?",code:`${h}
int main() {
    cout << Solution().pouchSum({4, 4, 4}, 4) << "\\n";
}
`,explanation:'"At least" means >=, so a coin exactly equal to minValue is accepted: 4 + 4 + 4 = 12. With a strict > the answer would be 0.'},{id:"forge-accumulate-trace-wide",kind:"trace",region:"R0",tags:["forge","accumulate","long-long"],prompt:"Two heavy coins. What is printed?",code:`${h}
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
`,explanation:"The loop looks at all 5 coins. The 5, the 7 and the 4 pass (>= 4), the 1 and the 3 do not, so the addition runs 3 times."},{id:"forge-accumulate-trace-empty",kind:"trace",region:"R0",tags:["forge","accumulate","edge"],prompt:"No coin reaches minValue. What is printed?",code:`${h}
int main() {
    cout << Solution().pouchSum({1, 2, 3}, 10) << " " << Solution().pouchSum({}, 0) << "\\n";
}
`,explanation:"Nothing passes the filter and an empty pouch has nothing to loop over, so `total` keeps its initial 0 both times. Initialising the accumulator to 0 is what makes the empty case free."}],u=[{maxN:10,fits:"O(n!)",patterns:"permutations, brute-force search"},{maxN:20,fits:"O(2^n)",patterns:"subsets, bitmask DP, meet in the middle"},{maxN:500,fits:"O(n^3)",patterns:"triple loops, Floyd–Warshall, interval DP"},{maxN:5e3,fits:"O(n^2)",patterns:"pair loops, 2-D DP"},{maxN:1e6,fits:"O(n log n)",patterns:"sorting, heaps, binary search per element, segment trees"},{maxN:1e8,fits:"O(n)",patterns:"one pass, prefix sums, two pointers, sieve"},{maxN:1/0,fits:"O(log n) or O(1)",patterns:"binary search, closed-form maths"}];function m(e){var t,n;let i,o,s,a,r,d=e.k??0;if(!(e.a>=1)||!(e.b>1)||e.c<0||d<0)throw RangeError("need a ≥ 1, b > 1, c ≥ 0, k ≥ 0");let l=Math.log(e.a)/Math.log(e.b);return 1e-9>Math.abs(e.c-l)?(i=e.c,o=d+1,s=2):e.c<l?(i=l,o=0,s=1):(i=e.c,o=d,s=3),{nExp:i,logExp:o,case:s,theta:(t=i,n=o,a=e=>1e-9>Math.abs(e-Math.round(e))?String(Math.round(e)):e.toFixed(3).replace(/0+$/,""),r=[],Math.abs(t)>1e-9&&r.push(1e-9>Math.abs(t-1)?"n":`n^${a(t)}`),Math.abs(n)>1e-9&&r.push(1e-9>Math.abs(n-1)?"log n":`log^${a(n)} n`),`Θ(${r.length?r.join(" "):"1"})`)}}let g=[{id:"r1-drop-constants",kind:"mcq",region:"R1",tags:["big-o"],prompt:"A loop nest does exactly 3n² + 50n + 7 basic steps. Which bound is the tightest one a reviewer expects you to state?",choices:["O(n)","O(n²)","O(n³)","O(3n²)"],answer:1,explanation:"Big-O keeps the fastest-growing term and drops constant factors and lower terms: for large n the n² term dominates, so the cost is O(n²). `O(3n²)` is true but not written that way, and O(n³) is a valid upper bound but not tight."},{id:"r1-triangle-loop",kind:"predict",region:"R1",tags:["loops","counting"],prompt:"How many times does the counter increase? (Then notice: this is n(n-1)/2, so the loop is O(n²).)",code:`#include <iostream>
int main() {
    int n = 10, count = 0;
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < i; ++j)
            ++count;
    std::cout << count << '\\n';
}
`,explanation:"The inner loop runs i times for each i, so the total is 0 + 1 + … + (n-1) = n(n-1)/2. A dependent inner bound does not make the loop cheaper in Big-O: n²/2 is still Θ(n²)."},{id:"r1-halving-loop",kind:"predict",region:"R1",tags:["loops","log"],prompt:"What does this program print?",code:`#include <iostream>
int main() {
    int n = 1000, steps = 0;
    while (n > 1) {
        n /= 2;
        ++steps;
    }
    std::cout << steps << '\\n';
}
`,explanation:"Each pass halves n, so the number of passes is about log₂ n (log₂ 1000 ≈ 9.97, and integer division rounds down along the way). A loop that divides or multiplies its variable by a constant factor is O(log n)."},{id:"r1-sqrt-loop",kind:"predict",region:"R1",tags:["loops","sqrt"],prompt:"What does this program print?",code:`#include <iostream>
int main() {
    long long n = 1000000;
    int steps = 0;
    for (long long d = 1; d * d <= n; ++d) ++steps;
    std::cout << steps << '\\n';
}
`,explanation:"The loop stops when d² exceeds n, so it runs about √n times (√1 000 000 = 1000). Trial division up to √n is the classic O(√n) loop."},{id:"r1-amortized-push",kind:"mcq",region:"R1",tags:["amortised","vector"],prompt:"A std::vector doubles its capacity when full. What is the amortised cost of one push_back, and the worst-case cost of a single one?",choices:["Amortised O(1); a single push_back can cost O(n) when it reallocates","Amortised O(log n); a single push_back always costs O(log n)","Amortised O(n); a single push_back always costs O(n)","Amortised O(1); a single push_back always costs O(1)"],answer:0,explanation:"Reallocation copies all n elements, but it happens after 1, 2, 4, 8, … pushes, so n pushes copy at most 1 + 2 + 4 + … + n < 2n elements in total. Spread over n pushes that is O(1) each, even though one unlucky push costs O(n). Say 'amortised' out loud in interviews."},{id:"r1-sort-then-scan",kind:"mcq",region:"R1",tags:["big-o","sorting"],prompt:"An algorithm sorts n numbers with std::sort and then makes one linear pass. What is the total time?",choices:["O(n)","O(n log n)","O(n²)","O(n log² n)"],answer:1,explanation:"Costs of sequential steps add, and the larger one wins: O(n log n) + O(n) = O(n log n). Sorting is the bottleneck, which is why 'sort first' is only a good idea when n log n fits the budget."},{id:"r1-bsearch-in-loop",kind:"mcq",region:"R1",tags:["big-o","nested"],prompt:"For each of the n values in an unsorted array, the code runs a binary search over a second sorted array of size n. What is the total time?",choices:["O(log n)","O(n)","O(n log n)","O(n²)"],answer:2,explanation:"Costs of nested work multiply: n iterations times O(log n) per search is O(n log n). (If the second array were also searched linearly, it would be O(n²).)"},{id:"r1-recursion-space",kind:"mcq",region:"R1",tags:["space","recursion"],prompt:"A recursive function walks a linked list of n nodes, making one call per node and allocating nothing. What is its extra space?",choices:["O(1)","O(log n)","O(n), because each pending call keeps a stack frame","O(n²)"],answer:2,explanation:"Space counts the call stack too. n nested calls are alive at the deepest point, so the extra space is O(n), and a long list can overflow the stack. Rewriting it as a loop gives O(1) extra space."},{id:"r1-which-linear",kind:"multi",region:"R1",tags:["big-o"],prompt:"Select every snippet that is O(n) in the worst case, where n is the vector's size.",choices:["One pass summing all elements","Two separate passes, one after the other","A pass that calls v.insert(v.begin(), x) at every step","Counting the frequency of each value with an unordered_map (average case)"],answers:[0,1,3],explanation:"Sequential passes add: 2n is still O(n), and a hash-map count is O(1) average per element. Inserting at the front of a vector shifts every element, so doing it n times costs O(n²)."}],f=u.map(e=>e.fits),w=[...g,...[8,20,400,3e3,2e5,4e7].map((e,t)=>{let n=function(e){if(!(e>=1))throw RangeError("n must be at least 1");return u.find(t=>e<=t.maxN)}(e),i=f.indexOf(n.fits),o=[...new Set([i,i+1,i-1,i>=3?0:6].filter(e=>e>=0&&e<f.length))].sort((e,t)=>e-t).map(e=>f[e]),s=e>=1e3?e.toLocaleString("en-US").replace(/,/g," "):String(e);return{id:`r1-budget-${t+1}`,kind:"mcq",region:"R1",tags:["constraints","budget"],prompt:`A problem says 1 ≤ n ≤ ${s} and allows 1–2 seconds. What is the slowest complexity class you can afford?`,choices:o,answer:o.indexOf(n.fits),explanation:`About 10⁸ simple operations fit in a second, so ${n.fits} is the slowest class that fits at n = ${s}. Typical patterns at this size: ${n.patterns}. Reading the constraints first tells you which algorithm the setter expects.`}}),...[{name:"T(n) = T(n/2) + 1",rec:{a:1,b:2,c:0},where:"binary search"},{name:"T(n) = 2T(n/2) + n",rec:{a:2,b:2,c:1},where:"merge sort"},{name:"T(n) = 2T(n/2) + 1",rec:{a:2,b:2,c:0},where:"tree traversal / build a heap top-down"},{name:"T(n) = T(n/2) + n",rec:{a:1,b:2,c:1},where:"quickselect with perfect pivots"},{name:"T(n) = 4T(n/2) + n",rec:{a:4,b:2,c:1},where:"naive polynomial multiply by splitting"},{name:"T(n) = 3T(n/2) + n",rec:{a:3,b:2,c:1},where:"Karatsuba"}].map((e,t)=>{let n=m(e.rec).theta,i=["Θ(log n)","Θ(n)","Θ(n log n)","Θ(n^2)","Θ(n^1.585)"],o=i.filter(e=>e===n||"Θ(n^1.585)"!==e&&i.indexOf(e)!==(i.indexOf(n)+3)%i.length).slice(0,4);o.includes(n)||(o[o.length-1]=n);let s=m(e.rec),a=1===s.case?"the leaves dominate: the work grows geometrically toward the bottom of the recursion tree":2===s.case?"every level of the recursion tree does the same total work, so multiply that work by the number of levels":"the root dominates: the work shrinks geometrically down the recursion tree";return{id:`r1-recurrence-${t+1}`,kind:"mcq",region:"R1",tags:["recurrence","master-theorem"],prompt:`Solve ${e.name} (with T(1) = 1). Where have you seen it? ${e.where}.`,choices:o,answer:o.indexOf(n),explanation:`With a = ${e.rec.a}, b = ${e.rec.b} the leaves cost n^${+(Math.log(e.rec.a)/Math.log(e.rec.b)).toFixed(3)} and the combine step is n^${e.rec.c}; ${a}. The answer is ${n}.`}})],b=[{id:"r2-hash-signal",kind:"mcq",region:"R2",tags:["hashing","recognition"],prompt:"Which phrase in a problem statement most strongly suggests a hash map or set?",choices:["The array is sorted in ascending order","Report the first value that has appeared before","Find the contiguous block with the largest total","Do it in place with O(1) extra memory"],answer:1,explanation:"'Appeared before', 'pair summing to', 'group by' and 'count how many' are lookup questions: remember what you have seen. Sorted input points to two pointers or binary search, a best contiguous block to Kadane, and O(1) extra memory rules the hash table out."},{id:"r2-hash-cost",kind:"mcq",region:"R2",tags:["hashing","big-o"],prompt:"A pair-sum scan stores every value in an unordered_set and looks up target - x for each x. What are the time and extra space?",choices:["O(n) average time, O(n) space","O(n log n) time, O(1) space","O(n²) time, O(n) space","O(n) worst-case time, O(1) space"],answer:0,explanation:"Each of the n lookups and inserts is O(1) on average, so the pass is O(n), and the set can hold n values. The worst case degrades if many keys collide, which is why interviewers want 'average' said out loud."},{id:"r2-map-bracket-insert",kind:"predict",region:"R2",tags:["unordered_map","operator-brackets"],prompt:"What does this program print?",code:`#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<int, int> m;
    m[1] = 10;
    int a = m[2];            // read a key that is missing
    std::cout << a << ' ' << m.size() << '\\n';
}
`,explanation:"`operator[]` inserts a missing key with a value-initialised `0`, so reading key 2 both returns 0 and grows the map to two entries. Use `find` or `count` to ask without inserting."},{id:"r2-count-loop",kind:"predict",region:"R2",tags:["frequency-map"],prompt:"What does this program print?",code:`#include <iostream>
#include <string>
#include <unordered_map>

int main() {
    std::string s = "banana";
    std::unordered_map<char, int> freq;
    for (char c : s) ++freq[c];
    std::cout << freq['a'] << ' ' << freq['n'] << ' ' << freq['b'] << ' ' << freq.size() << '\\n';
}
`,explanation:"'a' appears 3 times, 'n' twice, 'b' once, and there are 3 distinct letters. `++freq[c]` is the standard frequency idiom because a missing key starts at 0."},{id:"r2-pair-complement",kind:"parsons",region:"R2",tags:["pair-sum","parsons"],prompt:"Order the lines so the program prints the index pair (2 sum to 9) found in one pass.",lines:["#include <iostream>","#include <unordered_map>","#include <vector>","int main() {","    std::vector<int> a = {2, 7, 11, 15};","    std::unordered_map<int, int> idx;","    for (int i = 0; i < 4; ++i) {","        auto it = idx.find(9 - a[i]);","        if (it != idx.end()) { std::cout << it->second << ' ' << i << \"\\n\"; break; }","        idx[a[i]] = i;","    }","}"],explanation:"Look the complement up first, then insert the current value. Inserting before the lookup would let an element pair with itself (for example target 8 with a 4 in the array)."},{id:"r2-set-insert-result",kind:"predict",region:"R2",tags:["unordered_set","duplicates"],prompt:"What does this program print? (insert returns a pair whose .second says whether a new element was added.)",code:`#include <iostream>
#include <unordered_set>

int main() {
    std::unordered_set<int> s;
    int values[] = {5, 3, 5, 8, 3};
    for (int v : values) std::cout << s.insert(v).second;
    std::cout << '\\n';
}
`,explanation:"The first 5, 3 and 8 are new (1), the repeated 5 and 3 are not (0). Checking `insert(v).second` finds the first duplicate in a single hash operation per element."},{id:"r2-hash-pair-order",kind:"mcq",region:"R2",tags:["pair-sum","hashing"],prompt:"In the one-pass pair-sum loop, why do you look up the complement before inserting the current value?",choices:["So an element cannot pair with itself","Because insert invalidates every iterator","To keep the map sorted","It makes the lookup O(1) instead of O(log n)"],answer:0,explanation:"If x were inserted first, target - x could match x itself when target = 2x, counting one element as a pair. Looking first only sees earlier elements, and every valid pair is still found when its later element arrives."},{id:"r2-find-vs-count",kind:"multi",region:"R2",tags:["unordered_map","api"],prompt:"Select every expression that tests whether key k is in an unordered_map m WITHOUT inserting it.",choices:["m.count(k) > 0","m.find(k) != m.end()","m[k] != 0","m.contains(k)  (C++20)","m.at(k) != 0"],answers:[0,1,3],explanation:"`count`, `find` and C++20 `contains` only look. `m[k]` inserts a zero when the key is missing, and `m.at(k)` throws std::out_of_range instead of answering false."},{id:"r2-hash-key-sorted",kind:"cloze",region:"R2",tags:["grouping","canonical-key"],prompt:"Fill the blanks so the program groups anagrams under a sorted-letters key and prints how many groups there are.",template:`#include <algorithm>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<std::string> words = {"eat", "tea", "tan", "ate", "nat", "bat"};
    std::unordered_map<std::string, std::vector<std::string>> groups;
    for (const auto& w : words) {
        std::string key = w;
        ___(key.begin(), key.end());
        groups[key].___(w);
    }
    std::cout << groups.size() << "\\n";
}
`,blanks:[["std::sort","sort"],["push_back","emplace_back"]],explanation:"The sorted letters are the same for every anagram of a word, so they make a canonical key; each group collects its words in a vector. Three keys (aet, ant, abt) give three groups."},{id:"r2-hash-const-bracket",kind:"compilerError",region:"R2",tags:["const","unordered_map","compiler-errors"],prompt:"This helper does not compile. What is the cause?",code:`#include <string>
#include <unordered_map>

int countOf(const std::unordered_map<std::string, int>& m, const std::string& k) {
    return m[k];
}

int main() {
    std::unordered_map<std::string, int> m{{"a", 1}};
    return countOf(m, "a");
}
`,choices:["operator[] may insert, so it cannot be called on a const map","The key must be a char, not a string","countOf must return a reference","unordered_map needs a custom hash for string"],answer:0,explanation:"`operator[]` is a non-const member because it can insert. For a const map use `find` (then `it->second`), `count`, or `at(k)` if throwing on a missing key is acceptable."},{id:"r2-hash-chain-start",kind:"mcq",region:"R2",tags:["hash-set","longest-consecutive"],prompt:"Longest consecutive run using an unordered_set: why is it O(n) even though a while loop sits inside the for loop?",choices:["Only values whose x - 1 is absent start a run, so each element is walked once","The while loop runs at most 26 times","The set keeps its elements sorted","Hash lookups cost O(1) so loops are free"],answer:0,explanation:"A run is only walked from its first element, and the walk visits each of its members once. Every element belongs to exactly one run, so the total over all starts is n steps plus n set lookups."},{id:"r2-hash-iteration-order",kind:"mcq",region:"R2",tags:["unordered_map","pitfalls"],prompt:"A solution prints the contents of an unordered_map by iterating it. What can you rely on?",choices:["Nothing: the order is unspecified, so sort first if the order matters","Keys come out in insertion order","Keys come out in ascending order","Keys come out in the order of their hash values, which is portable"],answer:0,explanation:"The order depends on the implementation, the bucket count and the history of inserts. For deterministic output copy to a vector and sort, or use std::map (ordered, O(log n) per operation)."},{id:"r2-tp-signal",kind:"mcq",region:"R2",tags:["two-pointers","recognition"],prompt:"Which statement is the best fit for two pointers moving inward from both ends?",choices:["Given a sorted array, find two values that add to a target using O(1) extra memory","Count subarrays whose sum equals k, with negative values","Group words made of the same letters","Find the largest sum of a contiguous block"],answer:0,explanation:"Sorted input plus a pair target plus a memory limit is the textbook case. The other three are prefix sums + hash map, hash grouping and Kadane."},{id:"r2-tp-why-move",kind:"mcq",region:"R2",tags:["two-pointers","correctness"],prompt:"In the sorted pair-sum scan, a[l] + a[r] is smaller than the target. Which pointer moves and why?",choices:["l moves right: a[l] with anything at or left of r is even smaller, so a[l] cannot be in an answer","r moves left: it makes the sum smaller","Both move: the pair is useless","Neither: stop and report no pair"],answer:0,explanation:"Because the array is sorted, a[r] is the largest value still available to pair with a[l]. If even that is too small, a[l] has no partner. Discarding it keeps the search space shrinking by one each step."},{id:"r2-tp-sorted-pair",kind:"trace",region:"R2",tags:["two-pointers","trace"],prompt:"What does this program print (the number of loop iterations)?",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {1, 2, 4, 7, 11, 15};
    int target = 15, l = 0, r = 5, steps = 0;
    while (l < r) {
        ++steps;
        int s = a[l] + a[r];
        if (s == target) break;
        if (s < target) ++l; else --r;
    }
    std::cout << steps << '\\n';
}
`,explanation:"The scan tests (1,15) too big, (1,11) too small, (2,11) too small, (4,11) = 15 found: four iterations. Each step either finds the pair or drops an element, so there are never more than n - 1 steps."},{id:"r2-tp-compact",kind:"predict",region:"R2",tags:["two-pointers","in-place"],prompt:"What does this program print?",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {3, 0, 3, 5, 0, 5};
    int write = 0;
    for (int read = 0; read < 6; ++read)
        if (a[read] != 0) a[write++] = a[read];
    std::cout << write << ' ' << a[0] << a[1] << a[2] << a[3] << '\\n';
}
`,explanation:"Four non-zero values are kept in order (3, 3, 5, 5), so write ends at 4 and the first four cells read 3355. The tail still holds old values; a real solution zero-fills it or just returns the length."},{id:"r2-tp-compact-order",kind:"parsons",region:"R2",tags:["two-pointers","parsons"],prompt:"Order the lines so the program removes the zeros in place and prints the new length.",lines:["#include <iostream>","#include <vector>","int main() {","    std::vector<int> a = {0, 1, 0, 2, 3};","    int write = 0;","    for (int read = 0; read < 5; ++read) {","        if (a[read] != 0) a[write++] = a[read];","    }",'    std::cout << write << "\\n";',"}"],explanation:"Initialise the write pointer before the loop, copy kept values forward as the read pointer scans, and print the count after the loop. Printing before the loop ends would show 0."},{id:"r2-tp-dedupe-3sum",kind:"mcq",region:"R2",tags:["two-pointers","3sum"],prompt:"In 3Sum (sort, fix i, scan l and r), what stops the same trio from being reported twice?",choices:["Skip equal values at i, and after a hit move l and r past equal neighbours","Store every trio in a vector and rely on == to dedupe","Use only one pointer","Nothing: duplicates are impossible after sorting"],answer:0,explanation:"Sorted equal values sit next to each other, so skipping them at the fixed index and after each hit removes duplicate trios in O(1) per skip. This keeps the total at O(n²) without a set of vectors."},{id:"r2-tp-water-move",kind:"mcq",region:"R2",tags:["two-pointers","container-water"],prompt:"Container with most water: at each step you move one pointer. Which one, and why is it safe?",choices:["The one at the shorter wall: the shorter wall limits every container it can still form, and width only shrinks","The one at the taller wall: it shrinks the width faster","Always the left one","Whichever gives the larger next area, found by looking ahead"],answer:0,explanation:"Area = width × min(heights). Keeping the shorter wall and moving the taller one only reduces width while the height limit stays at most the short wall, so no better container uses that short wall. Move it and continue."},{id:"r2-tp-trap-cost",kind:"mcq",region:"R2",tags:["two-pointers","trapping-rain-water","big-o"],prompt:"Trapping rain water with two pointers and a running maximum from each side: time and extra space?",choices:["O(n) time, O(1) space","O(n log n) time, O(n) space","O(n²) time, O(1) space","O(n) time, O(n) space"],answer:0,explanation:"One pass moves the pointer on the side with the smaller maximum, and the water above that cell is that maximum minus its height. Two integers for the maxima are all the extra memory; the O(n)-space version stores prefix and suffix maxima arrays."},{id:"r2-tp-dutch",kind:"trace",region:"R2",tags:["two-pointers","dutch-flag"],prompt:"What does this program print (the array after one pass of the three-pointer partition)?",code:`#include <iostream>
#include <utility>
#include <vector>

int main() {
    std::vector<int> a = {2, 0, 1, 2, 0, 1};
    int lo = 0, i = 0, hi = 5;
    while (i <= hi) {
        if (a[i] == 0) std::swap(a[lo++], a[i++]);
        else if (a[i] == 2) std::swap(a[i], a[hi--]);
        else ++i;
    }
    for (int x : a) std::cout << x;
    std::cout << '\\n';
}
`,explanation:"Zeros are swapped toward the front, twos toward the back, ones are skipped. After the pass the array is sorted: 001122. When a 2 is swapped in from the end, i does not advance because the value that arrived has not been checked."},{id:"r2-tp-boats",kind:"mcq",region:"R2",tags:["two-pointers","greedy"],prompt:"Boats carry at most two people and a weight limit. Sorted weights, lightest at l and heaviest at r. The pair does not fit. What do you do?",choices:["Send the heaviest alone and move r left","Send the lightest alone and move l right","Move both pointers","Swap them and retry"],answer:0,explanation:"If the heaviest cannot ride with the lightest, it cannot ride with anyone, so it takes its own boat. If they do fit, pair them and move both. Each step uses one boat, giving O(n log n) with the sort."},{id:"r2-tp-palindrome-skip",kind:"cloze",region:"R2",tags:["two-pointers","palindrome"],prompt:"Fill the blanks so it prints 1 when the string is a palindrome after ignoring non-letters.",template:`#include <cctype>
#include <iostream>
#include <string>

int main() {
    std::string s = "ab,Ba";
    int l = 0, r = static_cast<int>(s.size()) - 1;
    bool ok = true;
    while (l < r) {
        if (!std::isalpha(static_cast<unsigned char>(s[l]))) { ++l; continue; }
        if (!std::isalpha(static_cast<unsigned char>(s[r]))) { ___; continue; }
        if (std::tolower(static_cast<unsigned char>(s[l])) != std::tolower(static_cast<unsigned char>(s[r]))) ok = false;
        ++l;
        ___;
    }
    std::cout << ok << "\\n";
}
`,blanks:[["--r"],["--r"]],explanation:"Move the pointer that sits on a junk character; when both point at letters, compare them case-insensitively and then step both inward. Casting to unsigned char keeps isalpha and tolower defined for every char value."},{id:"r2-tp-sort-cost",kind:"mcq",region:"R2",tags:["two-pointers","big-o","sorting"],prompt:"Unsorted input: sort the array, then run the two-pointer pair scan. What is the total time?",choices:["O(n log n)","O(n)","O(n²)","O(log n)"],answer:0,explanation:"Sequential steps add and the larger one wins: the sort is O(n log n), the scan O(n). If you need the original indices of the pair, sorting loses them unless you sort indices instead, and a hash map is simpler."},{id:"r2-ps-signal",kind:"mcq",region:"R2",tags:["prefix-sum","recognition"],prompt:"An array never changes, and you must answer 10^5 queries, each asking for the sum between two positions. Which technique?",choices:["Prefix sums: O(n) to build, O(1) per query","Re-sum the range for each query: O(n) per query","A sliding window","A monotonic stack"],answer:0,explanation:"Many range-sum queries on fixed data is the prefix-sum signal. Re-summing costs O(n·q) = 10^10 here, far over budget."},{id:"r2-ps-build",kind:"predict",region:"R2",tags:["prefix-sum"],prompt:"What does this program print?",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {2, 5, 1, 4};
    std::vector<int> pre(a.size() + 1, 0);
    for (std::size_t i = 0; i < a.size(); ++i) pre[i + 1] = pre[i] + a[i];
    for (int x : pre) std::cout << x << ' ';
    std::cout << '\\n';
}
`,explanation:"pre[i] is the sum of the first i elements, so the table is 0, 2, 7, 8, 12 (the leading 0 is the empty prefix). Its length is n + 1, which is what makes the range formula uniform."},{id:"r2-ps-range",kind:"cloze",region:"R2",tags:["prefix-sum","cloze"],prompt:"Fill the blanks so it prints the sum of a[1..3] (inclusive) using the prefix table.",template:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {2, 5, 1, 4, 9};
    std::vector<int> pre = {0, 2, 7, 8, 12, 21};
    int l = 1, r = 3;
    std::cout << pre[___] - pre[___] << "\\n";
}
`,blanks:[["r + 1","r+1","4"],["l","1"]],explanation:"sum(a[l..r]) = pre[r + 1] - pre[l]. Here 12 - 2 = 10 = 5 + 1 + 4. Using pre[r] would drop the last element: the classic off-by-one."},{id:"r2-ps-subk-seed",kind:"mcq",region:"R2",tags:["prefix-sum","subarray-sum-k"],prompt:"Counting subarrays with sum k via prefix sums and a map. Why is the map initialised with {0: 1}?",choices:["So subarrays starting at index 0 are counted: they need the empty prefix 0","To avoid a division by zero","Because the map cannot be empty","To count the empty subarray in the answer"],answer:0,explanation:"A subarray a[0..i] has sum pre[i + 1] - 0, so it matches when pre[i + 1] - k equals the empty prefix. Without the seed, every subarray beginning at the front is missed and small tests may still pass."},{id:"r2-ps-subk-trace",kind:"predict",region:"R2",tags:["prefix-sum","subarray-sum-k"],prompt:"What does this program print (the number of subarrays with sum 3)?",code:`#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {1, 2, 3, -3, 3};
    int k = 3;
    std::unordered_map<int, int> seen{{0, 1}};
    int pre = 0, answer = 0;
    for (int x : a) {
        pre += x;
        auto it = seen.find(pre - k);
        if (it != seen.end()) answer += it->second;
        ++seen[pre];
    }
    std::cout << answer << '\\n';
}
`,explanation:"The qualifying subarrays are [1,2], [3], [1,2,3,-3], [3,-3,3] and the final [3]. The negative value shows why a sliding window fails here while prefix sums with counts still work."},{id:"r2-ps-negatives",kind:"mcq",region:"R2",tags:["prefix-sum","sliding-window"],prompt:"'Count subarrays with sum exactly k', values may be negative. Why can a plain two-pointer window not solve it?",choices:["Extending the window no longer always increases the sum, so you cannot decide which end to move","Windows only work on sorted arrays","Windows use too much memory","Windows cannot count, only maximise"],answer:0,explanation:"A window relies on monotonicity: add a positive value and the sum grows, drop one and it shrinks. Negatives break both. Prefix sums plus a hash map make no such assumption."},{id:"r2-diff-array",kind:"predict",region:"R2",tags:["difference-array"],prompt:"What does this program print?",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> d(6, 0);
    d[1] += 4; d[4] -= 4;      // add 4 to cells 1..3
    d[2] += 1; d[5] -= 1;      // add 1 to cells 2..4
    int run = 0;
    for (int i = 0; i < 5; ++i) { run += d[i]; std::cout << run << ' '; }
    std::cout << '\\n';
}
`,explanation:"Each update marks where an increase starts and ends; the running sum turns the marks into cell values: 0 4 5 5 1. Cell 4 gets only the +1 because the +4 ended before it."},{id:"r2-diff-order",kind:"parsons",region:"R2",tags:["difference-array","parsons"],prompt:"Order the lines so the program applies one range update (+7 on cells 1..2) and prints the rebuilt array.",lines:["#include <iostream>","#include <vector>","int main() {","    std::vector<int> d(5, 0);","    d[1] += 7;","    d[3] -= 7;","    int run = 0;","    for (int i = 0; i < 4; ++i) { run += d[i]; std::cout << run << ' '; }",'    std::cout << "\\n";',"}"],explanation:"Apply all the point updates first, then rebuild with one running sum. The difference array is sized n + 1 so d[r + 1] is always a valid index, even for a range ending at the last cell."},{id:"r2-kadane-restart",kind:"trace",region:"R2",tags:["kadane","trace"],prompt:"What does this program print?",code:`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {2, -5, 4, -1, 2, -3};
    int cur = a[0], best = a[0];
    for (std::size_t i = 1; i < a.size(); ++i) {
        cur = std::max(a[i], cur + a[i]);
        best = std::max(best, cur);
    }
    std::cout << best << '\\n';
}
`,explanation:"After the -5 the running sum (−3) is worse than starting fresh, so it restarts at 4, then grows to 3 and 5 at the next element. The best stretch is [4, -1, 2] with sum 5."},{id:"r2-kadane-negative",kind:"mcq",region:"R2",tags:["kadane","edge-cases"],prompt:"Why must Kadane start with cur = best = a[0] rather than 0 when the stretch must be non-empty?",choices:["With every value negative, starting at 0 would return 0, an empty stretch","Starting at 0 is slower","a[0] avoids integer overflow","It changes nothing"],answer:0,explanation:"For {-4, -2, -7} the correct answer is -2. A zero start never lets best go below 0, so it reports an empty stretch that is not allowed. Always test the all-negative case."},{id:"r2-circular",kind:"mcq",region:"R2",tags:["kadane","circular"],prompt:"Best subarray sum on a circular array. Which two candidates do you compare?",choices:["Plain Kadane maximum, and total sum minus the minimum stretch (with an all-negative guard)","Plain Kadane on the array doubled twice","The sum of the whole array, always","Maximum prefix minus minimum prefix, nothing else"],answer:0,explanation:"A circular best either does not wrap (ordinary Kadane) or wraps, in which case the unused middle is a minimum stretch, so the wrapped sum is total − minimum. If every value is negative the minimum stretch is the whole array and the wrap case would be empty, so return the plain Kadane answer."},{id:"r2-ps-overflow",kind:"mcq",region:"R2",tags:["prefix-sum","overflow"],prompt:"n = 10^5 values, each up to 10^9, are summed into prefix sums. What type should the prefix table use?",choices:["long long: the total can reach 10^14","int: values fit in 32 bits","unsigned int: the sums are non-negative","float: it holds large numbers"],answer:0,explanation:"Each value fits in an int but the sum can reach 10^14, far above 2.1·10^9. Signed overflow is undefined behaviour, so accumulate in long long and keep the table long long too."}],v=`#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    long long countStretches(vector<int> nums, long long target) {
        // seen[p] = how many prefixes so far (including the empty one) have total p.
        unordered_map<long long, long long> seen;
        seen[0] = 1;
        long long prefix = 0, count = 0;
        for (const int x : nums) {
            prefix += x;
            // A stretch ending here sums to target iff an earlier prefix equals prefix - target.
            const auto it = seen.find(prefix - target);
            if (it != seen.end()) count += it->second;
            ++seen[prefix];
        }
        return count;
    }
};
`,y=`#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    long long bestBasin(vector<int> heights) {
        int left = 0, right = static_cast<int>(heights.size()) - 1;
        long long best = 0;
        while (left < right) {
            const long long width = right - left;
            best = max(best, width * min(heights[left], heights[right]));
            // The shorter wall caps every basin it forms with anything closer, so it can never do better.
            if (heights[left] < heights[right]) ++left;
            else --right;
        }
        return best;
    }
};
`,k=[{id:"forge-prefix-hash-trace-basic",kind:"trace",region:"R2",tags:["forge","prefix-hash","trace"],prompt:"What does this program print?",code:`${v}
int main() {
    cout << Solution().countStretches({1, 2, 3}, 3) << "\\n";
}
`,explanation:"The stretches [1, 2] and [3] add to 3, so the answer is 2. [1, 2, 3] adds to 6."},{id:"forge-prefix-hash-trace-zeros",kind:"trace",region:"R2",tags:["forge","prefix-hash","trace"],prompt:"Every element is zero and the target is zero. What is printed?",code:`${v}
int main() {
    cout << Solution().countStretches({0, 0, 0}, 0) << "\\n";
}
`,explanation:"Every non-empty stretch sums to 0: three of length 1, two of length 2, one of length 3, so 6. The map counts duplicate prefixes (all 0), which is why we add the stored count and not just 1."},{id:"forge-prefix-hash-trace-negative",kind:"trace",region:"R2",tags:["forge","prefix-hash","trace"],prompt:"Negatives are allowed. What is printed?",code:`${v}
int main() {
    cout << Solution().countStretches({1, -1, 1, -1}, 0) << "\\n";
}
`,explanation:"Prefixes are 0, 1, 0, 1, 0. Pairs of equal prefixes are the zero-sum stretches: three 0s give 3 pairs, two 1s give 1 pair, so 4."},{id:"forge-prefix-hash-trace-none",kind:"trace",region:"R2",tags:["forge","prefix-hash","trace"],prompt:"No stretch reaches the target. What is printed?",code:`${v}
int main() {
    cout << Solution().countStretches({5, 6}, 100) << "\\n";
}
`,explanation:"No earlier prefix ever equals prefix - 100, so count stays 0. Using find means the misses do not insert anything into the map."},{id:"forge-prefix-hash-trace-wide",kind:"trace",region:"R2",tags:["forge","prefix-hash","trace"],prompt:"Large values and a long long target. What is printed?",code:`${v}
int main() {
    cout << Solution().countStretches({2000000000, 2000000000, 2000000000}, 4000000000LL) << "\\n";
}
`,explanation:"Prefixes are 2e9, 4e9, 6e9. The stretches [2e9, 2e9] starting at index 0 and at index 1 both sum to 4e9, so 2. The prefixes exceed int range, which is why they are long long."},{id:"forge-opposite-trace-basic",kind:"trace",region:"R2",tags:["forge","opposite","trace"],prompt:"What does this program print?",code:`${y}
int main() {
    cout << Solution().bestBasin({1, 8, 6, 2, 5, 4, 8, 3, 7}) << "\\n";
}
`,explanation:"The 8 at index 1 with the 7 at index 8 gives width 7 times height min(8, 7) = 7, so 49. The two 8s (indices 1 and 6) only give 5 * 8 = 40."},{id:"forge-opposite-trace-tie",kind:"trace",region:"R2",tags:["forge","opposite","trace"],prompt:"Three equal walls. What is printed?",code:`${y}
int main() {
    cout << Solution().bestBasin({5, 5, 5}) << "\\n";
}
`,explanation:"The outer pair has width 2 and height 5, so 10. When the walls tie, the else branch moves right inward, and the later pairs only get narrower."},{id:"forge-opposite-trace-single",kind:"trace",region:"R2",tags:["forge","opposite","trace"],prompt:"Only one wall. What is printed?",code:`${y}
int main() {
    cout << Solution().bestBasin({7}) << "\\n";
}
`,explanation:"left = 0 and right = 0, so the loop never runs and best stays 0. One wall cannot hold water."},{id:"forge-opposite-trace-valley",kind:"trace",region:"R2",tags:["forge","opposite","trace"],prompt:"Tall walls far apart, a low valley between. What is printed?",code:`${y}
int main() {
    cout << Solution().bestBasin({9, 1, 1, 1, 9}) << "\\n";
}
`,explanation:"The first pair is the two 9s at width 4: 4 * 9 = 36. Nothing narrower can do better."},{id:"forge-opposite-trace-wide",kind:"trace",region:"R2",tags:["forge","opposite","trace"],prompt:"Huge walls. What is printed?",code:`${y}
int main() {
    cout << Solution().bestBasin({2000000000, 0, 0, 0, 2000000000}) << "\\n";
}
`,explanation:"Width 4 times height 2e9 = 8e9, which needs long long. The width is widened before the multiplication, so nothing overflows."}],x=`#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    int longestTidy(string tape, int m) {
        int count[26] = {};  // occurrences of each letter inside the window [left, right]
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(tape.size()); ++right) {
            const int c = tape[right] - 'a';
            ++count[c];
            while (count[c] > m) {  // only the new letter can be over the limit
                --count[tape[left] - 'a'];
                ++left;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
`,q=`#include <deque>
#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> paneMaxima(vector<int> heat, int width) {
        const int n = static_cast<int>(heat.size());
        vector<int> answer;
        answer.reserve(n - width + 1);
        deque<int> window;  // indices; heat[] strictly non-increasing from front to back, front is the max
        for (int i = 0; i < n; ++i) {
            // A smaller pane to the left of i can never be the maximum again: i is hotter and leaves later.
            while (!window.empty() && heat[window.back()] <= heat[i]) window.pop_back();
            window.push_back(i);
            // The front may have slid out of the frame [i - width + 1, i].
            if (window.front() <= i - width) window.pop_front();
            if (i >= width - 1) answer.push_back(heat[window.front()]);
        }
        return answer;
    }
};

void show(const vector<int>& v) {
    for (size_t i = 0; i < v.size(); ++i) cout << (i ? " " : "") << v[i];
    cout << "\\n";
}
`,T=e=>["forge",e,"trace"],_=[{id:"forge-variable-window-trace-basic",kind:"trace",region:"R3",tags:T("variable-window"),prompt:"What does this program print?",code:`${x}
int main() {
    cout << Solution().longestTidy("abcabcbb", 1) << "\\n";
}
`,explanation:'With m = 1 no letter may repeat. The longest all-different stretch is "abc" (or "bca", "cab"), length 3. When the second a arrives, left moves past the first a.'},{id:"forge-variable-window-trace-limit",kind:"trace",region:"R3",tags:T("variable-window"),prompt:"Each letter may appear twice. What is printed?",code:`${x}
int main() {
    cout << Solution().longestTidy("aabaabaa", 2) << "\\n";
}
`,explanation:'The best stretch is "baab": two b and two a, length 4. Any stretch of 5 holds at least three a, so the window must shrink before best is recorded.'},{id:"forge-variable-window-trace-all-same",kind:"trace",region:"R3",tags:T("variable-window"),prompt:"The limit is larger than the tape. What is printed?",code:`${x}
int main() {
    cout << Solution().longestTidy("zzzz", 10) << "\\n";
}
`,explanation:"count[z] never exceeds 10, so the while loop never runs, left stays 0 and best becomes 4."},{id:"forge-variable-window-trace-empty",kind:"trace",region:"R3",tags:T("variable-window"),prompt:"An empty tape. What is printed?",code:`${x}
int main() {
    cout << Solution().longestTidy("", 1) << "\\n";
}
`,explanation:"The for loop never runs, so best keeps its initial value 0."},{id:"forge-variable-window-trace-tight",kind:"trace",region:"R3",tags:T("variable-window"),prompt:"One occurrence allowed, but only two letters alternate. What is printed?",code:`${x}
int main() {
    cout << Solution().longestTidy("ababab", 1) << "\\n";
}
`,explanation:'Each time a letter repeats, the window shrinks until the older copy is gone, so it never holds more than "ab" or "ba": 2.'},{id:"forge-monotonic-deque-trace-basic",kind:"trace",region:"R3",tags:T("monotonic-deque"),prompt:"What does this program print?",code:`${q}
int main() {
    show(Solution().paneMaxima({2, 7, 1, 5, 3}, 3));
}
`,explanation:"Frames are [2 7 1], [7 1 5], [1 5 3] with maxima 7, 7, 5. The 7 stays at the front until index 1 leaves the frame."},{id:"forge-monotonic-deque-trace-equal",kind:"trace",region:"R3",tags:T("monotonic-deque"),prompt:"All readings are equal. What is printed?",code:`${q}
int main() {
    show(Solution().paneMaxima({4, 4, 4}, 2));
}
`,explanation:"Popping with <= removes the older equal value, so the deque keeps only the newest index. Both frames have maximum 4."},{id:"forge-monotonic-deque-trace-width-one",kind:"trace",region:"R3",tags:T("monotonic-deque"),prompt:"Frame width 1 with negatives. What is printed?",code:`${q}
int main() {
    show(Solution().paneMaxima({-3, -8, -1}, 1));
}
`,explanation:"Each frame is a single pane, so the answer is the input itself. The front index expires at every step because i - width equals the previous index."},{id:"forge-monotonic-deque-trace-rising",kind:"trace",region:"R3",tags:T("monotonic-deque"),prompt:"Readings rise steadily. What is printed?",code:`${q}
int main() {
    show(Solution().paneMaxima({1, 2, 3, 4, 5}, 3));
}
`,explanation:"Each new value dominates and pops everything before it, so the deque has size 1 and the maximum is the newest pane: 3 4 5."},{id:"forge-monotonic-deque-trace-falling",kind:"trace",region:"R3",tags:T("monotonic-deque"),prompt:"Readings fall steadily. What is printed?",code:`${q}
int main() {
    show(Solution().paneMaxima({5, 4, 3, 2, 1}, 3));
}
`,explanation:"Nothing is ever popped from the back; the deque holds the whole frame. The front is the oldest pane, which expires one step at a time: 5 4 3."}],R=`#include <algorithm>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    int matchingPrefix(string pattern, vector<string> words) {
        const int n = static_cast<int>(min(pattern.size(), words.size()));
        unordered_map<char, string> wordOf;   // letter -> the word it stands for
        unordered_map<string, char> letterOf; // word -> the letter that stands for it
        for (int i = 0; i < n; ++i) {
            const auto w = wordOf.find(pattern[i]);
            const auto l = letterOf.find(words[i]);
            // Both directions must agree with what we already know, or line i breaks the fit.
            if (w != wordOf.end() && w->second != words[i]) return i;
            if (l != letterOf.end() && l->second != pattern[i]) return i;
            wordOf[pattern[i]] = words[i];
            letterOf[words[i]] = pattern[i];
        }
        return n;
    }
};
`,O=`#include <algorithm>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<string> echoes(string strand, int k) {
        const int n = static_cast<int>(strand.size());
        vector<string> answer;
        if (k > n) return answer;

        const auto code = [](char c) -> long long {
            switch (c) {
                case 'A': return 0;
                case 'C': return 1;
                case 'G': return 2;
                default:  return 3;  // 'T'
            }
        };

        // Each letter is 2 bits, so a block of k letters is 2k <= 60 bits: exact, no collisions.
        const long long mask = (1LL << (2 * k)) - 1;
        unordered_map<long long, int> seen;  // block key -> how many starts so far
        seen.reserve(n * 2);
        long long key = 0;
        for (int i = 0; i < n; ++i) {
            key = ((key << 2) | code(strand[i])) & mask;  // slide: add the new letter, drop the oldest
            if (i < k - 1) continue;                      // window not full yet
            if (++seen[key] == 2) answer.push_back(strand.substr(i - k + 1, k));  // report on the 2nd sighting only
        }
        sort(answer.begin(), answer.end());
        return answer;
    }
};

void show(const vector<string>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) cout << (i ? ", " : "") << v[i];
    cout << "]\\n";
}
`,W=e=>["forge",e,"trace"],z=[{id:"forge-two-way-map-trace-basic",kind:"trace",region:"R4",tags:W("two-way-map"),prompt:"What does this program print?",code:`${R}
int main() {
    cout << Solution().matchingPrefix("abba", {"sun", "moon", "moon", "sun"}) << "\\n";
}
`,explanation:"Every line agrees: a is sun on lines 0 and 3, b is moon on lines 1 and 2. All four lines fit, so n = 4 is returned."},{id:"forge-two-way-map-trace-letter-clash",kind:"trace",region:"R4",tags:W("two-way-map"),prompt:"The last word breaks the pattern. What is printed?",code:`${R}
int main() {
    cout << Solution().matchingPrefix("abba", {"sun", "moon", "moon", "star"}) << "\\n";
}
`,explanation:"On line 3 the letter a is already tied to sun, but the word is star. The first check fires and returns i = 3."},{id:"forge-two-way-map-trace-word-clash",kind:"trace",region:"R4",tags:W("two-way-map"),prompt:"Two letters, one word. What is printed?",code:`${R}
int main() {
    cout << Solution().matchingPrefix("ab", {"x", "x"}) << "\\n";
}
`,explanation:"Line 0 ties a to x and x to a. On line 1 the letter b is new, but the word x is already tied to a, so only the second ledger catches it: 1."},{id:"forge-two-way-map-trace-short-words",kind:"trace",region:"R4",tags:W("two-way-map"),prompt:"The word list is shorter than the pattern. What is printed?",code:`${R}
int main() {
    cout << Solution().matchingPrefix("abcd", {"p", "q"}) << "\\n";
}
`,explanation:"n is min(4, 2) = 2. Both lines fit, so the loop ends and n = 2 is returned; the unmatched letters never count."},{id:"forge-two-way-map-trace-empty",kind:"trace",region:"R4",tags:W("two-way-map"),prompt:"An empty pattern. What is printed?",code:`${R}
int main() {
    cout << Solution().matchingPrefix("", {"a"}) << "\\n";
}
`,explanation:"n = min(0, 1) = 0, the loop never runs and 0 is returned: the empty prefix always fits."},{id:"forge-rolling-key-trace-basic",kind:"trace",region:"R4",tags:W("rolling-key"),prompt:"What does this program print?",code:`${O}
int main() {
    show(Solution().echoes("ACGACGAC", 3));
}
`,explanation:"Blocks ACG, CGA, GAC repeat at starts 3, 4, 5. Each is pushed on its second sighting, then the list is sorted: [ACG, CGA, GAC]."},{id:"forge-rolling-key-trace-overlap",kind:"trace",region:"R4",tags:W("rolling-key"),prompt:"All letters equal. What is printed?",code:`${O}
int main() {
    show(Solution().echoes("AAAAAA", 2));
}
`,explanation:"Every window is AA, so the key is 0 each time. The count reaches 2 at start 1 and the block is reported once; later sightings do not push again: AA."},{id:"forge-rolling-key-trace-none",kind:"trace",region:"R4",tags:W("rolling-key"),prompt:"No block repeats. What is printed?",code:`${O}
int main() {
    show(Solution().echoes("ACGT", 2));
}
`,explanation:"AC, CG and GT each occur once, so the answer vector stays empty and show prints []."},{id:"forge-rolling-key-trace-too-long",kind:"trace",region:"R4",tags:W("rolling-key"),prompt:"The block is longer than the strand. What is printed?",code:`${O}
int main() {
    show(Solution().echoes("ACG", 5));
}
`,explanation:"k > n triggers the early return with an empty vector. Without it, the mask would be fine but the substr indices would be nonsense."},{id:"forge-rolling-key-trace-thrice",kind:"trace",region:"R4",tags:W("rolling-key"),prompt:"One block appears three times. How often is it printed?",code:`${O}
int main() {
    show(Solution().echoes("TTTTT", 2));
}
`,explanation:"TT occurs at starts 0..3, but only the second sighting pushes it, so it is listed exactly once."}],A=[{id:"r3-win-signal",kind:"mcq",region:"R3",tags:["sliding-window","recognition"],prompt:"Which problem statement is a sliding-window problem?",choices:["Longest substring that holds at most two distinct letters","Count the ways to climb n stairs taking 1 or 2 steps","Shortest path through a grid with walls","Merge k sorted lists into one"],answer:0,explanation:"'Longest/shortest contiguous stretch with a rule' is the window signal: the answer is a substring or subarray and the rule can be repaired by moving one edge. Stairs is DP, grid paths are BFS, merging lists is a heap."},{id:"r3-win-fixed-cost",kind:"mcq",region:"R3",tags:["sliding-window","fixed-window"],prompt:"A window of size k moves one step right. How do you update its sum in O(1)?",choices:["Add the entering element and subtract the leaving one","Recompute the sum of all k elements","Sort the window and read the middle","Subtract the maximum of the window"],answer:0,explanation:"Exactly one element enters and one leaves, so `sum += a[i] - a[i - k]`. Recomputing would make the whole scan O(n·k)."},{id:"r3-win-fixed-sums",kind:"predict",region:"R3",tags:["sliding-window","fixed-window"],prompt:"What does this program print?",code:`#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {1, 4, 2, 10, 2, 3};
    const int k = 3;
    int window = 0;
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        window += a[i];
        if (i >= k) window -= a[i - k];
        if (i >= k - 1) std::cout << window << ' ';
    }
    std::cout << '\\n';
}
`,explanation:"Window sums of three neighbours: the leaver `a[i - k]` is subtracted once the window is full. There are n - k + 1 = 4 windows."},{id:"r3-win-monotone",kind:"mcq",region:"R3",tags:["sliding-window","invariants"],prompt:"Why is shrinking from the left enough to repair 'longest substring with at most k distinct letters'?",choices:["Removing letters can only lower the distinct count, so moving l right eventually restores validity","Strings are immutable so the right edge cannot move","The left pointer runs faster than the right","The window must stay sorted"],answer:0,explanation:"The rule is monotone: a valid window stays valid when you cut letters off its end. So once r breaks it, only l has to move, and nothing left of l can matter again."},{id:"r3-win-cost",kind:"mcq",region:"R3",tags:["sliding-window","big-o"],prompt:"A variable window has `for (r...)` with a `while (...) ++l;` inside. What is the time on n elements?",choices:["O(n): l and r each move at most n steps in total","O(n²) because of the nested loops","O(n log n)","O(n·k) for window size k"],answer:0,explanation:"The inner loop is not restarted: l only moves forward, so across the whole run it moves at most n times. Count total pointer moves, not nesting depth."},{id:"r3-win-longest-trace",kind:"trace",region:"R3",tags:["sliding-window","trace"],prompt:"What does this program print?",code:`#include <algorithm>
#include <iostream>
#include <string>

int main() {
    std::string s = "pwwkew";
    int cnt[26] = {};
    int best = 0, l = 0;
    for (int r = 0; r < static_cast<int>(s.size()); ++r) {
        ++cnt[s[r] - 'a'];
        while (cnt[s[r] - 'a'] > 1) --cnt[s[l++] - 'a'];
        best = std::max(best, r - l + 1);
    }
    std::cout << best << '\\n';
}
`,explanation:"The window shrinks past the older 'w' whenever a repeat arrives. The longest repeat-free stretch is 'wke' (or 'kew'), length 3."},{id:"r3-win-update-spot",kind:"mcq",region:"R3",tags:["sliding-window","shortest"],prompt:"For the SHORTEST window whose sum is at least a target (positive values), where do you record the answer?",choices:["Inside the shrink loop, before moving l","After the shrink loop","Before the for loop","Only when r reaches the last index"],answer:0,explanation:"Inside the loop the window is still valid, and each shrink may give an even shorter valid one. After the loop it is invalid. A 'longest' window is recorded after the loop instead."},{id:"r3-win-shortest-parsons",kind:"parsons",region:"R3",tags:["sliding-window","parsons"],prompt:"Order the lines so the program prints the length of the shortest stretch with sum at least 7.",lines:["#include <algorithm>","#include <iostream>","#include <vector>","int main() {","    std::vector<int> a = {2, 3, 1, 2, 4, 3};","    int sum = 0, l = 0, best = 99;","    for (int r = 0; r < 6; ++r) {","        sum += a[r];","        while (sum >= 7) {","            best = std::min(best, r - l + 1);","            sum -= a[l++];","        }","    }",'    std::cout << best << "\\n";',"}"],explanation:"Add on the right, then while the window is valid record its length and drop the left element. Recording after the loop would measure an invalid window."},{id:"r3-win-negatives",kind:"mcq",region:"R3",tags:["sliding-window","negatives"],prompt:"Why does the plain two-pointer window fail for 'shortest subarray with sum at least K' when values may be negative?",choices:["The sum is no longer monotone in the window, so you cannot tell which edge to move","Negative numbers cannot be stored in vector<int>","Prefix sums always overflow","std::deque rejects negative values"],answer:0,explanation:"With negatives, adding an element can lower the sum and removing one can raise it. A too-small window might become valid by growing, or a valid one might need its left end kept. Prefix sums plus a monotonic deque restore the argument."},{id:"r3-win-counts",kind:"mcq",region:"R3",tags:["sliding-window","frequency-table"],prompt:"The input contains only lowercase letters. What is the best structure for the window's letter counts?",choices:["int cnt[26], indexed by c - 'a'","std::set<char> that stores each letter once","std::vector<std::string>","A sorted copy of the window"],answer:0,explanation:"A fixed array gives O(1), cache-friendly updates and supports tracking a `distinct` counter. A set loses multiplicity: you need counts to know when a letter fully leaves."},{id:"r3-win-exactly-k",kind:"mcq",region:"R3",tags:["sliding-window","exactly-k"],prompt:"How do you count subarrays with EXACTLY K odd numbers using window passes?",choices:["atMost(K) - atMost(K - 1)","atMost(K) + atMost(K - 1)","2 * atMost(K)","atMost(K + 1) - atMost(K - 1)"],answer:0,explanation:"'At most K' includes 'exactly K' and everything with fewer. Subtracting 'at most K-1' leaves exactly K. 'At most' is monotone, so it fits a window; 'exactly' is not."},{id:"r3-win-atmost-count",kind:"predict",region:"R3",tags:["sliding-window","exactly-k"],prompt:"What does this program print? (counts subarrays with exactly 2 ones)",code:`#include <iostream>
#include <vector>

long long atMost(const std::vector<int>& a, int k) {
    if (k < 0) return 0;
    long long total = 0;
    int ones = 0, l = 0;
    for (int r = 0; r < static_cast<int>(a.size()); ++r) {
        ones += a[r];
        while (ones > k) ones -= a[l++];
        total += r - l + 1;
    }
    return total;
}

int main() {
    std::vector<int> a = {1, 0, 1, 0, 1};
    std::cout << atMost(a, 2) - atMost(a, 1) << '\\n';
}
`,explanation:"The ranges with exactly two ones are [0,2], [0,3], [1,4] and [2,4]: 4. The difference of two at-most passes removes everything with fewer than two ones."},{id:"r3-win-count-add",kind:"mcq",region:"R3",tags:["sliding-window","counting"],prompt:"In an 'at most K' counting window, after shrinking, why do you add r - l + 1 to the total?",choices:["Every start from l to r gives a valid subarray ending at r","It is the length of the longest answer so far","It counts only the single subarray [l, r]","It prevents integer overflow"],answer:0,explanation:"Validity is monotone, so if [l, r] is valid then [l+1, r], ..., [r, r] are valid too. That is r - l + 1 subarrays that end exactly at r; summing over r counts each subarray once."},{id:"r3-win-long-long",kind:"mcq",region:"R3",tags:["sliding-window","overflow"],prompt:"n = 100000 and you count every valid subarray. Which type should the total have?",choices:["long long: n(n+1)/2 is about 5·10^9","int: n fits in int","short","unsigned char"],answer:0,explanation:"The number of subarrays grows like n²/2, beyond 2^31 - 1 ≈ 2.1·10^9. The inputs fitting in int does not make the count fit."},{id:"r3-win-lambda-capture",kind:"compilerError",region:"R3",tags:["lambda","compiler-errors"],prompt:"This predicate does not compile. What is the cause?",code:`#include <vector>

int main() {
    int limit = 3;
    std::vector<int> a = {1, 2, 3};
    auto tooBig = [](int x) { return x > limit; };
    return tooBig(a[0]);
}
`,choices:["The lambda uses limit but does not capture it","A lambda cannot return bool","limit must be a global","tooBig must be declared with int, not auto"],answer:0,explanation:"A lambda with an empty capture list cannot see local variables. Write `[limit](int x) { ... }` (by value) or `[&]` (by reference)."},{id:"r3-win-fixed-cloze",kind:"cloze",region:"R3",tags:["sliding-window","fixed-window"],prompt:"Fill the blanks so the program prints the largest sum of 3 consecutive values.",template:`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {4, 2, 1, 7, 8, 1, 2, 8, 1, 0};
    const int k = 3;
    int sum = 0;
    for (int i = 0; i < k; ++i) sum += a[i];
    int best = sum;
    for (int i = k; i < static_cast<int>(a.size()); ++i) {
        sum += a[i] ___ a[___];
        best = std::max(best, sum);
    }
    std::cout << best << "\\n";
}
`,blanks:[["-"],["i - k","i-k"]],explanation:"The entering element is added and the one k places behind is subtracted: `sum += a[i] - a[i - k]`. The best window is 7 + 8 + 1 = 16."},{id:"r3-win-shrink-cloze",kind:"cloze",region:"R3",tags:["sliding-window","variable-window"],prompt:"Fill the blanks so it prints the longest stretch with no repeated letter.",template:`#include <algorithm>
#include <iostream>
#include <string>

int main() {
    std::string s = "abcabcbb";
    int cnt[26] = {};
    int best = 0, l = 0;
    for (int r = 0; r < static_cast<int>(s.size()); ++r) {
        ++cnt[s[r] - 'a'];
        while (cnt[s[r] - 'a'] ___ 1) {
            --cnt[s[l] - 'a'];
            ___;
        }
        best = std::max(best, r - l + 1);
    }
    std::cout << best << "\\n";
}
`,blanks:[[">"],["++l","l++"]],explanation:"A letter seen more than once breaks the rule, so shrink while `cnt > 1`; the shrink must also advance `l`, otherwise the loop never ends."},{id:"r3-win-multi-signal",kind:"multi",region:"R3",tags:["sliding-window","recognition"],prompt:"Select every problem that fits a sliding window.",choices:["Longest substring with at most k distinct characters","Shortest subarray of positives with sum at least a target","Maximum of every window of size k","Count the ways to partition into equal-sum subsets","Minimum cost path through a DAG"],answers:[0,1,2],explanation:"The first three ask about contiguous stretches with a rule repaired by moving edges. Subset partition and DAG paths are DP problems: the chosen items are not contiguous."},{id:"r3-win-anagram",kind:"mcq",region:"R3",tags:["sliding-window","anagram"],prompt:"You slide a window of size |p| over s and compare two 26-slot count arrays with == at every step. What is the time?",choices:["O(26·n) = O(n)","O(n·|p|) for every input","O(n²)","O(26^n)"],answer:0,explanation:"Each step updates two counts and compares 26 slots, a constant. Keeping a `matches` counter for how many letters agree makes it O(n) without even the factor 26."},{id:"r3-dq-signal",kind:"mcq",region:"R3",tags:["monotonic-deque","recognition"],prompt:"You must report the maximum of every window of size k. What is the best-fit structure?",choices:["A monotonic deque of indices (O(n))","Sort each window","Memoised recursion","Union-Find"],answer:0,explanation:"A monotonic deque keeps the champion at the front and discards candidates that can never win, for O(n) in total. Sorting each window is O(n·k log k); a heap is O(n log n)."},{id:"r3-dq-why-pop",kind:"mcq",region:"R3",tags:["monotonic-deque","invariants"],prompt:"When a[i] arrives, why can an earlier, smaller element be dropped from a max-deque?",choices:["It leaves the window sooner and is smaller, so it can never be the maximum of a window that includes a[i]","Because it was already printed","Because the deque must be sorted by index","It would overflow the deque"],answer:0,explanation:"Any window containing the older element also contains the newer, larger one (windows are contiguous and slide right), and the older one expires first. So it is dominated forever."},{id:"r3-dq-indices",kind:"mcq",region:"R3",tags:["monotonic-deque","indices"],prompt:"Why does the deque store indices rather than values?",choices:["To know when the front has left the window","Because deque<int> cannot hold array values","Because values may be negative","To make push_back faster"],answer:0,explanation:"The value is always `a[idx]`, but an index also tells you its age: when `front <= i - k` it is outside the window and must be removed."},{id:"r3-dq-cost",kind:"mcq",region:"R3",tags:["monotonic-deque","big-o"],prompt:"What is the time complexity of the monotonic-deque window maximum?",choices:["O(n): each index is pushed once and popped at most once","O(n·k)","O(n log k)","O(n log n)"],answer:0,explanation:"The inner `while` pops elements that were pushed earlier, and nothing is pushed twice, so total pops are at most n. This amortised argument is what interviewers want to hear."},{id:"r3-dq-window-max",kind:"predict",region:"R3",tags:["monotonic-deque","trace"],prompt:"What does this program print?",code:`#include <deque>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {9, 4, 7, 1, 8, 2, 6};
    const int k = 4;
    std::deque<int> dq;
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
        dq.push_back(i);
        if (dq.front() <= i - k) dq.pop_front();
        if (i >= k - 1) std::cout << a[dq.front()] << ' ';
    }
    std::cout << '\\n';
}
`,explanation:"The 9 is the champion until index 0 leaves the window; then 8 takes over. Each printed value is the front of the deque after the expiry check."},{id:"r3-dq-front-trace",kind:"trace",region:"R3",tags:["monotonic-deque","trace"],prompt:"What does this program print?",code:`#include <deque>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {5, 4, 3, 2, 1};
    const int k = 3;
    std::deque<int> dq;
    for (int i = 0; i < 5; ++i) {
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
        dq.push_back(i);
        if (dq.front() <= i - k) dq.pop_front();
    }
    std::cout << dq.size() << '\\n';
}
`,explanation:"A strictly decreasing array never pops from the back, so the deque grows until old indices expire. At the end it holds the last k indices (2, 3, 4): size 3."},{id:"r3-dq-equal",kind:"mcq",region:"R3",tags:["monotonic-deque","ties"],prompt:"In a max-deque, a[back] equals a[i]. Which statement is true?",choices:["Popping with <= keeps one entry per run of equals; popping with < keeps all of them; both give correct maxima","Only <= is correct","Only < is correct","Equal elements must be removed from the array first"],answer:0,explanation:"Equal values give the same maximum. Popping them (<=) keeps the deque smaller, and the newer copy outlives the older, so nothing is lost. Keeping them (<) is also correct but wastes space."},{id:"r3-dq-slide-parsons",kind:"parsons",region:"R3",tags:["monotonic-deque","parsons"],prompt:"Order the lines so the program prints the maximum of each window of size 2.",lines:["#include <deque>","#include <iostream>","#include <vector>","int main() {","    std::vector<int> a = {4, 2, 12, 3};","    int k = 2;","    std::deque<int> dq;","    for (int i = 0; i < 4; ++i) {","        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();","        dq.push_back(i);","        if (dq.front() <= i - k) dq.pop_front();","        if (i >= k - 1) std::cout << a[dq.front()] << ' ';","    }",'    std::cout << "\\n";',"}"],explanation:"Pop dominated candidates from the back, push the new index, expire the front, then read the champion once a full window exists."},{id:"r3-dq-expire",kind:"mcq",region:"R3",tags:["monotonic-deque","off-by-one"],prompt:"The window ending at i covers indices i-k+1 .. i. When has the front index f expired?",choices:["f <= i - k","f < i - k","f >= i - k","f == i"],answer:0,explanation:"Index i-k is just outside [i-k+1, i]. Using `<` would keep a stale champion one step too long, a classic off-by-one."},{id:"r3-dq-api",kind:"multi",region:"R3",tags:["deque","api"],prompt:"Select every member function that exists on std::deque<int>.",choices:["push_back(x)","pop_front()","front()","push(x)","top()"],answers:[0,1,2],explanation:"`std::deque` has push_back/push_front, pop_back/pop_front, front, back, size and empty. `push` and `top` belong to `std::queue` and `std::stack` adaptors."},{id:"r3-dq-empty",kind:"mcq",region:"R3",tags:["deque","undefined-behaviour"],prompt:"What happens if you call dq.front() on an empty std::deque?",choices:["Undefined behaviour: guard with !dq.empty()","It throws std::out_of_range","It returns 0","It returns -1"],answer:0,explanation:"`front()` does not check. `at()` throws for out-of-range indexes but there is no checked front. Always test `empty()` first when the loop may have popped everything."},{id:"r3-dq-min-cloze",kind:"cloze",region:"R3",tags:["monotonic-deque","window-min"],prompt:"Fill the blanks so it prints the MINIMUM of every window of size 3.",template:`#include <deque>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {4, 2, 12, 3, 8, 1};
    const int k = 3;
    std::deque<int> dq;
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        while (!dq.empty() && a[dq.back()] ___ a[i]) dq.pop_back();
        dq.push_back(i);
        if (dq.front() ___ i - k) dq.pop_front();
        if (i >= k - 1) std::cout << a[dq.front()] << ' ';
    }
    std::cout << "\\n";
}
`,blanks:[[">=",">"],["<="]],explanation:"For a minimum, flip the pop test: drop back elements that are larger than (or equal to) the newcomer. Expiry is unchanged: `front <= i - k`."},{id:"r3-dq-prefix-why",kind:"mcq",region:"R3",tags:["monotonic-deque","prefix-sums"],prompt:"Why use prefix sums for 'shortest subarray with sum at least K' when negatives are allowed?",choices:["P[j] - P[i] is any range sum, so each end j needs the nearest start i with a small enough prefix","They remove the negative numbers","They sort the array","They make the plain window monotone"],answer:0,explanation:"Prefix sums turn a range sum into a difference of two entries. The problem becomes: for each j find the closest earlier i with P[i] <= P[j] - K, which a monotonic deque answers in amortised O(1)."},{id:"r3-dq-prefix-rules",kind:"mcq",region:"R3",tags:["monotonic-deque","prefix-sums"],prompt:"In the prefix-sum deque, why pop from the back while P[back] >= P[j]?",choices:["A later start with a smaller or equal prefix is shorter and at least as good for every future end","To keep the deque sorted by index","To avoid overflow","To remove duplicate indices"],answer:0,explanation:"For any future end, using start j instead of the older back start gives a shorter stretch and a sum that is at least as large. The older start is dominated and can be discarded."},{id:"r3-dq-prefix-shortest",kind:"predict",region:"R3",tags:["monotonic-deque","prefix-sums"],prompt:"What does this program print?",code:`#include <algorithm>
#include <deque>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {5, -3, 4, -2, 6};
    const long long K = 7;
    const int n = static_cast<int>(a.size());
    std::vector<long long> P(n + 1, 0);
    for (int i = 0; i < n; ++i) P[i + 1] = P[i] + a[i];
    int best = n + 1;
    std::deque<int> dq;
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
`,explanation:"No stretch of length 1 or 2 reaches 7; [4, -2, 6] sums to 8, so the answer is 3. The negative values would break a plain window, but the two pops handle them."},{id:"r3-dq-prefix-ll",kind:"mcq",region:"R3",tags:["prefix-sums","overflow"],prompt:"n = 10^5 and |a[i]| <= 10^5. How large can a prefix sum be, and what type should P use?",choices:["Up to 10^10: long long","Up to 10^5: int","Up to 10^7: int","Exactly 2^31: unsigned int"],answer:0,explanation:"10^5 values of up to 10^5 each sum to 10^10, past the int range. Declare `P` and `K` as `long long`; otherwise the comparison `P[j] - P[i] >= K` can wrap."},{id:"r3-dq-no-push",kind:"compilerError",region:"R3",tags:["deque","compiler-errors"],prompt:"This code does not compile. What is the cause?",code:`#include <deque>

int main() {
    std::deque<int> dq;
    dq.push(3);
    return dq.size();
}
`,choices:["std::deque has no push; use push_back or push_front","deque needs a size argument","The deque must be declared const","int cannot be stored in a deque"],answer:0,explanation:"`push` and `pop` are the interface of `std::queue` and `std::stack`. The deque itself spells the end explicitly: push_back, push_front, pop_back, pop_front."},{id:"r3-dq-vs-heap",kind:"mcq",region:"R3",tags:["monotonic-deque","heap"],prompt:"A max-heap with lazy deletion also solves window maximum. Compared with it, the monotonic deque…",choices:["Runs in O(n) instead of O(n log n) and needs no lazy deletion","Runs in O(n log n)","Only works on sorted arrays","Uses recursion"],answer:0,explanation:"A heap keeps stale entries until they reach the top; the deque keeps only live candidates and both of its ends are O(1). The heap is still a fine fallback when you forget the deque."}],S=[{id:"r4-hash-signal",kind:"mcq",region:"R4",tags:["hash-map","recognition"],prompt:"Which job is the clearest signal to reach for a hash map or hash set?",choices:["Tell in O(1) whether a value was seen before, or how often","Visit nodes of a graph level by level","Find the k-th smallest value in a stream","Reverse the order of a list in place"],answer:0,explanation:"'Have I seen this? How many times?' is what a hash table is for: it turns a nested search into one lookup per item. Level order is BFS, k-th smallest is a heap or selection, reversal is two pointers."},{id:"r4-hash-avg",kind:"mcq",region:"R4",tags:["hash-map","big-o"],prompt:"What does a hash map guarantee for find with a good hash function and bounded load factor?",choices:["O(1) on average, O(n) in the worst case","O(log n) always","O(1) always, even for adversarial keys","O(n) on average"],answer:0,explanation:"Average cost is constant because chains stay short. The worst case is every key in one bucket, a single chain of length n. Say both in an interview."},{id:"r4-hash-chain-trace",kind:"trace",region:"R4",tags:["hash-map","collisions","trace"],prompt:"Keys go to bucket key % 5. What does this program print (the longest chain)?",code:`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> chain(5, 0);
    for (int key : {10, 15, 20, 7, 12, 25, 3}) ++chain[key % 5];
    int longest = 0;
    for (int len : chain) longest = std::max(longest, len);
    std::cout << longest << '\\n';
}
`,explanation:"10, 15, 20 and 25 are multiples of 5, so all four land in bucket 0. A hash that ignores structure in the keys builds exactly this long chain."},{id:"r4-hash-load",kind:"mcq",region:"R4",tags:["hash-map","load-factor"],prompt:"A chained table has 64 buckets and holds 96 entries. What is its load factor?",choices:["1.5","0.67","96","2.0"],answer:0,explanation:"Load factor = entries / buckets = 96 / 64 = 1.5. Past the limit (1.0 by default in std::unordered_map) the table grows and rehashes."},{id:"r4-hash-rehash",kind:"mcq",region:"R4",tags:["hash-map","amortized"],prompt:"Each rehash costs O(n). Why is insert still O(1) amortized?",choices:["Doubling the bucket count makes the total rehash work a geometric series, under 2n for n inserts","Rehash only happens on erase","The rehash runs in a background thread","The load factor never exceeds 0.5"],answer:0,explanation:"Rehashes happen at sizes 8, 16, 32, ... and move that many entries, which sums to less than twice the final size. Growing by a constant factor is the key; growing by a fixed +10 would make it O(n²)."},{id:"r4-hash-openaddr",kind:"mcq",region:"R4",tags:["hash-map","open-addressing"],prompt:"In an open-addressing table with linear probing, why does erase leave a tombstone marker?",choices:["A lookup stops at the first empty slot; clearing a slot in the middle of a probe run would hide later keys","To make the table smaller","Tombstones speed up insert only","Because the key must be zeroed for security"],answer:0,explanation:"Probing for key K walks from its home slot until it meets an empty slot. If an erase emptied a slot inside that run, keys placed after it would become unreachable, so the slot is marked 'deleted' instead."},{id:"r4-hash-subscript",kind:"predict",region:"R4",tags:["unordered_map","operator[]"],prompt:"What does this program print?",code:`#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<int, int> stock;
    stock[4] = 2;
    int a = stock[9];
    int b = static_cast<int>(stock.count(7));
    std::cout << stock.size() << ' ' << a << ' ' << b << '\\n';
}
`,explanation:"`stock[9]` inserts 9 with value 0, so the size is 2 and `a` is 0. `count(7)` only looks, so it returns 0 and inserts nothing."},{id:"r4-hash-order",kind:"mcq",region:"R4",tags:["unordered_map","iteration-order"],prompt:"You must print the word counts in alphabetical order. What is safe?",choices:["Copy the pairs to a vector and sort, or use std::map","Iterate the unordered_map; it comes out sorted","Iterate the unordered_map; it comes out in insertion order","Reserve the right bucket count first"],answer:0,explanation:"The iteration order of an unordered container is unspecified and can change after inserts. If order matters, sort the pairs or use an ordered map (O(log n) per operation)."},{id:"r4-hash-pair-error",kind:"compilerError",region:"R4",tags:["unordered_map","pair","compiler-errors"],prompt:"This map of cell distances does not compile. What is the cause?",code:`#include <unordered_map>
#include <utility>

int main() {
    std::unordered_map<std::pair<int, int>, int> dist;
    dist[{0, 0}] = 1;
    return static_cast<int>(dist.size());
}
`,choices:["std::pair has no std::hash, so the map needs a hash functor","A map value cannot be int","The braces in dist[{0, 0}] are not allowed","unordered_map needs a comparison operator for pair"],answer:0,explanation:"The standard library has no `std::hash<std::pair<...>>`. Pass your own hash as the third template argument, or pack the pair into one `long long`."},{id:"r4-hash-anti",kind:"mcq",region:"R4",tags:["hash-map","anti-hash"],prompt:"Why might a contest solution use a custom mixed hash instead of the default for int keys?",choices:["Test data can be built so many keys share a bucket, turning O(1) lookups into O(n)","The default hash does not compile for int","Mixed hashes use less memory","The default hash is not deterministic within a run"],answer:0,explanation:"With a predictable hash and bucket count, an adversary can send keys that all collide. A bit-mixing function (and a random seed) removes the pattern. On trusted interview inputs the default is fine, but know the reason."},{id:"r4-hash-set-cloze",kind:"cloze",region:"R4",tags:["unordered_set","duplicates"],prompt:"Fill the blanks so it prints the first value that repeats.",template:`#include <iostream>
#include <unordered_set>
#include <vector>

int main() {
    std::vector<int> a = {2, 7, 4, 7, 2};
    std::unordered_set<int> seen;
    for (int x : a) {
        if (!seen.___(x).second) {
            std::cout << x << "\\n";
            ___;
        }
    }
}
`,blanks:[["insert"],["break"]],explanation:"`insert` returns a pair whose `.second` is false when the value was already there. That one call both tests and records. `break` stops at the first repeat."},{id:"r4-hash-freq-parsons",kind:"parsons",region:"R4",tags:["unordered_map","frequency","parsons"],prompt:"Order the lines so the program prints how many times 'a' appears in banana.",lines:["#include <iostream>","#include <string>","#include <unordered_map>","int main() {",'    std::string s = "banana";',"    std::unordered_map<char, int> count;","    for (char c : s) ++count[c];","    std::cout << count['a'] << \"\\n\";","}"],explanation:"Declare the string and map, count with `++count[c]` (operator[] creates a zero first), then read the answer. The headers come first."},{id:"r4-key-def",kind:"mcq",region:"R4",tags:["key-design","recognition"],prompt:"What is the test for a good map key in a grouping problem?",choices:["Two items have equal keys exactly when the problem calls them the same","The key is as short as possible","The key is always a string","The key is the first element of the item"],answer:0,explanation:"Equal keys must mean 'same group' in both directions. Too coarse a key merges groups that differ; too fine a key splits groups that should be together."},{id:"r4-key-anagram",kind:"predict",region:"R4",tags:["key-design","anagram"],prompt:"What does this program print?",code:`#include <algorithm>
#include <iostream>
#include <string>

std::string signature(std::string w) {
    std::sort(w.begin(), w.end());
    return w;
}

int main() {
    std::string a = signature("listen"), b = signature("silent"), c = signature("enlist!");
    std::cout << a << ' ' << (a == b) << ' ' << (a == c) << '\\n';
}
`,explanation:"Sorting the letters gives `eilnst` for both rearrangements. The extra `!` makes the third signature `!eilnst`, so it differs. The cost is O(L log L) per word."},{id:"r4-key-delim",kind:"mcq",region:"R4",tags:["key-design","encoding"],prompt:"You encode a list of ints as a string key by appending each number. What goes wrong without a separator?",choices:['{1, 11} and {11, 1} both become "111" and collide',"The string is too long to hash","Negative numbers become positive","to_string stops working for numbers over 9"],answer:0,explanation:"Plain concatenation is not injective. Append a delimiter after each number (such as '#'), use fixed width, or prefix lengths so two different lists never share a key."},{id:"r4-key-delim-trace",kind:"trace",region:"R4",tags:["key-design","encoding","trace"],prompt:"What does this program print?",code:`#include <iostream>
#include <set>
#include <string>
#include <vector>

std::string glue(const std::vector<int>& v) {
    std::string s;
    for (int x : v) s += std::to_string(x);
    return s;
}

int main() {
    std::set<std::string> keys;
    keys.insert(glue({1, 11}));
    keys.insert(glue({11, 1}));
    keys.insert(glue({111}));
    std::cout << keys.size() << '\\n';
}
`,explanation:'All three lists glue to "111", so the set holds one key. Three different inputs, one key: this is the collision a separator prevents.'},{id:"r4-key-cell-cloze",kind:"cloze",region:"R4",tags:["key-design","grid"],prompt:"Fill the blanks to turn a grid cell into one integer id and back.",template:`#include <iostream>

int main() {
    const int cols = 5;
    int r = 2, c = 3;
    int id = r * ___ + c;
    int back = id / ___;
    std::cout << id << ' ' << back << "\\n";
}
`,blanks:[["cols"],["cols"]],explanation:"Multiply the row by the number of columns, because `c` ranges over `0..cols-1`; dividing by `cols` recovers the row. Any other multiplier makes different cells collide."},{id:"r4-key-bijection",kind:"mcq",region:"R4",tags:["key-design","bijection"],prompt:"Why is a single map letter-of-s to letter-of-t not enough to test isomorphic strings?",choices:['"ab" and "aa" pass it, but two different letters cannot map to the same one',"A single map is slower","Maps cannot hold chars","It rejects strings of different length"],answer:0,explanation:"The first map only proves each source letter has one target. The target side must also have one source: keep the reverse map (or the last index per letter)."},{id:"r4-key-bijection-trace",kind:"trace",region:"R4",tags:["key-design","bijection","trace"],prompt:"What does this program print?",code:`#include <iostream>
#include <string>
#include <unordered_map>

bool isomorphic(const std::string& s, const std::string& t) {
    if (s.size() != t.size()) return false;
    std::unordered_map<char, char> fwd, back;
    for (std::size_t i = 0; i < s.size(); ++i) {
        auto f = fwd.find(s[i]);
        auto b = back.find(t[i]);
        if (f == fwd.end() && b == back.end()) {
            fwd[s[i]] = t[i];
            back[t[i]] = s[i];
        } else if (f == fwd.end() || b == back.end() || f->second != t[i]) {
            return false;
        }
    }
    return true;
}

int main() {
    std::cout << isomorphic("paper", "title") << isomorphic("badc", "baba") << isomorphic("ab", "aa") << '\\n';
}
`,explanation:"'paper' to 'title' is a consistent two-way pairing. In 'badc' to 'baba', 'd' is new but 'b' is already the target of 'b', so it fails; 'ab' to 'aa' fails the same way."},{id:"r4-key-prefix-predict",kind:"predict",region:"R4",tags:["prefix-sum","hash-map"],prompt:"What does this program print (subarrays with sum 7)?",code:`#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {3, 4, -7, 1, 3, 3};
    const int k = 7;
    std::unordered_map<int, int> seen;
    seen[0] = 1;
    int sum = 0;
    long long ways = 0;
    for (int x : a) {
        sum += x;
        auto it = seen.find(sum - k);
        if (it != seen.end()) ways += it->second;
        ++seen[sum];
    }
    std::cout << ways << '\\n';
}
`,explanation:"A subarray ending here sums to k when an earlier prefix equals `sum - k`. The map counts earlier prefixes by value, so it handles negatives and repeated prefixes."},{id:"r4-key-prefix-parsons",kind:"parsons",region:"R4",tags:["prefix-sum","hash-map","parsons"],prompt:"Order the lines so the program prints the number of subarrays of {1, 1, 1} with sum 2.",lines:["#include <iostream>","#include <unordered_map>","#include <vector>","int main() {","    std::vector<int> a = {1, 1, 1};","    std::unordered_map<int, int> seen;","    seen[0] = 1;","    int sum = 0, ways = 0;","    for (int x : a) {","        sum += x;","        ways += seen[sum - 2];","        ++seen[sum];","    }",'    std::cout << ways << "\\n";',"}"],explanation:"Seed the empty prefix, then per element: extend the sum, count matches for `sum - k` first, and only then record the new prefix. Counting after recording would mis-handle k = 0."},{id:"r4-key-multi",kind:"multi",region:"R4",tags:["unordered_map","hashable-keys"],prompt:"Which key types work in std::unordered_map with no extra hash code?",choices:["int","std::string","long long","std::pair<int, int>","std::vector<int>"],answers:[0,1,2],explanation:"The standard provides hashes for integers, chars, strings and pointers. Pairs, tuples and vectors have none: pack them into a string or integer, or pass a hash functor."},{id:"r4-key-ordered",kind:"mcq",region:"R4",tags:["map-vs-unordered"],prompt:"For each query you need the smallest stored key that is >= x. Which container fits?",choices:["std::map (or std::set) with lower_bound, O(log n)","std::unordered_map, O(1)","std::unordered_set with find","A plain vector scanned each time"],answer:0,explanation:"Hash tables only answer exact-match questions. Order queries (lower_bound, predecessor, range) need a sorted structure; a hash table has no notion of 'next key'."},{id:"r4-key-const-error",kind:"compilerError",region:"R4",tags:["unordered_map","const","compiler-errors"],prompt:"This helper does not compile. What is the cause?",code:`#include <unordered_map>

int lookup(const std::unordered_map<int, int>& table, int key) {
    return table[key];
}

int main() {
    std::unordered_map<int, int> t = {{1, 2}};
    return lookup(t, 1);
}
`,choices:["operator[] can insert, so it is not allowed on a const map; use find or at","A map cannot be passed by reference","The key must be a long long","lookup must return a pointer"],answer:0,explanation:"`operator[]` is not a const member because it may add an entry. In a function that only reads, call `table.at(key)` (throws if missing) or `find` and check for `end()`."},{id:"r4-rh-signal",kind:"mcq",region:"R4",tags:["rolling-hash","recognition"],prompt:"Which prompt points to a rolling hash?",choices:["Find every window of a long text that equals a pattern or another window","Find the shortest path in a weighted graph","Merge overlapping intervals","Count paths in a grid"],answer:0,explanation:"Many windows compared against each other or a pattern: fingerprint each window in O(1) and compare numbers. The others are Dijkstra, sorting, and DP."},{id:"r4-rh-update",kind:"mcq",region:"R4",tags:["rolling-hash","update"],prompt:"With h = s[i]·B^(m-1) + ... + s[i+m-1] (mod M), how do you slide the window one step right?",choices:["Subtract s[i]·B^(m-1), multiply by B, add s[i+m]","Multiply by B and add s[i+m]; the old term vanishes by itself","Recompute all m terms","Add s[i+m] and subtract s[i] (no multiply)"],answer:0,explanation:"The leaving character holds the highest power, so remove that term first; multiplying by B then shifts everyone one place up, and the entering character takes the units place. All mod M."},{id:"r4-rh-collision",kind:"mcq",region:"R4",tags:["rolling-hash","collisions"],prompt:"Two windows have the same fingerprint. What do you know?",choices:["They are probably equal; verify them, or use a second modulus, to be sure","They are certainly equal","They are certainly different","Nothing; fingerprints are random"],answer:0,explanation:"Equal strings always give equal fingerprints, but the reverse can fail (a collision). Compare the actual characters on a fingerprint match, which is rare, or double-hash."},{id:"r4-rh-cost",kind:"mcq",region:"R4",tags:["rolling-hash","big-o"],prompt:"Rabin-Karp with verification on each fingerprint match: what is the time on text n and pattern m with a good hash?",choices:["O(n + m) expected, O(n·m) worst case","O(n log m)","O(n·m) always","O(m²)"],answer:0,explanation:"Building the pattern hash is O(m), each slide is O(1), and a verification costs O(m) but rarely happens for a spread-out hash. If every window matches by hash, or the pattern really occurs everywhere, the worst case is O(n·m)."},{id:"r4-rh-negative",kind:"mcq",region:"R4",tags:["rolling-hash","pitfalls"],prompt:"After subtracting the leaving term from the hash, why do you add MOD before taking % MOD?",choices:["In C++ a negative left operand gives a negative remainder","To make the hash larger","Because MOD is odd","To avoid division by zero"],answer:0,explanation:"`(a - b) % M` is negative when a < b. Writing `(a - b + M) % M` keeps the fingerprint in `[0, M)` so equal windows keep equal values."},{id:"r4-rh-overflow",kind:"mcq",region:"R4",tags:["rolling-hash","overflow"],prompt:"With MOD = 1,000,000,007, which type should hold hash * BASE before the % ?",choices:["long long","int","short","float"],answer:0,explanation:"The product can reach about 10^9 × 10^9 = 10^18, which fits in a signed 64-bit integer (up to 9.2·10^18) but overflows a 32-bit int. Keep all intermediate values in `long long`."},{id:"r4-rh-2bit-predict",kind:"predict",region:"R4",tags:["rolling-hash","bit-packing"],prompt:"A=0, C=1, G=2, T=3, two bits each. What does this program print?",code:`#include <iostream>
#include <string>

int code(char c) { return c == 'A' ? 0 : c == 'C' ? 1 : c == 'G' ? 2 : 3; }

int main() {
    std::string s = "ACGTAC";
    const int k = 4;
    const int mask = (1 << (2 * k)) - 1;
    int key = 0;
    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        key = ((key << 2) | code(s[i])) & mask;
        if (i >= k - 1) std::cout << key << ' ';
    }
    std::cout << '\\n';
}
`,explanation:"ACGT is 00 01 10 11 in binary = 27; the next window CGTA is 01 10 11 00 = 108; GTAC is 10 11 00 01 = 177. The mask drops the oldest letter each step."},{id:"r4-rh-mask-cloze",kind:"cloze",region:"R4",tags:["rolling-hash","bit-packing"],prompt:"Fill the blanks to keep only the newest k letters of the key (2 bits per letter).",template:`#include <iostream>
#include <string>

int main() {
    std::string s = "GATTACA";
    const int k = 3;
    const int mask = (1 << (2 * k)) - 1;
    int key = 0, last = 0;
    for (char ch : s) {
        int code = ch == 'A' ? 0 : ch == 'C' ? 1 : ch == 'G' ? 2 : 3;
        key = ((key << ___) | code) & ___;
        last = key;
    }
    std::cout << last << "\\n";
}
`,blanks:[["2"],["mask"]],explanation:"Shift left by the bits per letter (2), OR in the new code, then AND with the mask to discard letters older than k. The last window, ACA, is 00 01 00 = 4."},{id:"r4-rh-bsearch-why",kind:"mcq",region:"R4",tags:["rolling-hash","binary-search"],prompt:"Why can you binary search the length of the longest repeated substring?",choices:["If a repeat of length L exists, trimming a letter gives a repeat of length L-1, so 'has a repeat' is monotone in L","Because substrings are sorted","Because the hash is monotone","Because the string length is a power of two"],answer:0,explanation:"Monotone yes/no answers are what binary search needs. Each probe checks one length in O(n) with a rolling hash, so the total is O(n log n) instead of trying every length."},{id:"r4-rh-bsearch-trace",kind:"trace",region:"R4",tags:["rolling-hash","binary-search","trace"],prompt:"What does this program print?",code:`#include <iostream>
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
    int lo = 0, hi = static_cast<int>(s.size()) - 1;
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;
        if (hasRepeat(s, mid)) lo = mid; else hi = mid - 1;
    }
    std::cout << lo << '\\n';
}
`,explanation:"'ana' occurs at 1 and 3, so length 3 works, while no length-4 substring repeats. Rounding mid up (+1) is required when the branch sets `lo = mid`, or the loop can stall."},{id:"r4-rh-bsearch-parsons",kind:"parsons",region:"R4",tags:["binary-search","parsons"],prompt:"Order the lines: the largest value in [0, 9] for which ok(v) is true, where ok(v) means v * v <= 40.",lines:["#include <iostream>","int main() {","    int lo = 0, hi = 9;","    while (lo < hi) {","        int mid = (lo + hi + 1) / 2;","        if (mid * mid <= 40) lo = mid;","        else hi = mid - 1;","    }",'    std::cout << lo << "\\n";',"}"],explanation:"The 'largest true' template: round mid up, move `lo = mid` on success and `hi = mid - 1` on failure. The answer is 6 since 6·6 = 36 and 7·7 = 49."},{id:"r4-rh-anti",kind:"mcq",region:"R4",tags:["rolling-hash","anti-hash"],prompt:"A rolling hash uses unsigned 64-bit overflow (mod 2^64) with one fixed base. What is the danger?",choices:["Structured strings such as Thue-Morse sequences can force collisions whatever the base","It is slower than a prime modulus","The result is always negative","Overflow is a compile error"],answer:0,explanation:"A power-of-two modulus has algebraic weaknesses: long Thue-Morse strings collide for every base. Use a large prime modulus (two of them, or a random base) and verify matches."},{id:"r4-rh-words",kind:"mcq",region:"R4",tags:["rolling-hash","word-window"],prompt:"All words have equal length w. To find windows that are a concatenation of every word once, how many alignments must you try?",choices:["w, one per starting offset 0..w-1, each a window over word-sized steps","1; it is enough to start at 0","n, one per start index in the text","2^w"],answer:0,explanation:"A valid window starts at some index; its words sit at that start modulo w. Slide a count-based window over words for each of the w offsets: total about O(n) word checks per offset, using word ids instead of rehashing strings."}],N=[{id:"s1-endl-vs-newline",kind:"mcq",region:"R0",tags:["io","endl"],prompt:"A solution prints 200,000 lines. Why do experienced C++ programmers write '\\n' instead of std::endl?",choices:["endl flushes the stream every time, which is slow for many lines","endl was removed in C++20","'\\n' flushes the buffer more safely","endl prints two line breaks"],answer:0,explanation:"std::endl writes '\\n' and then flushes the output buffer. Flushing 200,000 times costs real time; '\\n' only appends to the buffer. Flush explicitly only when you need the text to appear immediately."},{id:"s1-sync-stdio",kind:"mcq",region:"R0",tags:["io","sync_with_stdio"],prompt:"What does std::ios::sync_with_stdio(false) change?",choices:["cin and cout stop sharing buffers with C stdio, which makes them faster, so you must not mix them with scanf/printf","cout becomes safe to use from several threads","Output is no longer buffered at all","cin reads a whole line at a time instead of one token"],answer:0,explanation:"By default the C++ streams stay synchronised with C's stdin/stdout so mixing scanf and cin is safe, at a speed cost. Turning it off removes that cost, and mixing the two styles afterwards gives out-of-order results."},{id:"s1-wide-types",kind:"multi",region:"R0",tags:["types","ranges"],prompt:"Select every type guaranteed to hold at least 64 bits on any conforming platform (assume <cstdint> is included).",choices:["long long","std::int64_t","unsigned long long","int","unsigned int","short"],answers:[0,1,2],explanation:"The standard promises long long (and unsigned long long) at least 64 bits, and int64_t is exactly 64. int is only guaranteed 16 bits (32 in practice) and short 16, so never assume they are wide enough for sums that can reach 10^10."},{id:"s1-unsigned-wrap",kind:"predict",region:"R0",tags:["types","unsigned","overflow"],prompt:"What does this program print (32-bit unsigned int)?",code:`#include <iostream>
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
`,blanks:[["long long","auto"],["long long"]],explanation:"int * int is computed in int and overflows before any assignment can rescue it. Widening one operand first (the cast) makes the whole multiplication 64-bit; storing into a long long alone would be too late."}],j=[{id:"s2-switch-fallthrough",kind:"predict",region:"R0",tags:["switch","fallthrough"],prompt:"What does this program print? Two lines.",code:`#include <iostream>
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
`,explanation:"A `static` local is initialised once, the first time control reaches it, and keeps its value between calls. A plain local would be re-created as 0 each time and print 1 three times. Use static locals for one-time tables; be wary of mutable ones, because hidden state makes functions harder to test."},{id:"s2-digit-sum-parsons",kind:"parsons",region:"R0",tags:["recursion","parsons"],prompt:"Put the lines in order so the program prints the digit sum of 1234 using recursion.",lines:["#include <iostream>","int digitSum(int n) {","    if (n == 0) return 0;","    return n % 10 + digitSum(n / 10);","}","int main() {",'    std::cout << digitSum(1234) << "\\n";',"}"],explanation:"The base case comes first, so the recursion stops at 0; then the recursive step peels off the last digit (n % 10) and recurses on the rest (n / 10). The function must be defined before `main` uses it. The output is 10."}],C=[{id:"s3-ctor-forms",kind:"predict",region:"R0",tags:["vector","constructors"],prompt:"What does this program print? Four numbers on one line.",code:`#include <iostream>
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
`,blanks:[["c - 'a'","c-'a'"]],explanation:"Subtracting 'a' turns the letter's code into a slot number: 'a' maps to 0, 'b' to 1 and 'z' to 25. This needs lowercase-only input; with other characters the index would leave 0..25, so ask about the alphabet first. In \"banana\" the letter a appears three times and n twice, so it prints 32."},{id:"s3-split-parsons",kind:"parsons",region:"R0",tags:["string","split","stringstream","parsons"],prompt:"Put the lines in order so the program prints the length of each comma-separated colour name.",lines:["#include <iostream>","#include <sstream>","#include <string>","int main() {",'    std::stringstream ss("red,green,blue");',"    std::string part;","    while (std::getline(ss, part, ',')) {",'        std::cout << part.size() << " ";',"    }",'    std::cout << "\\n";',"}"],explanation:"The stream and the string it reads into are declared first. `getline(ss, part, ',')` reads up to each comma and returns false at the end of the stream, which ends the loop; the body prints the length of each field. The program prints 3 5 4."}],L=[{id:"s4-struct-class-access",kind:"mcq",region:"R0",tags:["struct","class","access"],prompt:"What is the only language-level difference between 'struct' and 'class' in C++?",choices:["The default access: struct members are public, class members are private (and the default inheritance follows the same rule)","A struct cannot have member functions or constructors","A class is stored on the heap and a struct on the stack","A struct cannot be passed by reference"],answer:0,explanation:"Both can have fields, constructors, methods and inheritance, and both can live on the stack or the heap. Only the default access differs: `struct` starts public, `class` starts private. By convention, `struct` marks plain data and `class` marks a type with invariants."},{id:"s4-init-order",kind:"predict",region:"R0",tags:["constructor","initialiser-list","order"],prompt:"What does this program print?",code:`#include <iostream>
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
`,choices:["Members of a `class` are private by default; add `public:` before the method","A method cannot be called on a local object","`twice` must be declared `static`","`class` types cannot be returned from `main`"],answer:0,explanation:"Everything in a `class` is private until a `public:` label. The judge calls your method from outside the class, so it must be public: `class Solution { public: int twice(int x) {...} };`. A `struct` would have worked, but LeetCode's template uses `class Solution { public: ... };`, so keep the label."}],P=[{id:"r0-vector-header",kind:"mcq",region:"R0",tags:["stl","includes"],prompt:"Which header gives you std::vector?",choices:["<array>","<vector>","<list>","<cstddef>"],answer:1,explanation:"std::vector lives in <vector>. <array> is the fixed-size std::array, <list> is the doubly linked list."},{id:"r0-contiguous",kind:"multi",region:"R0",tags:["stl","memory"],prompt:"Select every container that stores its elements in one contiguous block.",choices:["std::vector<int>","std::array<int, 4>","std::list<int>","std::deque<int>","std::string"],answers:[0,1,4],explanation:"vector, array and string are contiguous, so &v[0] + i reaches element i. list is nodes linked by pointers, and deque is a set of separate blocks, so neither guarantees contiguity."},{id:"r0-int-division",kind:"predict",region:"R0",tags:["arithmetic","integer-division"],prompt:"What does this program print? Two lines.",code:`#include <iostream>
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
`,blanks:[["0"],["<"]],explanation:"Zero-based loops start at 0 and use i < n, so exactly n iterations run. i <= n would print 5 as well."}];e.s(["f",0,P],77421);let E=[...P,...N,...j,...C,...L,...p,...w,...b,...k,...A,..._,...S,...z],I=c.default;e.s(["_",0,E,"F",0,I],7583)},82134,(e,t,n)=>{t.exports={"r0-vector-header":{},"r0-contiguous":{},"r0-int-division":{output:"3\n2\n"},"r0-loop-sum":{output:"22\n"},"r0-scope-error":{diagnostic:"line 5: 'i' was not declared in this scope"},"r0-const-error":{diagnostic:"line 3: assignment of read-only variable 'limit'"},"r0-sum-vector-order":{output:"43\n"},"r0-count-up-cloze":{output:"0\n1\n2\n3\n4\n"},"s1-endl-vs-newline":{},"s1-sync-stdio":{},"s1-wide-types":{},"s1-unsigned-wrap":{output:"4294967295\n"},"s1-negative-mod":{output:"-3\n-1\n1\n"},"s1-int-division-double":{output:"3\n3.5\n"},"s1-auto-sizeof":{output:"4\n8\n8\n1\n"},"s1-halving-steps":{output:"4\n"},"s1-literal-1e9":{output:"5000000000\n"},"s1-narrowing-error":{diagnostic:"line 2: narrowing conversion of '3.5e+0' from 'double' to 'int' [-Wnarrowing]"},"s1-missing-include":{diagnostic:"line 4: 'vector' was not declared in this scope"},"s1-auto-noinit-error":{diagnostic:"line 2: declaration of 'auto total' has no initializer"},"s1-big-sum-order":{output:"7000000000\n"},"s1-fast-io-cloze":{output:"ready\n"},"s1-widen-cloze":{output:"10000000000\n"},"s2-switch-fallthrough":{output:"two\nthree\n"},"s2-dangling-else":{output:"B\nC\n"},"s2-continue-trace":{output:"27\n"},"s2-break-nested":{},"s2-switch-types":{},"s2-switch-init-error":{diagnostic:"line 7: jump to case label"},"s2-by-value-tle":{},"s2-ref-vs-value":{output:"5\n6\n"},"s2-const-ref-error":{diagnostic:"line 3: passing 'const std::vector<int>' as 'this' argument discards qualifiers [-fpermissive]"},"s2-overload-pick":{output:"int\nlong long\nint\ndouble\n"},"s2-default-arg-cloze":{output:"70 21\n"},"s2-recursion-trace":{output:"13\n"},"s2-missing-base-case":{},"s2-static-local":{output:"1\n2\n3\n"},"s2-digit-sum-parsons":{output:"10\n"},"s3-ctor-forms":{output:"5 1 5 9\n"},"s3-reserve-resize":{output:"0\n4 0 4\n"},"s3-oob-index":{},"s3-size-unsigned":{},"s3-2d-init":{},"s3-erase-cost":{},"s3-auto-ref":{output:"2 4 6 \n"},"s3-const-auto-error":{diagnostic:"line 5: assignment of read-only reference 'x'"},"s3-substr-args":{output:"ter|view||iew\n"},"s3-find-npos":{output:"2 5 1\n"},"s3-char-arith":{output:"d 22 e 101\n"},"s3-to-string-stoi":{output:"2 79\n"},"s3-substr-tle":{},"s3-letter-count-cloze":{output:"32\n"},"s3-split-parsons":{output:"3 5 4 \n"},"s4-struct-class-access":{},"s4-init-order":{output:"12\n"},"s4-this-shadow":{output:"1\n"},"s4-no-default-ctor":{diagnostic:"line 6: no matching function for call to 'P::P()'"},"s4-operator-less":{output:"abc\n"},"s4-nullptr":{},"s4-list-walk":{output:"123\n"},"s4-dummy-head":{},"s4-new-pointer":{diagnostic:"line 7: conversion from 'ListNode*' to non-scalar type 'ListNode' requested"},"s4-append-parsons":{output:"1 2 3 \n"},"s4-tree-height":{output:"3 2 0\n"},"s4-arrow-dot":{diagnostic:"line 9: request for member 'val' in 'p', which is of pointer type 'TreeNode*' (maybe you meant to use '->' ?)"},"s4-tree-null-base":{},"s4-leaf-cloze":{output:"2\n"},"s4-solution-private":{diagnostic:"line 6: 'int Solution::twice(int)' is private within this context"},"forge-accumulate-trace-basic":{output:"12\n"},"forge-accumulate-trace-boundary":{output:"12\n"},"forge-accumulate-trace-wide":{output:"4000000000\n"},"forge-accumulate-trace-adds":{output:"5 3\n"},"forge-accumulate-trace-empty":{output:"0 0\n"},"r1-drop-constants":{},"r1-triangle-loop":{output:"45\n"},"r1-halving-loop":{output:"9\n"},"r1-sqrt-loop":{output:"1000\n"},"r1-amortized-push":{},"r1-sort-then-scan":{},"r1-bsearch-in-loop":{},"r1-recursion-space":{},"r1-which-linear":{},"r1-budget-1":{},"r1-budget-2":{},"r1-budget-3":{},"r1-budget-4":{},"r1-budget-5":{},"r1-budget-6":{},"r1-recurrence-1":{},"r1-recurrence-2":{},"r1-recurrence-3":{},"r1-recurrence-4":{},"r1-recurrence-5":{},"r1-recurrence-6":{},"r2-hash-signal":{},"r2-hash-cost":{},"r2-map-bracket-insert":{output:"0 2\n"},"r2-count-loop":{output:"3 2 1 3\n"},"r2-pair-complement":{output:"0 1\n"},"r2-set-insert-result":{output:"11010\n"},"r2-hash-pair-order":{},"r2-find-vs-count":{},"r2-hash-key-sorted":{output:"3\n"},"r2-hash-const-bracket":{diagnostic:"line 5: passing 'const std::unordered_map<std::__cxx11::basic_string<char>, int>' as 'this' argument discards qualifiers [-fpermissive]"},"r2-hash-chain-start":{},"r2-hash-iteration-order":{},"r2-tp-signal":{},"r2-tp-why-move":{},"r2-tp-sorted-pair":{output:"4\n"},"r2-tp-compact":{output:"4 3355\n"},"r2-tp-compact-order":{output:"3\n"},"r2-tp-dedupe-3sum":{},"r2-tp-water-move":{},"r2-tp-trap-cost":{},"r2-tp-dutch":{output:"001122\n"},"r2-tp-boats":{},"r2-tp-palindrome-skip":{output:"1\n"},"r2-tp-sort-cost":{},"r2-ps-signal":{},"r2-ps-build":{output:"0 2 7 8 12 \n"},"r2-ps-range":{output:"10\n"},"r2-ps-subk-seed":{},"r2-ps-subk-trace":{output:"5\n"},"r2-ps-negatives":{},"r2-diff-array":{output:"0 4 5 5 1 \n"},"r2-diff-order":{output:"0 7 7 0 \n"},"r2-kadane-restart":{output:"5\n"},"r2-kadane-negative":{},"r2-circular":{},"r2-ps-overflow":{},"forge-prefix-hash-trace-basic":{output:"2\n"},"forge-prefix-hash-trace-zeros":{output:"6\n"},"forge-prefix-hash-trace-negative":{output:"4\n"},"forge-prefix-hash-trace-none":{output:"0\n"},"forge-prefix-hash-trace-wide":{output:"2\n"},"forge-opposite-trace-basic":{output:"49\n"},"forge-opposite-trace-tie":{output:"10\n"},"forge-opposite-trace-single":{output:"0\n"},"forge-opposite-trace-valley":{output:"36\n"},"forge-opposite-trace-wide":{output:"8000000000\n"},"r3-win-signal":{},"r3-win-fixed-cost":{},"r3-win-fixed-sums":{output:"7 16 14 15 \n"},"r3-win-monotone":{},"r3-win-cost":{},"r3-win-longest-trace":{output:"3\n"},"r3-win-update-spot":{},"r3-win-shortest-parsons":{output:"2\n"},"r3-win-negatives":{},"r3-win-counts":{},"r3-win-exactly-k":{},"r3-win-atmost-count":{output:"4\n"},"r3-win-count-add":{},"r3-win-long-long":{},"r3-win-lambda-capture":{diagnostic:"line 6: 'limit' is not captured"},"r3-win-fixed-cloze":{output:"16\n"},"r3-win-shrink-cloze":{output:"3\n"},"r3-win-multi-signal":{},"r3-win-anagram":{},"r3-dq-signal":{},"r3-dq-why-pop":{},"r3-dq-indices":{},"r3-dq-cost":{},"r3-dq-window-max":{output:"9 8 8 8 \n"},"r3-dq-front-trace":{output:"3\n"},"r3-dq-equal":{},"r3-dq-slide-parsons":{output:"4 12 12 \n"},"r3-dq-expire":{},"r3-dq-api":{},"r3-dq-empty":{},"r3-dq-min-cloze":{output:"2 2 3 1 \n"},"r3-dq-prefix-why":{},"r3-dq-prefix-rules":{},"r3-dq-prefix-shortest":{output:"3\n"},"r3-dq-prefix-ll":{},"r3-dq-no-push":{diagnostic:"line 5: 'class std::deque<int>' has no member named 'push'"},"r3-dq-vs-heap":{},"forge-variable-window-trace-basic":{output:"3\n"},"forge-variable-window-trace-limit":{output:"4\n"},"forge-variable-window-trace-all-same":{output:"4\n"},"forge-variable-window-trace-empty":{output:"0\n"},"forge-variable-window-trace-tight":{output:"2\n"},"forge-monotonic-deque-trace-basic":{output:"7 7 5\n"},"forge-monotonic-deque-trace-equal":{output:"4 4\n"},"forge-monotonic-deque-trace-width-one":{output:"-3 -8 -1\n"},"forge-monotonic-deque-trace-rising":{output:"3 4 5\n"},"forge-monotonic-deque-trace-falling":{output:"5 4 3\n"},"r4-hash-signal":{},"r4-hash-avg":{},"r4-hash-chain-trace":{output:"4\n"},"r4-hash-load":{},"r4-hash-rehash":{},"r4-hash-openaddr":{},"r4-hash-subscript":{output:"2 0 0\n"},"r4-hash-order":{},"r4-hash-pair-error":{diagnostic:"line 5: use of deleted function 'std::unordered_map<_Key, _Tp, _Hash, _Pred, _Alloc>::unordered_map() [with _Key = std::pair<int, int>; _Tp = int; _Hash = std::hash<std::pair<int, int> >; _Pred = std::equal_to<std::pair<int, int> >; _Alloc = std::allocator<std::pair<const std::pair<int, int>, int> >]'"},"r4-hash-anti":{},"r4-hash-set-cloze":{output:"7\n"},"r4-hash-freq-parsons":{output:"3\n"},"r4-key-def":{},"r4-key-anagram":{output:"eilnst 1 0\n"},"r4-key-delim":{},"r4-key-delim-trace":{output:"1\n"},"r4-key-cell-cloze":{output:"13 2\n"},"r4-key-bijection":{},"r4-key-bijection-trace":{output:"100\n"},"r4-key-prefix-predict":{output:"3\n"},"r4-key-prefix-parsons":{output:"2\n"},"r4-key-multi":{},"r4-key-ordered":{},"r4-key-const-error":{diagnostic:"line 4: passing 'const std::unordered_map<int, int>' as 'this' argument discards qualifiers [-fpermissive]"},"r4-rh-signal":{},"r4-rh-update":{},"r4-rh-collision":{},"r4-rh-cost":{},"r4-rh-negative":{},"r4-rh-overflow":{},"r4-rh-2bit-predict":{output:"27 108 177 \n"},"r4-rh-mask-cloze":{output:"4\n"},"r4-rh-bsearch-why":{},"r4-rh-bsearch-trace":{output:"3\n"},"r4-rh-bsearch-parsons":{output:"6\n"},"r4-rh-anti":{},"r4-rh-words":{},"forge-two-way-map-trace-basic":{output:"4\n"},"forge-two-way-map-trace-letter-clash":{output:"3\n"},"forge-two-way-map-trace-word-clash":{output:"1\n"},"forge-two-way-map-trace-short-words":{output:"2\n"},"forge-two-way-map-trace-empty":{output:"0\n"},"forge-rolling-key-trace-basic":{output:"[ACG, CGA, GAC]\n"},"forge-rolling-key-trace-overlap":{output:"[AA]\n"},"forge-rolling-key-trace-none":{output:"[]\n"},"forge-rolling-key-trace-too-long":{output:"[]\n"},"forge-rolling-key-trace-thrice":{output:"[TT]\n"}}}]);