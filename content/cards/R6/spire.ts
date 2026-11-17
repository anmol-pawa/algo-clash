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
];
