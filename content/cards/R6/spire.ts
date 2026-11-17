import type { Card } from "@/lib/cards/types";

/** R6 Stackspire cards. Predict, trace, parsons, cloze and compiler-error results are computed by g++ (content/cards/generated.json). */
export const r6Cards: Card[] = [
  // ---- Stack basics
  {
    id: "r6-stk-signal", kind: "mcq", region: "R6", tags: ["stack", "recognition"],
    prompt: "Which problem statement is the clearest signal for a stack?",
    choices: ["Check that every opening bracket is closed by the matching bracket in the right order", "Find the shortest path between two cities", "Count how many times each word appears", "Find two values that add up to a target"],
    answer: 0,
    explanation: "Nesting means the newest unfinished item must be finished first, which is last-in first-out. Shortest path is BFS, counting is a hash map, and the target sum is a map or two pointers.",
  },
  {
    id: "r6-stk-pop-void", kind: "mcq", region: "R6", tags: ["stack", "std-stack"],
    prompt: "What does std::stack<int>::pop() return?",
    choices: ["Nothing (void): read top() first, then pop()", "The removed element", "A reference to the new top", "true if an element was removed"],
    answer: 0,
    explanation: "pop only removes. To use the value, call top() before pop(). On an empty stack both are undefined behaviour, so check empty() first.",
  },
  {
    id: "r6-stk-predict", kind: "predict", region: "R6", tags: ["stack", "std-stack"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <stack>

int main() {
    std::stack<int> st;
    for (int x : {5, 1, 8}) st.push(x);
    st.pop();
    st.push(3);
    std::cout << st.top() << ' ' << st.size() << '\\n';
}
`,
    explanation: "After pushing 5, 1, 8 the top is 8. `pop` removes 8, `push(3)` puts 3 on top of 1. The top is 3 and the stack holds 5, 1, 3.",
  },
  {
    id: "r6-stk-depth-trace", kind: "trace", region: "R6", tags: ["stack", "brackets", "trace"],
    prompt: "What does this program print (the deepest nesting seen)?",
    code: `#include <algorithm>
#include <iostream>
#include <string>

int main() {
    std::string s = "(()(()))()";
    int depth = 0, deepest = 0;
    for (char c : s) {
        if (c == '(') deepest = std::max(deepest, ++depth);
        else --depth;
    }
    std::cout << deepest << '\\n';
}
`,
    explanation: "Reading left to right the depth goes 1, 2, 1, 2, 3, 2, 1, 0, 1, 0, so the deepest point is 3 (inside `(()(()))`). A counter is enough when there is only one bracket kind; with several kinds you need the stack to know which closer is owed.",
  },
  {
    id: "r6-stk-match-checks", kind: "multi", region: "R6", tags: ["stack", "brackets"],
    prompt: "Which situations make a bracket string invalid? Select all that apply.",
    choices: ["A closer arrives while the stack is empty", "A closer arrives and the top is a different kind of bracket", "The stack still holds openers after the last character", "The string contains more than one kind of bracket"],
    answers: [0, 1, 2],
    explanation: "Those are the three failures: nothing open to close, the wrong kind on top, and unfinished openers at the end. Mixing kinds is fine as long as they nest properly.",
  },
  {
    id: "r6-stk-pop-error", kind: "compilerError", region: "R6", tags: ["stack", "compiler-errors"],
    prompt: "This code does not compile. What is the cause?",
    code: `#include <stack>

int main() {
    std::stack<int> st;
    st.push(7);
    int x = st.pop();
    return x;
}
`,
    choices: ["pop() returns void, so there is no value to assign", "A stack of int must be created with a size", "push cannot take a literal", "The variable x must be declared before the stack"],
    answer: 0,
    explanation: "`std::stack::pop` has return type `void`. Write `int x = st.top(); st.pop();`.",
  },
  {
    id: "r6-stk-uses", kind: "multi", region: "R6", tags: ["stack", "recognition"],
    prompt: "Which tasks fit a stack naturally? Select all that apply.",
    choices: ["Undo the last edit", "Evaluate a nested expression such as 2*(3+4)", "Serve customers in the order they arrived", "Backtrack to the previous choice in a search"],
    answers: [0, 1, 3],
    explanation: "Undo, nested evaluation and backtracking all return to the newest unfinished thing. Serving in arrival order is first-in first-out: a queue.",
  },
  {
    id: "r6-stk-reverse-parsons", kind: "parsons", region: "R6", tags: ["stack", "parsons"],
    prompt: "Order the lines so the program prints the word reversed using a stack.",
    lines: [
      "#include <iostream>",
      "#include <stack>",
      "#include <string>",
      "int main() {",
      "    std::stack<char> st;",
      "    for (char c : std::string(\"stack\")) st.push(c);",
      "    while (!st.empty()) {",
      "        std::cout << st.top();",
      "        st.pop();",
      "    }",
      "    std::cout << \"\\n\";",
      "}",
    ],
    explanation: "Push every letter, then read `top()` and `pop()` until empty. Last in comes out first, which reverses the word.",
  },
  {
    id: "r6-stk-match-cloze", kind: "cloze", region: "R6", tags: ["stack", "brackets", "cloze"],
    prompt: "Fill the blanks so the program prints 1 for a balanced string.",
    template: `#include <iostream>
#include <stack>
#include <string>

int main() {
    std::string s = "([]{})";
    std::stack<char> want;
    for (char c : s) {
        if (c == '(') want.push(')');
        else if (c == '[') want.push(']');
        else if (c == '{') want.push('}');
        else {
            if (want.___() || want.top() != c) { std::cout << 0 << "\\n"; return 0; }
            want.___();
        }
    }
    std::cout << want.empty() << "\\n";
}
`,
    blanks: [["empty"], ["pop"]],
    explanation: "Test `empty()` before `top()`: the `||` short-circuits so `top()` is never called on an empty stack. A match is consumed with `pop()`.",
  },
  {
    id: "r6-stk-two-stack", kind: "mcq", region: "R6", tags: ["queue", "two-stacks", "amortized"],
    prompt: "A queue is built from two stacks (in and out). Why is pop O(1) amortized?",
    choices: ["Each item is moved from in to out at most once, so n operations move at most n items in total", "Pouring takes O(1) because stacks are linked lists", "The out stack is never empty", "Pop never needs to pour"],
    answer: 0,
    explanation: "A single pop can pour many items (O(n)), but every item is poured once in its life. Total pouring is at most the number of pushes, so the average per operation is constant.",
  },
  {
    id: "r6-stk-ring-trace", kind: "trace", region: "R6", tags: ["queue", "circular-buffer", "trace"],
    prompt: "What does this program print (the slot index where the last item is stored)?",
    code: `#include <iostream>

int main() {
    const int cap = 5;
    int head = 0, size = 0, last = -1;
    for (int step = 0; step < 9; ++step) {
        if (step % 3 == 2) {
            head = (head + 1) % cap;
            --size;
        } else {
            last = (head + size) % cap;
            ++size;
        }
    }
    std::cout << last << '\\n';
}
`,
    explanation: "Pops happen at steps 2, 5 and 8; the other six steps push. The last push is step 7, with head = 2 and size = 3 at that moment: slot (2 + 3) % 5 = 0. The modulo wraps the ring past the end of the array.",
  },
  {
    id: "r6-stk-ring-full", kind: "mcq", region: "R6", tags: ["queue", "circular-buffer"],
    prompt: "A ring buffer tracks only head and tail indexes. Why can it not tell empty from full, and what is the usual fix?",
    choices: ["Both states have head == tail; keep a separate size (or leave one slot unused)", "The ring is always full after the first wrap; reset head to 0", "Tail must always be smaller than head; swap them", "Use floating-point indexes"],
    answer: 0,
    explanation: "When the tail catches up with the head the ring may hold 0 or `cap` items. Storing `size` is the simplest cure; the other classic fix reserves one empty slot so `full` means `tail + 1 == head` (mod cap).",
  },

  // ---- Monotonic stack
  {
    id: "r6-mono-signal", kind: "mcq", region: "R6", tags: ["monotonic-stack", "recognition"],
    prompt: "For every element you must find the nearest element to its right that is larger. Which technique gives O(n)?",
    choices: ["A stack of indices kept in decreasing value order", "Sort the array and binary search", "A hash map from value to index", "Two pointers moving inward from both ends"],
    answer: 0,
    explanation: "Each new value resolves every waiting smaller value on top of the stack, then waits itself. Sorting loses the positions, a hash map has no notion of 'nearest', and two pointers need a sorted or symmetric structure.",
  },
  {
    id: "r6-mono-invariant", kind: "mcq", region: "R6", tags: ["monotonic-stack", "invariant"],
    prompt: "In the 'next warmer day' loop, you pop while temp[top] < temp[i] and then push i. What do the temperatures on the stack look like from bottom to top?",
    choices: ["Never increasing (equal values may sit next to each other)", "Strictly increasing", "Strictly decreasing, with no repeats", "In no particular order"],
    answer: 0,
    explanation: "A value is popped only when something strictly larger arrives, so equal values stay and larger ones never sit on top of smaller ones: the stack is non-increasing.",
  },
  {
    id: "r6-mono-predict", kind: "predict", region: "R6", tags: ["monotonic-stack", "predict"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <stack>
#include <vector>

int main() {
    std::vector<int> a = {4, 2, 7, 3, 5, 1};
    std::vector<int> next(a.size(), -1);
    std::stack<int> st;
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        while (!st.empty() && a[st.top()] < a[i]) {
            next[st.top()] = a[i];
            st.pop();
        }
        st.push(i);
    }
    for (int v : next) std::cout << v << ' ';
    std::cout << '\\n';
}
`,
    explanation: "Value 7 arrives and pops 2 and 4, so both get 7. Value 5 pops 3. The values 7, 5 and 1 are still waiting at the end, so they keep -1.",
  },
  {
    id: "r6-mono-pops-trace", kind: "trace", region: "R6", tags: ["monotonic-stack", "trace", "amortized"],
    prompt: "What does this program print (total pops, then the biggest stack size)?",
    code: `#include <algorithm>
#include <iostream>
#include <stack>
#include <vector>

int main() {
    std::vector<int> a = {3, 1, 4, 1, 5, 9, 2, 6};
    std::stack<int> st;
    int pops = 0, peak = 0;
    for (int x : a) {
        while (!st.empty() && st.top() < x) {
            st.pop();
            ++pops;
        }
        st.push(x);
        peak = std::max(peak, static_cast<int>(st.size()));
    }
    std::cout << pops << ' ' << peak << '\\n';
}
`,
    explanation: "4 pops 1 and 3; 5 pops 1 and 4; 9 pops 5; 6 pops 2. That is 2 + 2 + 1 + 1 = 6 pops, never more than the 8 pushes. The stack never holds more than 2 values here, because each big value clears what is below it.",
  },
  {
    id: "r6-mono-uses", kind: "multi", region: "R6", tags: ["monotonic-stack", "recognition"],
    prompt: "Which problems are solved with a monotonic stack? Select all that apply.",
    choices: ["Days until a warmer temperature", "Largest rectangle in a histogram", "Count the words in a sentence", "Trapping rain water, layer by layer"],
    answers: [0, 1, 3],
    explanation: "All three need the nearest taller or shorter neighbour of each element. Counting words is a single linear scan with a counter.",
  },
  {
    id: "r6-mono-vector-error", kind: "compilerError", region: "R6", tags: ["monotonic-stack", "compiler-errors"],
    prompt: "This code does not compile. What is the cause?",
    code: `#include <vector>

int main() {
    std::vector<int> st;
    st.push_back(3);
    st.push_back(8);
    st.pop();
    return static_cast<int>(st.size());
}
`,
    choices: ["std::vector has no member named pop; the call is pop_back()", "push_back needs two arguments", "A vector cannot be empty at the start", "size() returns a string"],
    answer: 0,
    explanation: "`std::stack` has `pop`, but `std::vector` uses `pop_back`. Many solutions use a vector as the stack so they can peek below the top: `st.back()`, `st.pop_back()`.",
  },
  {
    id: "r6-mono-parsons", kind: "parsons", region: "R6", tags: ["monotonic-stack", "parsons"],
    prompt: "Order the lines so the program prints how many days each day waits for a warmer one.",
    lines: [
      "#include <iostream>",
      "#include <stack>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> a = {2, 1, 5};",
      "    std::vector<int> wait(a.size(), 0);",
      "    std::stack<int> st;",
      "    for (int i = 0; i < 3; ++i) {",
      "        while (!st.empty() && a[st.top()] < a[i]) {",
      "            wait[st.top()] = i - st.top();",
      "            st.pop();",
      "        }",
      "        st.push(i);",
      "    }",
      "    for (int w : wait) std::cout << w << ' ';",
      "    std::cout << \"\\n\";",
      "}",
    ],
    explanation: "The `while` resolves waiting days before the new index joins the stack. The record `wait[st.top()] = ...` must come before `pop()`, otherwise `top()` already points at a different index.",
  },
  {
    id: "r6-mono-cloze", kind: "cloze", region: "R6", tags: ["monotonic-stack", "cloze"],
    prompt: "Fill the blanks so the program prints the distance each element waits for a larger one.",
    template: `#include <iostream>
#include <stack>
#include <vector>

int main() {
    std::vector<int> a = {1, 3, 2, 4};
    std::vector<int> wait(a.size(), 0);
    std::stack<int> st;
    for (int i = 0; i < static_cast<int>(a.size()); ++i) {
        while (!st.empty() && a[st.___()] < a[i]) {
            wait[st.top()] = i - st.top();
            st.___();
        }
        st.push(i);
    }
    for (int w : wait) std::cout << w << ' ';
    std::cout << "\\n";
}
`,
    blanks: [["top"], ["pop"]],
    explanation: "Peek with `top()` to compare, and `pop()` once the waiting index is answered. Here 1 waits 1 day for 3, 3 waits 2 days for 4, and 2 waits 1 day for 4.",
  },
  {
    id: "r6-mono-amortized", kind: "mcq", region: "R6", tags: ["monotonic-stack", "complexity", "amortized"],
    prompt: "The monotonic-stack loop has a while inside a for. Why is the total time O(n) and not O(n^2)?",
    choices: ["Each index is pushed once and popped at most once, so all pops together are at most n", "The while loop runs at most twice per iteration", "The stack never holds more than log n items", "Pop is free, so only pushes count"],
    answer: 0,
    explanation: "One iteration can pop many items, but an item can only be popped after it was pushed, and only once. The total number of pops across the run is bounded by n, so total work is O(n).",
  },
  {
    id: "r6-mono-ties", kind: "mcq", region: "R6", tags: ["monotonic-stack", "ties", "edge-cases"],
    prompt: "When counting, for each element, the stretch in which it is the minimum of a subarray, the array has equal values. What keeps every subarray counted exactly once?",
    choices: ["Stop on strictly smaller on one side and on smaller-or-equal on the other", "Stop on strictly smaller on both sides", "Stop on smaller-or-equal on both sides", "Skip every duplicated value"],
    answer: 0,
    explanation: "A subarray like [2, 2] has two positions that could claim the minimum. Making exactly one side strict gives that subarray to exactly one of them. Strict on both sides counts it twice; non-strict on both counts it for neither.",
  },
  {
    id: "r6-mono-hist-trace", kind: "trace", region: "R6", tags: ["monotonic-stack", "histogram", "trace"],
    prompt: "What does this program print (the largest rectangle)?",
    code: `#include <algorithm>
#include <iostream>
#include <stack>
#include <vector>

int main() {
    std::vector<int> h = {4, 2, 6, 3, 5, 5, 0};
    std::stack<int> st;
    int best = 0;
    for (int i = 0; i < static_cast<int>(h.size()); ++i) {
        while (!st.empty() && h[st.top()] > h[i]) {
            const int height = h[st.top()];
            st.pop();
            const int left = st.empty() ? -1 : st.top();
            best = std::max(best, height * (i - left - 1));
        }
        st.push(i);
    }
    std::cout << best << '\\n';
}
`,
    explanation: "The bar of height 2 reaches both ends of the six real bars, so it spans width 6 and gives 12. The pair of 5s gives 10, and 3, 5, 5 gives 9, so 12 wins.",
  },
  {
    id: "r6-mono-sentinel", kind: "mcq", region: "R6", tags: ["monotonic-stack", "histogram", "edge-cases"],
    prompt: "A histogram solution appends a bar of height 0 to the input. What is it for?",
    choices: ["It pops and measures every bar still on the stack at the end", "It makes the array length even", "It avoids integer overflow", "It sorts the bars"],
    answer: 0,
    explanation: "Bars that are never followed by a shorter bar would stay on the stack and never be measured. A 0 is shorter than every real bar, so it forces all of them to be popped and measured. Forgetting it is the classic bug.",
  },
  // ---- Expressions
  {
    id: "r6-expr-signal", kind: "mcq", region: "R6", tags: ["stack", "expressions", "recognition"],
    prompt: "A tape lists numbers and operators like `4 5 + 2 *`, where each operator uses the two most recent unused values. Which structure evaluates it in one pass?",
    choices: ["A stack of values", "A queue of values", "A hash map from operator to result", "A sorted array"],
    answer: 0,
    explanation: "An operator always needs the two newest unused values, which is exactly what the top of a stack holds. A queue would hand back the oldest values instead.",
  },
  {
    id: "r6-expr-operand-order", kind: "mcq", region: "R6", tags: ["stack", "expressions", "edge-cases"],
    prompt: "While evaluating the postfix tape `10 4 -`, the evaluator pops `x` first and `y` second. Which expression gives the correct 6?",
    choices: ["y - x", "x - y", "x + y", "x * y - 34"],
    answer: 0,
    explanation: "The first value popped is the newest one, which is the right operand (4). So the older value minus the newer one is `y - x`. Swapping them is harmless for + and *, but wrong for - and /.",
  },
  {
    id: "r6-expr-predict", kind: "predict", region: "R6", tags: ["stack", "expressions", "rpn"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <stack>
#include <string>
#include <vector>

int main() {
    const std::vector<std::string> tape = {"3", "4", "+", "2", "*", "5", "-"};
    std::stack<int> vals;
    for (const auto& tok : tape) {
        if (tok == "+" || tok == "-" || tok == "*") {
            const int right = vals.top();
            vals.pop();
            const int left = vals.top();
            vals.pop();
            vals.push(tok == "+" ? left + right : tok == "-" ? left - right : left * right);
        } else {
            vals.push(std::stoi(tok));
        }
    }
    std::cout << vals.top() << '\\n';
}
`,
    explanation: "`3 4 +` is 7, `7 2 *` is 14, and `14 5 -` is 9. The final subtraction is the older value 14 minus the newer value 5.",
  },
  {
    id: "r6-expr-div-trace", kind: "trace", region: "R6", tags: ["stack", "expressions", "trace", "integer-division"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <stack>
#include <vector>

int main() {
    std::stack<int> vals;
    for (int x : {-7, 2}) vals.push(x);
    const int right = vals.top();
    vals.pop();
    const int left = vals.top();
    vals.pop();
    vals.push(left / right);
    vals.push(5);
    const int b = vals.top();
    vals.pop();
    const int a = vals.top();
    vals.pop();
    std::cout << a * b << ' ' << -7 % 2 << '\\n';
}
`,
    explanation: "C++ integer division truncates toward zero, so `-7 / 2` is `-3` (not `-4`), and `-3 * 5` is `-15`. The remainder takes the sign of the dividend, so `-7 % 2` is `-1`.",
  },
  {
    id: "r6-expr-prec", kind: "mcq", region: "R6", tags: ["stack", "expressions", "precedence"],
    prompt: "In a two-stack infix evaluator, a `-` arrives and the operator stack has `*` on top. What happens first?",
    choices: ["Apply the `*` to the top two values, then continue; the new `-` is pushed afterwards", "Push `-` on top of `*` immediately", "Discard the `*`", "Apply the `-` first"],
    answer: 0,
    explanation: "`*` binds tighter than `-`, so everything it needs is already known and it must be finished first. Leaving it waiting under `-` would let a later operator be applied to the wrong operands. With equal precedence the same rule keeps left-to-right grouping: `8 - 3 - 2` is `(8 - 3) - 2`.",
  },
  {
    id: "r6-expr-uses", kind: "multi", region: "R6", tags: ["stack", "expressions", "recognition"],
    prompt: "Which tasks are naturally solved with a stack? Select all that apply.",
    choices: ["Decode `3[a2[c]]` into a full string", "Simplify the path `/a/./b/../c`", "Evaluate `(1+2)*3` with brackets", "Sort a list of numbers with the STL"],
    answers: [0, 1, 2],
    explanation: "Nested brackets, `..` undoing the last name, and bracketed arithmetic all finish the newest unfinished piece first. Sorting needs no stack.",
  },
  {
    id: "r6-expr-switch-error", kind: "compilerError", region: "R6", tags: ["expressions", "compiler-errors", "switch"],
    prompt: "This code does not compile. What is the cause?",
    code: `#include <iostream>
#include <string>

int main() {
    const std::string tok = "+";
    switch (tok) {
        case "+": std::cout << "plus\\n"; break;
        default: std::cout << "other\\n";
    }
}
`,
    choices: ["switch needs an integral value (such as char or int), and a std::string is not one", "std::string cannot hold a plus sign", "case labels must be uppercase", "default must come first"],
    answer: 0,
    explanation: "`switch` works on integers and enums only. Use `switch (tok[0])` with character labels for single-character tokens, or an `if / else if` chain on the whole string as the tape evaluator does.",
  },
  {
    id: "r6-expr-path-parsons", kind: "parsons", region: "R6", tags: ["stack", "paths", "parsons"],
    prompt: "Order the lines so the program prints the names left after applying `.` and `..`.",
    lines: [
      "#include <iostream>",
      "#include <string>",
      "#include <vector>",
      "int main() {",
      "    const std::vector<std::string> parts = {\"a\", \".\", \"b\", \"..\", \"c\"};",
      "    std::vector<std::string> st;",
      "    for (const auto& p : parts) {",
      "        if (p == \".\") continue;",
      "        if (p == \"..\") {",
      "            if (!st.empty()) st.pop_back();",
      "        } else {",
      "            st.push_back(p);",
      "        }",
      "    }",
      "    for (const auto& s : st) std::cout << s << ' ';",
      "    std::cout << \"\\n\";",
      "}",
    ],
    explanation: "A `.` does nothing, `..` removes the last kept name only if there is one (going up from the top stays at the top), and every other name is pushed. Here `a`, `b` are kept, `..` removes `b`, and `c` is added, leaving `a c`.",
  },
  {
    id: "r6-expr-cloze", kind: "cloze", region: "R6", tags: ["stack", "expressions", "cloze"],
    prompt: "Fill the blanks so the program applies a subtraction to the two newest values.",
    template: `#include <iostream>
#include <stack>

int main() {
    std::stack<int> vals;
    vals.push(10);
    vals.push(2);
    const int b = vals.top();
    vals.pop();
    const int a = vals.___();
    vals.___();
    vals.push(a - b);
    std::cout << vals.top() << "\\n";
}
`,
    blanks: [["top"], ["pop"]],
    explanation: "Read the older value with `top()`, then remove it with `pop()`. Subtracting the newer value `b` from the older `a` gives 10 - 2 = 8.",
  },
  {
    id: "r6-expr-unary", kind: "mcq", region: "R6", tags: ["expressions", "unary-minus", "edge-cases"],
    prompt: "A calculator rewrites every `-` that has no left operand into `0 -`. Which input breaks it?",
    choices: ["2 * -3", "-3 + 4", "(-3)", "5 - 1"],
    answer: 0,
    explanation: "Inserting a 0 gives `2 * 0 - 3`, which multiplies first and yields -3, but the correct answer is -6. The trick survives a leading minus or a minus after `(`, but not after `*` or `/`. A real unary operator with its own precedence handles all cases.",
  },
  {
    id: "r6-expr-decode-trace", kind: "trace", region: "R6", tags: ["stack", "expressions", "trace", "decode"],
    prompt: "What does this program print?",
    code: `#include <cctype>
#include <iostream>
#include <stack>
#include <string>

int main() {
    const std::string code = "2[a2[b]]";
    std::string cur;
    int num = 0;
    std::stack<int> counts;
    std::stack<std::string> parked;
    for (const char c : code) {
        if (std::isdigit(static_cast<unsigned char>(c))) {
            num = num * 10 + (c - '0');
        } else if (c == '[') {
            counts.push(num);
            parked.push(cur);
            num = 0;
            cur.clear();
        } else if (c == ']') {
            std::string outer = parked.top();
            parked.pop();
            for (int r = counts.top(); r > 0; --r) outer += cur;
            counts.pop();
            cur = outer;
        } else {
            cur += c;
        }
    }
    std::cout << cur << '\\n';
}
`,
    explanation: "The inner `2[b]` becomes `bb`, so the outer text is `abb`, and the outer `2[...]` repeats it twice: `abbabb`.",
  },
  {
    id: "r6-expr-depth", kind: "mcq", region: "R6", tags: ["expressions", "recursion", "stack-overflow", "complexity"],
    prompt: "A calculator input has up to 100000 levels of nested brackets. Why prefer an explicit stack over a recursive evaluator?",
    choices: ["Recursion depth that large can overflow the call stack, while an explicit stack lives on the heap", "Recursion is always O(n^2)", "Explicit stacks make the answer exact", "Recursive code cannot handle brackets"],
    answer: 0,
    explanation: "Both approaches are correct and O(n), but each recursive call uses call-stack memory, and a hundred thousand frames can crash. A std::stack or vector grows on the heap, so depth is limited only by memory.",
  },
];
