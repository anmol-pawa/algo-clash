(()=>{"use strict";(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,70601,50902,71863,2063,e=>{var t=e.i(43476);function i(e){let t=[],i=/`([^`]+)`|\*\*([^*]+)\*\*/g,n=0;for(let s=i.exec(e);s;s=i.exec(e))s.index>n&&t.push({kind:"text",text:e.slice(n,s.index)}),t.push(void 0!==s[1]?{kind:"code",text:s[1]}:{kind:"bold",text:s[2]}),n=s.index+s[0].length;return n<e.length&&t.push({kind:"text",text:e.slice(n)}),t}function n(e){let t=[];for(let i of e?.blocks??[])if("ul"===i.kind)for(let e of i.items){let i=e.filter(e=>"code"===e.kind).map(e=>e.text).join("  "),n=e.filter(e=>"code"!==e.kind).map(e=>e.text).join("").replace(/\s+/g," ").trim();t.push({value:i||n,label:i?n:""})}return t}function s({parts:e}){return(0,t.jsx)(t.Fragment,{children:e.map((e,i)=>"code"===e.kind?(0,t.jsx)("code",{className:"rounded bg-black/30 px-1 font-mono text-[0.9em] text-[var(--accent)]",children:e.text},i):"bold"===e.kind?(0,t.jsx)("strong",{className:"text-[var(--gold)]",children:e.text},i):(0,t.jsx)("span",{children:e.text},i))})}e.s(["_",0,n,"W",0,function(e){let t="",n=[],s={heading:"",blocks:[]},r=[],a=null,o=()=>{r.length&&s.blocks.push({kind:"p",inline:i(r.join(" "))}),a&&s.blocks.push({kind:"ul",items:a}),r=[],a=null},l=()=>{o(),(s.heading||s.blocks.length)&&n.push(s)};for(let n of e.split("\n")){let e=n.trimEnd();e.startsWith("# ")?t=e.slice(2).trim():e.startsWith("## ")?(l(),s={heading:e.slice(3).trim(),blocks:[]}):/^[-*] /.test(e)?(r.length&&o(),(a??=[]).push(i(e.slice(2)))):""===e.trim()?o():(a&&o(),r.push(e.trim()))}return l(),{title:t,sections:n}}],50902),e.s(["f",0,function({statement:e,badge:i}){return(0,t.jsxs)("article",{className:"panel flex h-full flex-col gap-3 overflow-y-auto p-4 text-sm leading-relaxed","aria-label":"Problem statement",children:[(0,t.jsxs)("header",{className:"flex items-center justify-between gap-2",children:[(0,t.jsx)("h2",{className:"font-display text-xl text-[var(--gold)]",children:e.title}),i]}),e.sections.map((e,i)=>(0,t.jsxs)("section",{className:"flex flex-col gap-2",children:[e.heading&&(0,t.jsx)("h3",{className:"font-display text-xs uppercase tracking-wider opacity-70",children:e.heading}),/^constraints/i.test(e.heading)?(0,t.jsx)("ul",{className:"flex flex-wrap gap-2",children:n(e).map((e,i)=>(0,t.jsxs)("li",{className:"rounded border border-white/10 bg-black/25 px-2 py-1",children:[(0,t.jsx)("code",{className:"font-mono text-[var(--accent)]",children:e.value}),e.label&&(0,t.jsx)("span",{className:"ml-2 opacity-80",children:e.label})]},i))}):e.blocks.map((e,i)=>"p"===e.kind?(0,t.jsx)("p",{children:(0,t.jsx)(s,{parts:e.inline})},i):(0,t.jsx)("ul",{className:"list-disc space-y-1 pl-5",children:e.items.map((e,i)=>(0,t.jsx)("li",{children:(0,t.jsx)(s,{parts:e})},i))},i))]},i))]})}],70601);let r={win:"text-emerald-300",lose:"text-rose-300",warn:"text-amber-300"},a={AC:"bg-emerald-500/30",WA:"bg-rose-500/30",TLE:"bg-amber-500/30",RE:"bg-rose-500/30",CE:"bg-amber-500/30"};function o({label:e,text:i,mark:n}){let s=void 0===n?-1:n;return(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("span",{className:"w-16 shrink-0 opacity-60",children:e}),(0,t.jsx)("code",{className:"min-w-0 break-all font-mono",children:s<0?i:(0,t.jsxs)(t.Fragment,{children:[i.slice(0,s),(0,t.jsx)("mark",{className:"bg-rose-500/50 text-inherit",children:i.slice(s,s+1)||"∅"}),i.slice(s+1)]})})]})}e.s(["f",0,function({view:e,hideDiff:i=!1}){return e?(0,t.jsxs)("section",{className:"panel flex flex-col gap-2 p-4 text-sm","aria-live":"polite","aria-label":"Verdict",children:[(0,t.jsxs)("div",{className:"flex items-baseline justify-between gap-2",children:[(0,t.jsx)("h3",{"data-testid":"verdict",className:`font-display text-lg ${r[e.tone]}`,children:e.headline}),"CE"!==e.verdict&&(0,t.jsxs)("span",{className:"opacity-70",children:[e.passed,"/",e.total," passed"]})]}),(0,t.jsx)("p",{children:e.detail}),e.compile?.why&&(0,t.jsxs)("p",{className:"opacity-90",children:[(0,t.jsx)("strong",{children:"Why:"})," ",e.compile.why," ",(0,t.jsx)("strong",{children:"Fix:"})," ",e.compile.fix]}),e.compile&&(0,t.jsx)("code",{className:"break-all rounded bg-black/30 p-2 font-mono text-xs",children:e.compile.message}),e.rows.length>0&&(0,t.jsx)("ol",{className:"flex flex-wrap gap-1","aria-label":"Per-test results",children:e.rows.map(e=>(0,t.jsx)("li",{title:`${e.group??"test"} \xb7 ${e.ms} ms`,className:`flex h-8 min-w-8 items-center justify-center rounded px-1 text-xs ${a[e.verdict]}`,children:e.index+1},e.index))}),e.diff&&i&&(0,t.jsx)("p",{className:"rounded bg-black/30 p-2 text-xs","data-testid":"diff-hidden",children:"Interview rules: the failing input and diff are hidden. Reproduce it with your own test (or spend a Debug Lens)."}),e.diff&&!i&&(0,t.jsxs)("div",{className:"flex flex-col gap-1 rounded bg-black/30 p-2 text-xs",children:[(0,t.jsx)(o,{label:"input",text:e.diff.input.replace(/\n/g," ⏎ ")}),(0,t.jsx)(o,{label:"expected",text:e.diff.expected}),(0,t.jsx)(o,{label:"got",text:e.diff.got,mark:e.diff.firstDiff})]})]}):(0,t.jsx)("div",{className:"panel p-4 text-sm opacity-70",children:"Run your code to see the verdict here."})}],71863);let l={AC:"Accepted",WA:"Wrong answer",TLE:"Time limit exceeded",RE:"Runtime error",CE:"Compile error"};e.s(["f",0,function(e,t){let{verdict:i}=e,n=e.outcomes.map((e,i)=>({index:i,group:t[i]?.group,verdict:e.verdict,ms:e.wallMs})),s=e.outcomes.filter(e=>"AC"===e.verdict).length,r={verdict:i,tone:"AC"===i?"win":"CE"===i?"warn":"lose",headline:l[i],detail:"",passed:s,total:t.length,rows:n};if("AC"===i)r.detail=`All ${t.length} tests passed. Slowest test: ${e.maxMs} ms.`;else if("CE"===i){let t=e.firstError;r.detail=t?`Line ${t.line}: ${t.entry?.title??t.message}`:e.diagnostics?.split("\n")[0]??"The code did not compile.",t&&(r.compile={line:t.line,message:t.message,title:t.entry?.title,why:t.entry?.why,fix:t.entry?.fix})}else if(null!==e.failedAt){let n=e.outcomes[e.failedAt],s=t[e.failedAt];s&&(r.failInput=s.input),r.detail=`Test ${e.failedAt+1}${s?.group?` (${s.group})`:""}: ${n.reason??l[i]}`,"WA"===i&&s&&void 0!==n.got&&(r.diff={input:s.input,expected:n.expected??s.expected.trim(),got:n.got,firstDiff:function(e,t){let i=Math.min(e.length,t.length);for(let n=0;n<i;n++)if(e[n]!==t[n])return n;return i}(n.got,n.expected??s.expected.trim())})}return r}],2063)},66429,27288,5665,78155,1153,3234,8994,95976,20225,33174,18469,e=>{e.s(["f",0,{id:"pouch-sum",region:"R0",title:"Pouch Sum",difficulty:"E",patterns:["syntax"],signals:["add up only the values that qualify","total may exceed 32 bits","one pass with an accumulator"],prerequisites:["cargo-total"],parSeconds:180,complexity:{time:"O(n)",space:"O(1)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.3,adversarial:.2,perf:.3},similar:[{name:"Sum of All Odd Length Subarrays",lcNumber:1588}],spec:{kind:"function",name:"pouchSum",returns:"long long",params:[{type:"vector<int>",name:"coins"},{type:"int",name:"minValue"}]}}],66429),e.s(["f",0,{id:"exact-stretches",region:"R2",title:"Exact Stretches",difficulty:"M",patterns:["prefix-sum","hash-lookup"],signals:["count subarrays with a given sum","negatives allowed so no sliding window","earlier prefix equals current minus target"],prerequisites:["range-ledger","matching-pairs"],parSeconds:900,complexity:{time:"O(n)",space:"O(n)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.2,adversarial:.25,perf:.35},similar:[{name:"Subarray Sum Equals K",lcNumber:560}],spec:{kind:"function",name:"countStretches",returns:"long long",params:[{type:"vector<int>",name:"nums"},{type:"long long",name:"target"}]}}],27288),e.s(["f",0,{id:"widest-basin",region:"R2",title:"Widest Basin",difficulty:"M",patterns:["two-pointers"],signals:["best pair of positions","value depends on the smaller side and the distance","O(n) required"],prerequisites:["mirror-check"],parSeconds:900,complexity:{time:"O(n)",space:"O(1)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.2,adversarial:.25,perf:.35},similar:[{name:"Container With Most Water",lcNumber:11}],spec:{kind:"function",name:"bestBasin",returns:"long long",params:[{type:"vector<int>",name:"heights"}]}}],5665),e.s(["f",0,{id:"pane-peaks",region:"R3",title:"Pane Peaks",difficulty:"H",patterns:["monotonic-deque","sliding-window"],signals:["best value in every window of fixed width","window slides one step at a time","old candidates can never win again"],prerequisites:["peak-stretch","tight-patch"],parSeconds:1500,complexity:{time:"O(n)",space:"O(k)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.2,adversarial:.25,perf:.35},similar:[{name:"Sliding Window Maximum",lcNumber:239}],spec:{kind:"function",name:"paneMaxima",returns:"vector<int>",params:[{type:"vector<int>",name:"heat"},{type:"int",name:"width"}]}}],78155),e.s(["f",0,{id:"tidy-tape",region:"R3",title:"Tidy Tape",difficulty:"M",patterns:["sliding-window"],signals:["longest contiguous stretch","no symbol more than m times","shrink from the left while a count is too high"],prerequisites:["peak-stretch"],parSeconds:840,complexity:{time:"O(n)",space:"O(1)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.2,adversarial:.25,perf:.35},similar:[{name:"Longest Substring Without Repeating Characters",lcNumber:3}],spec:{kind:"function",name:"longestTidy",returns:"int",params:[{type:"string",name:"tape"},{type:"int",name:"m"}]}}],1153),e.s(["f",0,{id:"echo-strand",region:"R4",title:"Echo Strand",difficulty:"M",patterns:["hash-design","sliding-window"],signals:["fixed-length substrings that repeat","encode a window as a number","update the key in O(1) as the window slides"],prerequisites:["twin-scripts","crate-variety"],parSeconds:900,complexity:{time:"O(n)",space:"O(n)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.2,adversarial:.2,perf:.4},similar:[{name:"Repeated DNA Sequences",lcNumber:187}],spec:{kind:"function",name:"echoes",returns:"vector<string>",params:[{type:"string",name:"strand"},{type:"int",name:"k"}]}}],3234),e.s(["f",0,{id:"verse-match",region:"R4",title:"Verse Match",difficulty:"M",patterns:["hash-design"],signals:["pattern letters vs words","one-to-one both ways","longest consistent prefix"],prerequisites:["twin-scripts"],parSeconds:660,complexity:{time:"O(n · w)",space:"O(n · w)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.2,adversarial:.25,perf:.35},similar:[{name:"Word Pattern",lcNumber:290}],spec:{kind:"function",name:"matchingPrefix",returns:"int",params:[{type:"string",name:"pattern"},{type:"vector<string>",name:"words"}]}}],8994);let t={id:"burrow-cache",region:"R5",title:"Burrow Cache",difficulty:"M",patterns:["linked-list","hash-lookup","design-ds"],signals:["evict the least recently used","every operation must be O(1)","need to move an item to the front from the middle","hash map into a doubly linked list"],prerequisites:["flip-chain","mirror-twins"],parSeconds:1200,complexity:{time:"O(1)",space:"O(k)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.25,adversarial:.2,perf:.35},similar:[{name:"LRU Cache",lcNumber:146}],spec:{kind:"design",className:"BurrowCache",ctor:[{type:"int",name:"capacity"}],methods:[{name:"get",returns:"int",params:[{type:"int",name:"key"}]},{name:"put",returns:"void",params:[{type:"int",name:"key"},{type:"int",name:"value"}]}]}};e.s(["f",0,t],95976),e.s(["f",0,{id:"flip-chain",region:"R5",title:"Flip Chain",difficulty:"E",patterns:["linked-list"],signals:["reverse the order of a singly linked list","in place, no new nodes","each node must point backwards"],prerequisites:[],parSeconds:300,complexity:{time:"O(n)",space:"O(1)"},timeLimitMs:1e3,testWeights:{basic:.25,edge:.25,adversarial:.2,perf:.3},similar:[{name:"Reverse Linked List",lcNumber:206}],spec:{kind:"function",name:"flipChain",returns:"ListNode*",params:[{type:"ListNode*",name:"head"}]}}],20225),e.s(["f",0,{id:"heat-wave",region:"R6",title:"Heat Wave",difficulty:"M",patterns:["monotonic-stack"],signals:["next greater element","how many steps until something bigger","unresolved items wait on a stack"],prerequisites:["crate-brackets"],parSeconds:600,complexity:{time:"O(n)",space:"O(n)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.2,adversarial:.25,perf:.35},similar:[{name:"Daily Temperatures",lcNumber:739}],spec:{kind:"function",name:"waitDays",returns:"vector<int>",params:[{type:"vector<int>&",name:"temps"}]}}],33174),e.s(["f",0,{id:"skyline-hall",region:"R6",title:"Skyline Hall",difficulty:"H",patterns:["monotonic-stack"],signals:["histogram area","previous smaller and next smaller","widest span where a bar is the minimum"],prerequisites:["crate-brackets"],parSeconds:1500,complexity:{time:"O(n)",space:"O(n)"},timeLimitMs:1e3,testWeights:{basic:.2,edge:.2,adversarial:.3,perf:.3},similar:[{name:"Largest Rectangle in Histogram",lcNumber:84}],spec:{kind:"function",name:"largestHall",returns:"long long",params:[{type:"vector<int>&",name:"heights"}]}}],18469)},43393,e=>{let t=(e,t,i,n)=>"number"==typeof e&&Number.isFinite(e)?Math.min(n,Math.max(i,e)):t,i=e=>[...e].sort((e,t)=>t.at-e.at);e.s(["n",0,function(e,t,n){return i(e.filter(e=>e.problemId===t&&e.at<n))[0]},"h",0,function(e){let i=e&&"object"==typeof e&&!Array.isArray(e)?e:{};if("string"!=typeof i.problemId||!i.problemId||"string"!=typeof i.code)return null;let n=(Array.isArray(i.patterns)?i.patterns:[]).filter(e=>"string"==typeof e).map(e=>e.slice(0,40)).slice(0,8);return{problemId:i.problemId.slice(0,80),at:t(i.at,0,0,Number.MAX_SAFE_INTEGER),code:i.code.slice(0,2e5),seconds:t(i.seconds,0,0,86400),hintsUsed:Math.round(t(i.hintsUsed,0,0,3)),assisted:!0===i.assisted,patterns:n,promptChoice:Math.round(t(i.promptChoice,-1,-1,9)),promptCorrect:!0===i.promptCorrect}},"Y",0,function(e,t,n=e=>e){let s=t.trim().toLowerCase();return s?i(e).filter(e=>e.problemId.toLowerCase().includes(s)||n(e.problemId).toLowerCase().includes(s)||e.patterns.some(e=>e.toLowerCase().includes(s))||e.code.toLowerCase().includes(s)):i(e)}])},83587,64517,e=>{let t="/algo-clash",i=null,n=1;e.s(["S",0,function(e,s=["-O2"]){let r=i??=new Worker(`${t}/judge/compile-worker.js`,{type:"module"}),a=n++;return new Promise(t=>{let i=e=>{e.data.id===a&&(r.removeEventListener("message",i),t(e.data))};r.addEventListener("message",i),r.postMessage({id:a,source:e,flags:s})})},"M",0,function(e,i,n,s=[]){let r=new Worker(`${t}/judge/run-worker.js`);return new Promise(t=>{let a=setTimeout(()=>{r.terminate(),t({status:"TLE",exitCode:-1,stdout:"",stderr:"",wallMs:n,detail:"timeout",memPages:0})},n);r.onmessage=e=>{clearTimeout(a),r.terminate(),t(e.data)},r.onerror=e=>{clearTimeout(a),r.terminate(),t({status:"RE",exitCode:-1,stdout:"",stderr:"",wallMs:0,detail:String(e.message),memPages:0})},r.postMessage({wasm:e.slice(),stdin:i,args:s})})}],83587);let s="#include <vector>\n#include <string>\n#include <map>\n#include <unordered_map>\n#include <algorithm>\n",r=e=>`${s}int main() {
${e}
  return 0;
}
`,a=[{id:"expected-semicolon",pattern:/expected ';'(?! after (class|struct|enum))/,title:"Missing semicolon",why:"A statement or declaration must end with `;`. Clang reports it at the end of the previous line.",fix:"Add `;` after the statement just before the reported position (also after a `struct`/`class` closing brace).",snippet:r("  int x = 1\n  x++;")},{id:"undeclared-identifier",pattern:/use of undeclared identifier '/,title:"Unknown name",why:"The name is not declared at this point: a typo, a missing variable declaration, a missing `#include`, or it is declared in an inner scope.",fix:"Check spelling and case, declare the variable before use, and make sure it is in scope.",snippet:r("  total = 5;")},{id:"no-member-named",pattern:/no member named '/,title:"No such member",why:"The type has no field or method with that name. Common with STL: `v.length()` on a vector, `s.push()` on a string.",fix:"Look up the right name (`size()`, `push_back`, `emplace`, `top` vs `front`).",snippet:r("  std::vector<int> v;\n  int n = v.length();")},{id:"no-matching-function",pattern:/no matching function for call to/,title:"No function fits these arguments",why:"No overload accepts the argument types or count you passed (too few or too many arguments also land here).",fix:"Compare your call with the signature in the notes below the error: argument count, order, and const-ness.",snippet:r("  std::vector<int> v;\n  std::sort(v);")},{id:"no-matching-member",pattern:/no matching member function for call to/,title:"No method fits these arguments",why:"The method exists but not with these argument types or count.",fix:"Check the method's parameters in the candidate notes below.",snippet:r("  std::vector<int> v;\n  v.push_back(1, 2);")},{id:"cannot-initialize",pattern:/cannot initialize a (variable|parameter|return object) of type '[^'*]*'/,title:"Type mismatch on initialisation",why:"You are giving a value of one type to something of an incompatible type, such as a string literal to an `int` or a pointer to a `bool` vector element.",fix:"Convert explicitly, or change the declared type to match the value.",snippet:r('  int x = "hello";')},{id:"no-viable-conversion",pattern:/no viable conversion from/,title:"No conversion between these types",why:"There is no implicit conversion between the two types, for example `std::string` to `int` or `vector<int>` to `vector<long long>`.",fix:"Convert element by element, use `std::stoi`/`std::to_string`, or declare the right type.",snippet:r('  std::string s = "12";\n  int n = s;')},{id:"invalid-operands",pattern:/invalid operands to binary expression/,title:"Operator does not apply to these types",why:"The operator is not defined for the operand types, e.g. `+` on two `vector`s or `==` on a struct without `operator==`.",fix:"Use a function that does what you mean (`insert`, a loop) or define the operator.",snippet:r("  std::vector<int> a, b;\n  auto c = a + b;")},{id:"const-assign",pattern:/cannot assign to (variable|return value|non-static data member|.*) .*const|read-only variable is not assignable|cannot assign to variable '.*' with const-qualified type/,title:"Assigning to a const value",why:"The target is `const` (or a `const&` parameter), so it cannot change.",fix:"Remove `const` if you need to modify it, or copy it into a local variable first.",snippet:r("  const int x = 1;\n  x = 2;")},{id:"discards-qualifiers",pattern:/(drops|discards) '?const'? qualifier|'const' qualifier|is not marked const/,title:"Calling a mutating method through const",why:"You called a non-const method on a `const` object or `const&` parameter.",fix:"Take the parameter by non-const reference, or mark the method `const` if it does not modify the object.",snippet:`${s}struct A { void bump() { n++; } int n = 0; };
void f(const A& a) { a.bump(); }
int main() { A a; f(a); }
`},{id:"non-const-ref-temp",pattern:/non-const lvalue reference to type '.*' cannot bind to/,title:"Reference cannot bind to this value",why:"A non-const `T&` only binds to a named variable of exactly that type, not to a temporary or a different type.",fix:"Pass a variable of the right type, or take `const T&` / by value.",snippet:r("  int& r = 5;")},{id:"redefinition",pattern:/redefinition of '/,title:"Declared twice",why:"The same name is declared twice in the same scope.",fix:"Rename one, or drop the second type (`int`) to reuse the variable.",snippet:r("  int x = 1;\n  int x = 2;")},{id:"unknown-type",pattern:/unknown type name '/,title:"Unknown type",why:"Clang does not know this type: missing `#include`, missing `std::`, or a typo (`string` without `std::` in a header).",fix:"Add the right `#include` and write `std::string`, `std::vector`, ... or `using namespace std;` in solution files.",snippet:"int f() { Foo x; return 0; }\nint main() { return f(); }\n"},{id:"not-member-of-std",pattern:/no (type|template) named '.*' in namespace 'std'|no member named '.*' in namespace 'std'/,title:"That is not in std",why:"The name does not exist in `std`, or its header is not included.",fix:"Check the spelling (`unordered_map`, `priority_queue`) and include the matching header.",snippet:"#include <vector>\nint main() { std::vektor<int> v; }\n"},{id:"missing-template-args",pattern:/requires template arguments|no viable constructor or deduction guide/,title:"Template arguments missing",why:"`vector`, `map` and friends need their type arguments.",fix:"Write `vector<int>` (C++17 can deduce some from constructor arguments, but not from nothing).",snippet:"#include <vector>\nint main() { std::vector v; }\n"},{id:"expected-expression",pattern:/expected expression/,title:"Expression expected here",why:"Clang found a token that cannot start an expression: an unfinished line, a stray `)` or an operator with nothing after it.",fix:"Look at the caret: finish the expression or remove the extra token.",snippet:r("  int x = ;")},{id:"expected-rparen",pattern:/expected '\)'/,title:"Missing closing parenthesis",why:"A `(` was opened but not closed.",fix:"Count your parentheses in the condition or call on that line.",snippet:r("  int x = 1;\n  if (x > 0 {\n  }")},{id:"expected-brace",pattern:/expected '}'|extraneous closing brace/,title:"Unbalanced braces",why:"A `{` is never closed, or there is one `}` too many.",fix:"Re-indent the function and match each brace; let the editor highlight the pair.",snippet:"int main() {\n  int x = 1;\n"},{id:"expected-unqualified-id",pattern:/expected unqualified-id|a type specifier is required/,title:"Declaration or name expected",why:"Something sits where a name or declaration should be, often an extra `}` or `;`, or a statement outside a function.",fix:"Check braces above the caret and make sure statements are inside a function.",snippet:"int x = 1;\nx = 2;\nint main() {}\n"},{id:"extra-tokens",pattern:/extraneous '\)' before ';'|expected ';' after (class|struct|enum)|extra tokens/,title:"Stray token",why:"A class/struct/enum definition must end with `;`, or there is an extra `)` or token.",fix:"Add `;` after the closing `}` of the class, or remove the stray token.",snippet:"struct P { int x; }\nint main() {}\n"},{id:"return-type-void",pattern:/void function '.*' should not return a value|should not return a value/,title:"Returning a value from void",why:"The function is declared `void`, so `return x;` is not allowed.",fix:"Change the return type, or write `return;`.",snippet:"void f() { return 1; }\nint main() { f(); }\n"},{id:"return-missing-value",pattern:/non-void function '.*' should return a value|non-void (function|lambda) should return a value/,title:"Missing return value",why:"The function promises a value but a path returns nothing.",fix:"Return a value of the declared type on every path.",snippet:"int f() { return; }\nint main() { f(); }\n"},{id:"member-ptr",pattern:/member reference type '.*' is a pointer; did you mean to use '->'/,title:"Use -> on pointers",why:"`.` accesses members of an object; through a pointer you need `->`.",fix:"Write `node->next` instead of `node.next` (or `(*node).next`).",snippet:"struct N { int v; N* next; };\nint f(N* n) { return n.v; }\nint main() {}\n"},{id:"member-nonptr",pattern:/member reference type '.*' is not a pointer; did you mean to use '\.'|is not a pointer/,title:"Use . on objects",why:"`->` is for pointers; this is an object or reference.",fix:"Write `node.next` instead of `node->next`.",snippet:"struct N { int v; };\nint f(N n) { return n->v; }\nint main() {}\n"},{id:"not-subscriptable",pattern:/type '.*' does not provide a subscript operator|subscripted value is not an array/,title:"Cannot index this type",why:"`[]` does not exist for this type, e.g. `std::set`, `std::list`, or an `int`.",fix:"Use iterators, `std::next`, or a different container (`vector`, `map`).",snippet:"#include <set>\nint main() { std::set<int> s; return s[0]; }\n"},{id:"private-member",pattern:/is a private member of/,title:"Private member",why:"Members of a `class` are private by default, and code outside cannot touch them.",fix:"Put the member in a `public:` section, or use a public method.",snippet:"class A { int x = 0; };\nint main() { A a; return a.x; }\n"},{id:"abstract-class",pattern:/allocating an object of abstract class type|is an abstract class/,title:"Cannot create an abstract class",why:"The class has a pure virtual function (`= 0`) that nothing overrides.",fix:"Create a derived class that overrides every pure virtual method and instantiate that.",snippet:"struct I { virtual void f() = 0; };\nint main() { I i; }\n"},{id:"no-default-ctor",pattern:/no matching constructor for initialization of|no default constructor exists/,title:"No constructor fits",why:"The type has no constructor matching these arguments (or no default constructor, when you gave none).",fix:"Pass the constructor arguments, or add the constructor.",snippet:"struct A { A(int) {} };\nint main() { A a; }\n"},{id:"break-outside",pattern:/'(break|continue)' statement not in (loop|switch)/,title:"break/continue outside a loop",why:"`break` and `continue` only work inside a loop (`break` also in a `switch`). Usually a brace is misplaced and the loop ended early.",fix:"Check the braces around the loop body.",snippet:r("  break;")},{id:"deduce-auto",pattern:/(cannot deduce type for|declaration of variable '.*' with deduced type 'auto' requires an initializer)/,title:"auto needs an initial value",why:"`auto` copies the type of its initialiser, so it must have one.",fix:"Write the type or give an initial value.",snippet:r("  auto x;")},{id:"jump-bypasses",pattern:/cannot jump from switch statement to this case label|jump bypasses variable initialization/,title:"Declaration inside a case",why:"A `case` jumps past a variable's initialisation. Declare it inside braces.",fix:"Wrap the case body in `{ ... }`.",snippet:r("  int k = 1;\n  switch (k) {\n    case 0:\n      int y = 3;\n      break;\n    case 1:\n      break;\n  }")},{id:"narrowing",pattern:/(type '.*' cannot be narrowed to '.*' in initializer list|non-constant-expression cannot be narrowed)/,title:"Narrowing in braces",why:"Brace-initialisation refuses to silently lose information (e.g. `long long` to `int`).",fix:"Use the matching type or an explicit cast.",snippet:r("  long long big = 5;\n  int x{big};")},{id:"lambda-capture",pattern:/variable '.*' cannot be implicitly captured in a lambda with no capture-default specified/,title:"Lambda needs a capture",why:"A lambda cannot see local variables unless you capture them.",fix:"Use `[&]` (by reference) or `[=]`, or list the variable in `[...]`.",snippet:r("  int k = 2;\n  auto f = [](int x) { return x * k; };\n  f(1);")},{id:"recursive-lambda",pattern:/variable '.*' declared with deduced type 'auto' cannot appear in its own initializer/,title:"auto lambda cannot call itself",why:"The type of an `auto` variable is unknown while its own initialiser is being compiled.",fix:"Declare it as `std::function<int(int)> f = [&](int x) { ... f(x-1) ... };` or use a named helper.",snippet:r("  auto f = [&](int n) -> int { return n ? f(n - 1) : 0; };\n  f(2);")},{id:"ptr-compare-int",pattern:/ordered comparison between pointer and integer|comparison between pointer and integer/,title:"Comparing a pointer with a number",why:"A pointer such as a `ListNode*` cannot be compared with an integer other than `nullptr`/`0`.",fix:"Compare `node->val` with the number, or `node` with `nullptr`.",snippet:"struct N { int v; };\nbool f(N* n) { return n > 5; }\nint main() {}\n"},{id:"ptr-int-conv",pattern:/(incompatible (integer to pointer|pointer to integer) conversion|cannot initialize a variable of type '.*\*' with an (lvalue|rvalue) of type 'int')/,title:"Integer where a pointer is expected",why:'A number cannot become a pointer. Use `nullptr` for "no node".',fix:"Write `nullptr` (or `new Node(x)` for a real node).",snippet:"struct N { int v; };\nint main() { N* p = 5; }\n"},{id:"static-nonstatic",pattern:/(call to non-static member function without an object argument|invalid use of non-static data member|invalid use of member '.*' in static member function)/,title:"Instance member used without an object",why:"A non-static member needs an object (`this`); static functions and free functions have none.",fix:"Make the helper `static`, or call it on an object.",snippet:"struct S { int f(); static int g() { return f(); } };\nint S::f() { return 1; }\nint main() {}\n"},{id:"undefined-ref",pattern:/undefined (reference|symbol)|function '.*' is not defined|use of undeclared identifier 'main'/,title:"Declared but never defined",why:"The linker found a call to a function with no body.",fix:"Provide the definition (and check its signature matches the declaration exactly).",snippet:"int missing();\nint main() { return missing(); }\n"},{id:"conflicting-types",pattern:/(conflicting types for|functions that differ only in their return type cannot be overloaded|out-of-line definition of '.*' does not match any declaration)/,title:"Declaration mismatch",why:"Two declarations of the same function disagree on parameters or return type.",fix:"Make the declaration and definition signatures identical.",snippet:"int f(int a);\nlong f(int a) { return a; }\nint main() {}\n"},{id:"unused-or-err-ternary",pattern:/(incompatible operand types|different types for the operands of '\?:')/,title:"Ternary branches differ",why:"Both branches of `a ? b : c` must have compatible types.",fix:"Convert one branch so both are the same type.",snippet:'#include <string>\nint main() { bool b = true; auto x = b ? 1 : std::string("s"); }\n'}],o=/^(?:.*?):(\d+):(\d+): (?:fatal )?error: (.*)$/gm,l=String.raw`#ifndef LCH_HARNESS_H
#define LCH_HARNESS_H
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <queue>
#include <string>
#include <type_traits>
#include <unordered_map>
#include <vector>

struct ListNode {
  int val;
  ListNode* next;
  ListNode() : val(0), next(nullptr) {}
  ListNode(int x) : val(x), next(nullptr) {}
  ListNode(int x, ListNode* next) : val(x), next(next) {}
};

struct TreeNode {
  int val;
  TreeNode* left;
  TreeNode* right;
  TreeNode() : val(0), left(nullptr), right(nullptr) {}
  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
  TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

#ifdef LCH_GRAPH_NODE
class Node {
 public:
  int val;
  std::vector<Node*> neighbors;
  Node() : val(0) {}
  Node(int _val) : val(_val) {}
  Node(int _val, std::vector<Node*> _neighbors) : val(_val), neighbors(_neighbors) {}
};
#endif

#ifdef LCH_RANDOM_NODE
class Node {
 public:
  int val;
  Node* next;
  Node* random;
  Node(int _val) : val(_val), next(nullptr), random(nullptr) {}
};
#endif

namespace lch {

[[noreturn]] inline void fail(const char* what) {
  std::fprintf(stderr, "harness: %s\n", what);
  std::abort();
}

// Cursor over one LC literal such as [1,2,null], [["a"],[]], "abc", true, -3, 1.5.
struct Reader {
  const std::string& s;
  size_t p = 0;
  explicit Reader(const std::string& text) : s(text) {}
  void ws() { while (p < s.size() && (s[p] == ' ' || s[p] == '\t' || s[p] == '\r' || s[p] == '\n')) ++p; }
  char peek() { ws(); return p < s.size() ? s[p] : '\0'; }
  void expect(char c) { if (peek() != c) fail("malformed input literal"); ++p; }
  bool take(char c) { if (peek() != c) return false; ++p; return true; }
  bool takeWord(const char* w) {
    ws();
    size_t n = std::strlen(w);
    if (s.compare(p, n, w) != 0) return false;
    p += n;
    return true;
  }
  bool atEnd() { ws(); return p >= s.size(); }
  long long integer() {
    ws();
    const char* b = s.c_str() + p;
    char* e = nullptr;
    long long v = std::strtoll(b, &e, 10);
    if (e == b) fail("expected an integer");
    p += static_cast<size_t>(e - b);
    return v;
  }
  double real() {
    ws();
    const char* b = s.c_str() + p;
    char* e = nullptr;
    double v = std::strtod(b, &e);
    if (e == b) fail("expected a number");
    p += static_cast<size_t>(e - b);
    return v;
  }
  std::string str() {
    expect('"');
    std::string out;
    while (p < s.size() && s[p] != '"') {
      if (s[p] == '\\' && p + 1 < s.size()) {
        ++p;
        out += s[p] == 'n' ? '\n' : s[p] == 't' ? '\t' : s[p];
      } else {
        out += s[p];
      }
      ++p;
    }
    expect('"');
    return out;
  }
};

template <class T> struct IsVector : std::false_type {};
template <class T, class A> struct IsVector<std::vector<T, A>> : std::true_type {};

template <class T> void read(Reader& r, T& out);

inline void readTree(Reader& r, TreeNode*& out) {
  r.expect('[');
  out = nullptr;
  if (r.take(']')) return;
  auto slot = [&r]() -> TreeNode* {
    if (r.takeWord("null")) return nullptr;
    return new TreeNode(static_cast<int>(r.integer()));
  };
  out = slot();
  if (!out) fail("tree literal must not start with null");
  std::vector<TreeNode*> level{out};  // parents in level order; null slots are not stored
  size_t parent = 0;
  bool wantLeft = true;
  while (r.take(',')) {
    if (parent >= level.size()) fail("tree literal has more nodes than parents");
    TreeNode* made = slot();
    (wantLeft ? level[parent]->left : level[parent]->right) = made;
    if (made) level.push_back(made);
    if (!wantLeft) ++parent;
    wantLeft = !wantLeft;
  }
  r.expect(']');
}

// Nodes of the most recently read list, and whether the input used a position suffix (identity mode).
// Cyclic list: [3,2,0,-4]@1 links the tail back to index 1; @-1 means no cycle.
// Shared tail (second list of a pair): [5,6]^1 links the tail to index 1 of the PREVIOUS list; ^-1 means
// the lists are disjoint. In identity mode a returned ListNode* prints as its index in the base list
// (-1 for null); a node that only the second list owns prints as "b<index>" so it fails as a wrong answer.
inline std::vector<ListNode*>& listNodes() { static std::vector<ListNode*> v; return v; }
inline std::vector<ListNode*>& prevListNodes() { static std::vector<ListNode*> v; return v; }
inline std::vector<ListNode*>& printBase() { static std::vector<ListNode*> v; return v; }
inline std::vector<ListNode*>& printExtra() { static std::vector<ListNode*> v; return v; }
inline bool& listCyclic() { static bool b = false; return b; }

inline void readList(Reader& r, ListNode*& out) {
  r.expect('[');
  out = nullptr;
  ListNode* tail = nullptr;
  auto& nodes = listNodes();
  prevListNodes() = nodes;
  nodes.clear();
  listCyclic() = false;
  if (!r.take(']')) {
    do {
      ListNode* n = new ListNode(static_cast<int>(r.integer()));
      if (tail) tail->next = n; else out = n;
      tail = n;
      nodes.push_back(n);
    } while (r.take(','));
    r.expect(']');
  }
  if (r.take('@')) {
    const long long pos = r.integer();
    if (pos < -1 || pos >= static_cast<long long>(nodes.size())) fail("cycle position out of range");
    if (pos >= 0) tail->next = nodes[static_cast<size_t>(pos)];
    printBase() = nodes;
    printExtra().clear();
    listCyclic() = true;  // '@' present: results print as indexes, even when the list has no cycle
  } else if (r.take('^')) {
    const auto& base = prevListNodes();
    const long long pos = r.integer();
    if (pos < -1 || pos >= static_cast<long long>(base.size())) fail("shared position out of range");
    if (pos >= 0) {
      ListNode* shared = base[static_cast<size_t>(pos)];
      if (tail) tail->next = shared; else out = shared;
    }
    printBase() = base;
    printExtra() = nodes;
    listCyclic() = true;
  }
}

#ifdef LCH_RANDOM_NODE
// Random-pointer list: [[7,null],[13,0],[11,4]] is [val, index of random target or null] per node.
// The originals are remembered (with their expected links) so the printer can reject a copy that
// reuses an original node and a solution that damages the original list.
struct RandomOriginal { std::vector<Node*> nodes; std::vector<long long> randoms; };
inline RandomOriginal& randomOriginal() { static RandomOriginal o; return o; }

inline void readRandomList(Reader& r, Node*& out) {
  r.expect('[');
  out = nullptr;
  auto& orig = randomOriginal();
  orig.nodes.clear();
  orig.randoms.clear();
  if (r.take(']')) return;
  do {
    r.expect('[');
    Node* n = new Node(static_cast<int>(r.integer()));
    r.expect(',');
    orig.randoms.push_back(r.takeWord("null") ? -1 : r.integer());
    r.expect(']');
    if (!orig.nodes.empty()) orig.nodes.back()->next = n;
    orig.nodes.push_back(n);
  } while (r.take(','));
  r.expect(']');
  for (size_t i = 0; i < orig.nodes.size(); ++i) {
    const long long to = orig.randoms[i];
    if (to < -1 || to >= static_cast<long long>(orig.nodes.size())) fail("random index out of range");
    if (to >= 0) orig.nodes[i]->random = orig.nodes[static_cast<size_t>(to)];
  }
  out = orig.nodes[0];
}
#endif

#ifdef LCH_GRAPH_NODE
// Adjacency list, 1-indexed like LeetCode: [[2,4],[1,3],[2,4],[1,3]]. Reads node 1 (null if empty).
inline void readGraph(Reader& r, Node*& out) {
  std::vector<std::vector<int>> adj;
  read(r, adj);
  out = nullptr;
  if (adj.empty()) return;
  std::vector<Node*> nodes(adj.size() + 1, nullptr);
  for (size_t i = 1; i <= adj.size(); ++i) nodes[i] = new Node(static_cast<int>(i));
  for (size_t i = 0; i < adj.size(); ++i)
    for (int to : adj[i]) {
      if (to < 1 || static_cast<size_t>(to) > adj.size()) fail("graph neighbour out of range");
      nodes[i + 1]->neighbors.push_back(nodes[to]);
    }
  out = nodes[1];
}
#endif

template <class T> void read(Reader& r, T& out) {
  if constexpr (std::is_same_v<T, bool>) {
    if (r.takeWord("true")) out = true;
    else if (r.takeWord("false")) out = false;
    else fail("expected true or false");
  } else if constexpr (std::is_same_v<T, char>) {
    std::string s = r.str();
    if (s.size() != 1) fail("expected a one-character string");
    out = s[0];
  } else if constexpr (std::is_integral_v<T>) {
    out = static_cast<T>(r.integer());
  } else if constexpr (std::is_floating_point_v<T>) {
    out = static_cast<T>(r.real());
  } else if constexpr (std::is_same_v<T, std::string>) {
    out = r.str();
  } else if constexpr (std::is_same_v<T, ListNode*>) {
    readList(r, out);
  } else if constexpr (std::is_same_v<T, TreeNode*>) {
    readTree(r, out);
#ifdef LCH_GRAPH_NODE
  } else if constexpr (std::is_same_v<T, Node*>) {
    readGraph(r, out);
#endif
#ifdef LCH_RANDOM_NODE
  } else if constexpr (std::is_same_v<T, Node*>) {
    readRandomList(r, out);
#endif
  } else if constexpr (IsVector<T>::value) {
    out.clear();
    r.expect('[');
    if (r.take(']')) return;
    do {
      typename T::value_type item{};
      read(r, item);
      out.push_back(std::move(item));
    } while (r.take(','));
    r.expect(']');
  } else {
    static_assert(sizeof(T) == 0, "lch::read: unsupported type");
  }
}

template <class T> void print(std::string& out, const T& v);

inline void printString(std::string& out, const std::string& s) {
  out += '"';
  for (char c : s) {
    if (c == '"') out += "\\\"";
    else if (c == '\\') out += "\\\\";
    else if (c == '\n') out += "\\n";
    else if (c == '\t') out += "\\t";
    else out += c;
  }
  out += '"';
}

inline void printReal(std::string& out, double d) {
  if (std::isnan(d) || std::isinf(d)) fail("cannot print a non-finite number");
  char buf[40];
  std::snprintf(buf, sizeof buf, "%.10g", d);
  out += buf;
}

inline void printTree(std::string& out, const TreeNode* root) {
  std::vector<std::string> items;
  std::queue<const TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    const TreeNode* n = q.front();
    q.pop();
    if (!n) { items.push_back("null"); continue; }
    items.push_back(std::to_string(n->val));
    q.push(n->left);
    q.push(n->right);
  }
  while (!items.empty() && items.back() == "null") items.pop_back();
  out += '[';
  for (size_t i = 0; i < items.size(); ++i) { if (i) out += ','; out += items[i]; }
  out += ']';
}

inline void printList(std::string& out, const ListNode* head) {
  if (listCyclic()) {
    // Identity mode: name the returned node by its position in the list(s) that were read.
    if (!head) { out += "-1"; return; }
    const auto& base = printBase();
    for (size_t i = 0; i < base.size(); ++i)
      if (base[i] == head) { out += std::to_string(i); return; }
    const auto& extra = printExtra();
    for (size_t i = 0; i < extra.size(); ++i)
      if (extra[i] == head) { out += "b" + std::to_string(i); return; }
    fail("returned node does not belong to the list");
  }
  out += '[';
  bool first = true;
  size_t guard = 0;
  for (const ListNode* n = head; n; n = n->next) {
    if (++guard > 10000000) fail("linked list is cyclic or too long to print");
    if (!first) out += ',';
    first = false;
    out += std::to_string(n->val);
  }
  out += ']';
}

#ifdef LCH_RANDOM_NODE
// Prints the copy in the input format. A copy that reuses an original node, a random pointer that
// leaves the copy, a cyclic copy, or a damaged original list prints a message, so it is a wrong answer.
inline void printRandomList(std::string& out, const Node* head) {
  const auto& orig = randomOriginal();
  for (size_t i = 0; i < orig.nodes.size(); ++i) {
    const Node* o = orig.nodes[i];
    const Node* wantNext = i + 1 < orig.nodes.size() ? orig.nodes[i + 1] : nullptr;
    const Node* wantRandom = orig.randoms[i] >= 0 ? orig.nodes[static_cast<size_t>(orig.randoms[i])] : nullptr;
    if (o->next != wantNext || o->random != wantRandom) { out += "\"the original list was modified\""; return; }
  }
  std::unordered_map<const Node*, size_t> index;
  std::vector<const Node*> order;
  for (const Node* n = head; n; n = n->next) {
    if (!index.emplace(n, order.size()).second) { out += "\"the copy is cyclic\""; return; }
    order.push_back(n);
  }
  std::unordered_map<const Node*, bool> isOriginal;
  for (const Node* o : orig.nodes) isOriginal[o] = true;
  for (const Node* n : order)
    if (isOriginal.count(n)) { out += "\"the copy reuses an original node\""; return; }
  out += '[';
  for (size_t i = 0; i < order.size(); ++i) {
    if (i) out += ',';
    out += '[' + std::to_string(order[i]->val) + ',';
    const Node* rnd = order[i]->random;
    if (!rnd) out += "null";
    else {
      auto it = index.find(rnd);
      if (it == index.end()) { out.clear(); out += "\"a random pointer leaves the copy\""; return; }
      out += std::to_string(it->second);
    }
    out += ']';
  }
  out += ']';
}
#endif

#ifdef LCH_GRAPH_NODE
// Adjacency list ordered by node value, so any traversal order of a correct clone prints alike.
inline void printGraph(std::string& out, const Node* start) {
  if (!start) { out += "[]"; return; }
  std::unordered_map<int, const Node*> byVal;
  std::queue<const Node*> q;
  q.push(start);
  byVal[start->val] = start;
  int maxVal = start->val;
  while (!q.empty()) {
    const Node* n = q.front();
    q.pop();
    for (const Node* m : n->neighbors)
      if (byVal.emplace(m->val, m).second) { q.push(m); if (m->val > maxVal) maxVal = m->val; }
  }
  out += '[';
  for (int v = 1; v <= maxVal; ++v) {
    if (v > 1) out += ',';
    out += '[';
    auto it = byVal.find(v);
    if (it != byVal.end()) {
      bool first = true;
      for (const Node* m : it->second->neighbors) { if (!first) out += ','; first = false; out += std::to_string(m->val); }
    }
    out += ']';
  }
  out += ']';
}
#endif

template <class T> void print(std::string& out, const T& v) {
  if constexpr (std::is_same_v<T, bool>) {
    out += v ? "true" : "false";
  } else if constexpr (std::is_same_v<T, char>) {
    printString(out, std::string(1, v));
  } else if constexpr (std::is_integral_v<T>) {
    out += std::to_string(v);
  } else if constexpr (std::is_floating_point_v<T>) {
    printReal(out, static_cast<double>(v));
  } else if constexpr (std::is_same_v<T, std::string>) {
    printString(out, v);
  } else if constexpr (std::is_same_v<T, ListNode*>) {
    printList(out, v);
  } else if constexpr (std::is_same_v<T, TreeNode*>) {
    printTree(out, v);
#ifdef LCH_GRAPH_NODE
  } else if constexpr (std::is_same_v<T, Node*>) {
    printGraph(out, v);
#endif
#ifdef LCH_RANDOM_NODE
  } else if constexpr (std::is_same_v<T, Node*>) {
    printRandomList(out, v);
#endif
  } else if constexpr (IsVector<T>::value) {
    out += '[';
    bool first = true;
    for (const auto& item : v) { if (!first) out += ','; first = false; print(out, item); }
    out += ']';
  } else {
    static_assert(sizeof(T) == 0, "lch::print: unsupported type");
  }
}

}  // namespace lch

#endif  // LCH_HARNESS_H
`,d=/^[A-Za-z_]\w*$/;function c(e){return e.replace(/\bconst\b/g,"").replace(/&/g,"").replace(/\s+/g," ").trim()}let p=`#include <bits/stdc++.h>
using namespace std;
`,u=`
template <class T> static void readArg(T& v) {
  std::string line;
  if (!std::getline(std::cin, line)) lch::fail("missing input line");
  lch::Reader r(line);
  lch::read(r, v);
}
`;function m(e,t){return`${e}lch::print(out, ${t});
`}function f(e){return`${e.length}
${e.map(e=>e.join("\n")).join("\n")}
`}function h(e){let t=new g(e),i=t.value();if(t.ws(),!t.done())throw Error(`unexpected '${t.peek()}' at ${t.pos}`);return i}class g{s;pos;constructor(e){this.s=e,this.pos=0}done(){return this.pos>=this.s.length}peek(){return this.s[this.pos]??""}ws(){for(;/\s/.test(this.peek())&&!this.done();)this.pos++}value(){this.ws();let e=this.peek();if("["===e)return this.array();if('"'===e)return this.string();if(this.s.startsWith("null",this.pos))return this.pos+=4,null;if(this.s.startsWith("true",this.pos))return this.pos+=4,!0;if(this.s.startsWith("false",this.pos))return this.pos+=5,!1;let t=/^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(this.s.slice(this.pos));if(!t)throw Error(this.done()?"unexpected end":`unexpected '${e}' at ${this.pos}`);return this.pos+=t[0].length,Number(t[0])}array(){this.pos++;let e=[];if(this.ws(),"]"===this.peek())return this.pos++,e;for(;;){e.push(this.value()),this.ws();let t=this.peek();if(this.pos++,"]"===t)return e;if(","!==t)throw Error(`expected ',' or ']' at ${this.pos-1}`)}}string(){this.pos++;let e="";for(;!this.done()&&'"'!==this.peek();){if("\\"===this.peek()){this.pos++;let t=this.peek();e+="n"===t?"\n":"t"===t?"	":t}else e+=this.peek();this.pos++}if(this.done())throw Error("unterminated string");return this.pos++,e}}function b(e){try{return function e(t){return null===t?"null":"string"==typeof t?`"${t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\t/g,"\\t")}"`:Array.isArray(t)?`[${t.map(e).join(",")}]`:String(t)}(h(e.trim()))}catch{return e.trim().split(/\s+/).join(" ")}}function y(e,t,i={}){if("TLE"===t.status)return{verdict:"TLE",wallMs:t.wallMs,reason:"Time limit exceeded: try a better complexity."};if("RE"===t.status){var n,s;let e;return{verdict:"RE",wallMs:t.wallMs,reason:(n=t.detail,s=t.stderr,(e=`${n}
${s}`.toLowerCase()).includes("stack overflow")||e.includes("call stack")?"Stack overflow: your recursion is too deep or never stops.":e.includes("out of bounds")||e.includes("memory access")?"Out-of-bounds access: an index or iterator went outside its container.":e.includes("unreachable")||e.includes("abort")||e.includes("assert")?"The program aborted (an assertion failed, or something like .at()/pop on an empty container).":e.includes("divide")||e.includes("division")?"Division by zero.":e.includes("memory")&&e.includes("grow")?"Out of memory.":"Runtime error: the program crashed. Check indices, null pointers and empty containers.")}}return!function(e,t,i){let n,s;if(void 0===i)return b(e)===b(t);try{n=h(e.trim()),s=h(t.trim())}catch{return!1}return function e(t,i,n){return"number"==typeof t&&"number"==typeof i?Math.abs(t-i)<=n*Math.max(1,Math.abs(t)):Array.isArray(t)&&Array.isArray(i)?t.length===i.length&&t.every((t,s)=>e(t,i[s],n)):t===i}(n,s,i)}(e.expected,t.stdout,i.floatTol)?{verdict:"WA",wallMs:t.wallMs,got:t.stdout.trim(),expected:e.expected.trim(),reason:"Wrong answer."}:{verdict:"AC",wallMs:t.wallMs}}function v(e){return e.input.split("\n")}async function x(e,t,i,n,s){let r,h,g=function(e,t){var i,n,s,r;let a,o,f,h,g;for(let t of["function"===e.kind?e.name:e.className,...("function"===(r=e).kind?r.params:[...r.ctor,...r.methods.flatMap(e=>e.params)]).map(e=>e.name)])if(!d.test(t))throw Error(`bad identifier '${t}'`);for(let t of"function"===e.kind?[e]:e.methods){if(!d.test(t.name))throw Error(`bad identifier '${t.name}'`);if("void"===t.returns.trim()&&!t.outParam&&"function"===e.kind)throw Error(`void ${t.name} needs outParam`);if(t.outParam&&!t.params.some(e=>e.name===t.outParam))throw Error(`outParam '${t.outParam}' is not a parameter of ${t.name}`)}let b=(e.graphNode?"#define LCH_GRAPH_NODE 1\n":"")+("function"===e.kind&&e.randomNode?"#define LCH_RANDOM_NODE 1\n":""),y="function"===e.kind?(a=`sol.${e.name}(${e.params.map(e=>e.name).join(", ")})`,o="void"===e.returns.trim()?`    ${a};
${m("    ",e.outParam)}`:`    auto result = ${a};
${m("    ","result")}`,`${u}
int main() {
  std::ios::sync_with_stdio(false);
  std::string header;
  if (!std::getline(std::cin, header)) lch::fail("missing test count");
  const int tests = std::atoi(header.c_str());
  for (int t = 0; t < tests; ++t) {
${i=e.params,n="    ",s=e=>`readArg(${e.name});`,i.map(e=>`${n}${c(e.type)} ${e.name}{};
${n}${s(e)}
`).join("")}    ${e.className??"Solution"} sol;
    std::string out;
${o}    std::puts(out.c_str());
  }
  return 0;
}
`):(f=e=>e.map((e,t)=>`${t?"        args.expect(',');\n":""}        ${c(e.type)} ${e.name}{};
        lch::read(args, ${e.name});
`).join(""),h=e.ctor.map(e=>e.name).join(", "),g=e.methods.map(e=>{let t=`obj->${e.name}(${e.params.map(e=>e.name).join(", ")})`,i="void"===e.returns.trim()?`        ${t};
        out += "null";
`:`        auto result = ${t};
${m("        ","result")}`;return`      } else if (ops[i] == "${e.name}") {
        if (!obj) lch::fail("method called before construction");
${f(e.params)}${i}`}),`${u}
int main() {
  std::ios::sync_with_stdio(false);
  std::string header;
  if (!std::getline(std::cin, header)) lch::fail("missing test count");
  const int tests = std::atoi(header.c_str());
  for (int t = 0; t < tests; ++t) {
    std::vector<std::string> ops;
    readArg(ops);
    std::string argsLine;
    if (!std::getline(std::cin, argsLine)) lch::fail("missing arguments line");
    lch::Reader args(argsLine);
    args.expect('[');
    std::unique_ptr<${e.className}> obj;
    std::string out = "[";
    for (size_t i = 0; i < ops.size(); ++i) {
      if (i) { args.expect(','); out += ','; }
      args.expect('[');
      if (ops[i] == "${e.className}") {
${f(e.ctor)}        obj = std::make_unique<${e.className}>(${h});
        out += "null";
${g.join("")}      } else {
        lch::fail("unknown operation");
      }
      args.expect(']');
    }
    out += ']';
    std::puts(out.c_str());
  }
  return 0;
}
`);return`${b}${p}${l}
#line 1 "solution.cpp"
${t}
#line 1 "driver.cpp"
${y}`}(e,t),b=await s.compile(g);if(!b.ok||!b.wasm)return{verdict:"CE",failedAt:null,outcomes:[],maxMs:0,diagnostics:b.diagnostics,firstError:function(e,t=0){return function(e,t=0){let i=[];for(let n of e.matchAll(o)){let e=n[3].trim();i.push({line:Number(n[1])-t,column:Number(n[2]),message:e,entry:a.find(t=>t.pattern.test(e))??null})}return i}(e,t)[0]??null}(b.diagnostics),compileMs:b.timings.compileMs};let x=b.wasm,w=n.batchCapMs??2e4,k=await s.run(x,f(i.map(v)),Math.min(w,n.timeLimitMs*i.length)),N=[];if("ok"===k.status){let e=k.stdout.split("\n"),t=Math.round(k.wallMs/Math.max(1,i.length));if(i.forEach((i,s)=>N.push(y(i,{...k,stdout:e[s]??"",wallMs:t},n))),e.filter(e=>""!==e).length<i.length){let n=N.findIndex((t,n)=>"AC"===t.verdict&&(e[n]??"")===""&&""!==i[n].expected.trim());n>=0&&(N[n]={verdict:"RE",wallMs:t,reason:"The program produced no output for this test."})}}else for(let e of i){let t=await s.run(x,f([v(e)]),n.timeLimitMs),i=y(e,t,n);if(N.push(i),"AC"!==i.verdict)break}return{...(r=N.reduce((e,t)=>Math.max(e,t.wallMs),0),(h=N.findIndex(e=>"AC"!==e.verdict))<0?{verdict:"AC",failedAt:null,maxMs:r}:{verdict:N[h].verdict,failedAt:h,maxMs:r}),outcomes:N,compileMs:b.timings.compileMs}}e.s(["f",0,x],64517)},96770,e=>{let t="main";function i(e){return new Promise((t,i)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>i(e.error)})}function n(e){return new Promise((t,i)=>{e.oncomplete=()=>t(),e.onerror=()=>i(e.error),e.onabort=()=>i(e.error??Error("IndexedDB transaction aborted"))})}e.s(["f",0,class{dbPromise=null;db(){return this.dbPromise??=new Promise((e,t)=>{let i=indexedDB.open("algo-clash",2);i.onupgradeneeded=()=>{let e=i.result;e.objectStoreNames.contains("core")||e.createObjectStore("core"),e.objectStoreNames.contains("attempts")||e.createObjectStore("attempts",{autoIncrement:!0}).createIndex("problemId","problemId"),e.objectStoreNames.contains("drafts")||e.createObjectStore("drafts",{keyPath:"problemId"}),e.objectStoreNames.contains("journal")||e.createObjectStore("journal",{autoIncrement:!0}).createIndex("problemId","problemId")},i.onsuccess=()=>e(i.result),i.onerror=()=>t(i.error)}),this.dbPromise}async store(e,t){let i=(await this.db()).transaction(e,t);return{store:i.objectStore(e),tx:i}}async getCore(){let{store:e}=await this.store("core","readonly");return i(e.get(t))}async putCore(e){let{store:i,tx:s}=await this.store("core","readwrite");i.put(e,t),await n(s)}async addAttempt(e){let{store:t,tx:i}=await this.store("attempts","readwrite");t.add(e),await n(i)}async listAttempts(){let{store:e}=await this.store("attempts","readonly");return i(e.getAll())}async getDraft(e){let{store:t}=await this.store("drafts","readonly");return i(t.get(e))}async putDraft(e){let{store:t,tx:i}=await this.store("drafts","readwrite");t.put(e),await n(i)}async deleteDraft(e){let{store:t,tx:i}=await this.store("drafts","readwrite");t.delete(e),await n(i)}async listDrafts(){let{store:e}=await this.store("drafts","readonly");return i(e.getAll())}async addJournal(e){let{store:t,tx:i}=await this.store("journal","readwrite");t.add(e),await n(i)}async listJournal(){let{store:e}=await this.store("journal","readonly");return i(e.getAll())}async clear(){let e=await this.db(),t=["core","attempts","drafts","journal"],i=e.transaction(t,"readwrite");for(let e of t)i.objectStore(e).clear();await n(i)}}])},16265,e=>{let t={textSpeed:"normal",audio:!0,reduceMotion:!1,editor:{theme:"night",fontSize:16,autocomplete:!0}};function i(e,n="Trainer"){return{version:1,profile:{name:n,createdAt:e,level:1,xp:0,bits:0,streakDays:0,lastPlayedDay:""},party:[],mastery:{},settings:{...t,editor:{...t.editor}},forge:{},loadouts:{},inventory:{},flags:{}}}let n=(e,t,i=-1/0,n=1/0)=>"number"==typeof e&&Number.isFinite(e)?Math.min(n,Math.max(i,e)):t,s=(e,t,i=200)=>"string"==typeof e?e.slice(0,i):t,r=e=>e&&"object"==typeof e&&!Array.isArray(e)?e:{},a=["unseen","seen","learning","practiced","mastered","ingrained","solved","rusty"],o=["AC","WA","TLE","RE","CE"],l=["learn","practice","interview"],d=["trace","cloze30","cloze70","blank"];e.s(["C",0,1,"g",0,i,"L",0,function(e){let t=r(e);if("string"!=typeof t.problemId||!t.problemId||!o.includes(t.verdict))return null;let i={problemId:t.problemId.slice(0,80),at:n(t.at,0,0),verdict:t.verdict,seconds:n(t.seconds,0,0),hintsUsed:Math.round(n(t.hintsUsed,0,0,3)),mode:l.includes(t.mode)?t.mode:"practice"};return"string"==typeof t.cause&&(i.cause=t.cause.slice(0,60)),"boolean"==typeof t.assisted&&(i.assisted=t.assisted),i},"p",0,function(e,t){let o=r(e),l=i(t),c=r(o.profile),p=r(o.settings),u=r(p.editor),m={};for(let[e,t]of Object.entries(r(o.mastery)))m[e]=function(e){let t=r(e),i={state:a.includes(t.state)?t.state:"unseen",solves:Math.round(n(t.solves,0,0)),due:n(t.due,0,0),intervalDays:n(t.intervalDays,0,0),ease:n(t.ease,2.5,1.3,3.5),lastSolvedAt:n(t.lastSolvedAt,0,0)};return"number"==typeof t.spacedSolves&&(i.spacedSolves=Math.round(n(t.spacedSolves,0,0,1e3))),"number"==typeof t.firstSolvedAt&&(i.firstSolvedAt=n(t.firstSolvedAt,0,0)),i}(t);let f={};for(let[e,t]of Object.entries(r(o.flags)))("boolean"==typeof t||"string"==typeof t||"number"==typeof t&&Number.isFinite(t))&&(f[e]=t);return{version:1,profile:{name:s(c.name,l.profile.name,24)||l.profile.name,createdAt:n(c.createdAt,t,0),level:Math.round(n(c.level,1,1,60)),xp:Math.round(n(c.xp,0,0)),bits:Math.round(n(c.bits,0,0)),streakDays:Math.round(n(c.streakDays,0,0)),lastPlayedDay:s(c.lastPlayedDay,"",10)},party:Array.isArray(o.party)?o.party.filter(e=>"string"==typeof e).slice(0,6):[],mastery:m,settings:{textSpeed:"slow"===p.textSpeed||"fast"===p.textSpeed?p.textSpeed:"normal",audio:"boolean"!=typeof p.audio||p.audio,reduceMotion:"boolean"==typeof p.reduceMotion&&p.reduceMotion,editor:{theme:"paper"===u.theme?"paper":"night",fontSize:Math.round(n(u.fontSize,16,12,24)),autocomplete:"boolean"!=typeof u.autocomplete||u.autocomplete}},forge:function(e){let t={};for(let[i,s]of Object.entries(r(e)).slice(0,200)){let e=r(s),a=(Array.isArray(e.passed)?e.passed:[]).filter(e=>d.includes(e)),o=(Array.isArray(e.blankRuns)?e.blankRuns:[]).slice(-20).map(e=>({seconds:n(r(e).seconds,0,0),at:n(r(e).at,0,0)}));t[i.slice(0,64)]={passed:[...new Set(a)],blankRuns:o}}return t}(o.forge),loadouts:function(e){let t={};for(let[i,n]of Object.entries(r(e)).slice(0,50)){let e=(Array.isArray(n)?n:[]).filter(e=>"string"==typeof e).map(e=>e.slice(0,64));t[i.slice(0,64)]=[...new Set(e)].slice(0,4)}return t}(o.loadouts),inventory:function(e){let t={};for(let[i,s]of Object.entries(r(e)).slice(0,50)){let e=Math.round(n(s,0,0,999));e>0&&(t[i.slice(0,64)]=e)}return t}(o.inventory),flags:f}},"d",0,function(e){let t=r(e);return"string"==typeof t.problemId&&t.problemId&&"string"==typeof t.code?{problemId:t.problemId.slice(0,80),code:t.code.slice(0,2e5),updatedAt:n(t.updatedAt,0,0)}:null}])},18853,e=>{var t=e.i(43393),i=e.i(16265);let n={0:e=>{let t=e.player&&"object"==typeof e.player?e.player:{},i={};if(Array.isArray(e.solved))for(let t of e.solved)"string"==typeof t&&(i[t]={state:"solved",solves:1});return{version:1,profile:{name:t.name,level:t.level,xp:t.xp,bits:e.coins},party:e.party,mastery:i,settings:e.settings,flags:e.flags}}};class s extends Error{}function r(e,t){if(!e||"object"!=typeof e)throw Error("Save data is not an object");let r=e,a="number"==typeof r.version&&Number.isInteger(r.version)?r.version:0;if(a>i.C)throw new s(`Save is from a newer game version (${a} > ${i.C})`);for(a<0&&(a=0);a<i.C;a++){let e=n[a];if(!e)throw new s(`No migration from save version ${a}`);r=e(r)}return(0,i.p)(r,t)}let a="algo-clash-save";e.s(["f",0,class{backend;now;constructor(e,t=Date.now){this.backend=e,this.now=t}async load(){let e=await this.backend.getCore();if(void 0===e)return(0,i.g)(this.now());try{let t=r(e,this.now());return e.version!==i.C&&await this.backend.putCore(t),t}catch(e){if(e instanceof s)throw e;return(0,i.g)(this.now())}}save(e){return this.backend.putCore(e)}async recordAttempt(e){let t=(0,i.L)(e);if(!t)throw Error("Invalid attempt");await this.backend.addAttempt(t)}async attempts(e){let t=(await this.backend.listAttempts()).map(i.L).filter(e=>null!==e);return e?t.filter(t=>t.problemId===e):t}saveDraft(e,t){return this.backend.putDraft({problemId:e,code:t,updatedAt:this.now()})}async loadDraft(e){return(0,i.d)(await this.backend.getDraft(e))}async recordJournal(e){let i=(0,t.h)(e);if(!i)throw Error("Invalid journal entry");await this.backend.addJournal(i)}async journal(e){let i=(await this.backend.listJournal()).map(t.h).filter(e=>null!==e);return e?i.filter(t=>t.problemId===e):i}clearDraft(e){return this.backend.deleteDraft(e)}async exportJson(){return JSON.stringify({format:a,version:i.C,exportedAt:this.now(),core:await this.load(),attempts:await this.attempts(),drafts:(await this.backend.listDrafts()).map(i.d).filter(e=>null!==e),journal:await this.journal()},null,2)}async importJson(e){let n;try{n=JSON.parse(e)}catch{throw Error("That file is not valid JSON")}let s=n&&"object"==typeof n?n:{};if(s.format!==a)throw Error("That file is not an Algo Clash save");let o=r({...s.core,version:s.version},this.now()),l=(Array.isArray(s.attempts)?s.attempts:[]).map(i.L).filter(e=>null!==e),d=(Array.isArray(s.drafts)?s.drafts:[]).map(i.d).filter(e=>null!==e),c=(Array.isArray(s.journal)?s.journal:[]).map(t.h).filter(e=>null!==e);for(let e of(await this.backend.clear(),await this.backend.putCore(o),c))await this.backend.addJournal(e);for(let e of l)await this.backend.addAttempt(e);for(let e of d)await this.backend.putDraft(e);return o}reset(){return this.backend.clear()}}],18853)}])})();