import type { Lesson } from "@/lib/lessons/types";

/** R6 Stackspire (CURRICULUM R6): stacks, queues, bracket matching. Original wording. */
export const r6Lessons: Lesson[] = [
  {
    id: "r6-stack-basics", region: "R6", section: "R6",
    title: "Stacks and queues: last in, first out",
    summary: "A stack hands back the newest item first. Whenever the problem says nesting, matching or undo, the stack is the data structure, and a queue is its first-in, first-out twin.",
    cardIds: ["r6-stk-signal", "r6-stk-pop-void", "r6-stk-predict", "r6-stk-depth-trace", "r6-stk-match-checks", "r6-stk-pop-error", "r6-stk-uses", "r6-stk-reverse-parsons", "r6-stk-match-cloze", "r6-stk-two-stack", "r6-stk-ring-trace", "r6-stk-ring-full"],
    problemIds: ["crate-brackets", "score-tape", "gauge-stack", "twin-stack-line", "ring-lane"],
    pages: [
      {
        title: "Last in, first out",
        blocks: [
          { kind: "text", text: "A stack has one open end. `push` adds an item on top, `pop` removes the top item, `top` looks at it. The item you added last is the first one you get back. Picture a pile of crates: you can only touch the top one." },
          { kind: "code", run: true, caption: "std::stack: push, top, pop and size.", code: `#include <iostream>
#include <stack>

int main() {
    std::stack<int> st;
    st.push(4);
    st.push(9);
    st.push(2);
    std::cout << st.top() << ' ' << st.size() << '\\n';
    st.pop();
    std::cout << st.top() << ' ' << st.size() << '\\n';
}
` },
          { kind: "text", text: "All three operations are `O(1)`. The signal words in a problem are: nested, matching, most recent, undo, backtrack, evaluate. Each says 'the thing I must deal with next is the newest unfinished thing'." },
          { kind: "pitfall", title: "pop returns nothing, top on empty is undefined", text: "`std::stack::pop()` returns `void`: read with `top()` first, then `pop()`. Calling `top()` or `pop()` on an empty stack is undefined behaviour, not an exception. Check `empty()` before you touch it." },
          { kind: "idiom", title: "A vector is a fine stack", text: "`push_back`, `back` and `pop_back` on a `std::vector` do the same job, and you can also peek at the item below the top or print the whole stack. Many answers use a vector when they need to index into the stack." },
        ],
      },
      {
        title: "Matching pairs",
        blocks: [
          { kind: "text", text: "Bracket checking is the classic stack job. Walk the string. An opener is unfinished business: push it. A closer must match the most recent unfinished opener, which is exactly the top. If the stack is empty or the top is the wrong kind, the string is broken. At the end the stack must be empty, or some opener was never closed." },
          { kind: "code", run: true, caption: "Balanced brackets with a stack of expected closers.", code: `#include <iostream>
#include <stack>
#include <string>

bool balanced(const std::string& s) {
    std::stack<char> want;                 // closers we still owe
    for (char c : s) {
        if (c == '(') want.push(')');
        else if (c == '[') want.push(']');
        else if (c == '{') want.push('}');
        else {
            if (want.empty() || want.top() != c) return false;
            want.pop();
        }
    }
    return want.empty();
}

int main() {
    std::cout << balanced("{[()]}") << balanced("([)]") << balanced("((") << balanced(")(") << '\\n';
}
` },
          { kind: "text", text: "Pushing the closer you expect (instead of the opener) removes a lookup table: the comparison is just `want.top() != c`. There are three ways to fail, and you should be able to name all three: wrong kind on top, closer with nothing open, and openers left over at the end." },
          { kind: "interview", text: "Say the invariant out loud: 'the stack holds the closers I still owe, innermost on top'. Then state the edge cases (empty string is balanced, odd length can never be balanced) before you write the loop." },
        ],
      },
      {
        title: "Queues, rings and two stacks",
        blocks: [
          { kind: "text", text: "A queue is first in, first out: `push` at the back, `front` and `pop` at the front. Use it when the oldest item must be served first (level-by-level search, scheduling). `std::deque` allows both ends. All are `O(1)` per operation." },
          { kind: "text", text: "To build a queue of capacity `cap` in a fixed array, keep `head` (index of the front) and `size`. The next free slot is `(head + size) % cap`, and removing the front moves `head` to `(head + 1) % cap`. The modulo makes the array behave like a ring. Tracking `size` (not just head and tail) removes the classic confusion where an empty ring and a full ring look the same." },
          { kind: "code", run: true, caption: "A ring of 4 slots: where does each item land?", code: `#include <iostream>
#include <vector>

int main() {
    const int cap = 4;
    std::vector<int> slot(cap, 0);
    int head = 0, size = 0;
    auto push = [&](int x) { slot[(head + size) % cap] = x; ++size; };
    auto pop = [&]() { head = (head + 1) % cap; --size; };
    push(10); push(20); push(30);
    pop(); pop();
    push(40); push(50); push(60);
    for (int i = 0; i < size; ++i) std::cout << slot[(head + i) % cap] << ' ';
    std::cout << "| head=" << head << '\\n';
}
` },
          { kind: "text", text: "A queue from two stacks: push onto an 'in' stack. To pop or peek, if the 'out' stack is empty, pour every item from 'in' to 'out' (which reverses the order), then use the top of 'out'. Each item is moved at most once, so any single operation can cost `O(n)` but a sequence of `n` operations costs `O(n)` in total: amortized `O(1)`." },
          { kind: "pitfall", title: "Pour only when out is empty", text: "If you pour while 'out' still holds items, the new items land under the old ones and the order breaks. Pour only when 'out' is empty." },
        ],
      },
    ],
  },
];
