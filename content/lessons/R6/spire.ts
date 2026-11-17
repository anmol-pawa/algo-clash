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
  {
    id: "r6-monotonic-stack", region: "R6", section: "R6",
    title: "Monotonic stacks: the next bigger thing",
    summary: "When each item needs the nearest larger or smaller neighbour, keep a stack whose values only go one way. Every item is pushed once and popped once, so a loop inside a loop still costs O(n).",
    cardIds: ["r6-mono-signal", "r6-mono-invariant", "r6-mono-predict", "r6-mono-pops-trace", "r6-mono-uses", "r6-mono-vector-error", "r6-mono-parsons", "r6-mono-cloze", "r6-mono-amortized", "r6-mono-ties", "r6-mono-hist-trace", "r6-mono-sentinel"],
    problemIds: ["heat-wave", "convoy-count", "drift-rocks", "valley-tally", "skyline-hall", "smallest-seal", "cistern-rows", "lantern-wall"],
    pages: [
      {
        title: "Waiting for something bigger",
        blocks: [
          { kind: "text", text: "Problem: for every day, how many days until a warmer one? The slow answer scans right from each day, `O(n^2)`. The fast answer notices that a day only needs to wait while nothing warmer has shown up. Keep those waiting days on a stack of indices. When a new day arrives, every waiting day that is colder than it is finally answered, and since the newest waiting days are on top, you pop exactly those." },
          { kind: "code", run: true, caption: "Days to wait for a warmer day; the stack holds indices still waiting.", code: `#include <iostream>
#include <stack>
#include <vector>

int main() {
    std::vector<int> temp = {50, 40, 45, 60, 30, 35, 36, 20};
    std::vector<int> wait(temp.size(), 0);
    std::stack<int> pending;               // indices with no warmer day yet
    for (int i = 0; i < static_cast<int>(temp.size()); ++i) {
        while (!pending.empty() && temp[pending.top()] < temp[i]) {
            wait[pending.top()] = i - pending.top();
            pending.pop();
        }
        pending.push(i);
    }
    for (int w : wait) std::cout << w << ' ';
    std::cout << '\\n';
}
` },
          { kind: "text", text: "Look at the stack between iterations: the temperatures from bottom to top never increase. That is the invariant, and it is why the structure is called monotonic. A new value that breaks it pops until it holds again. An index that is popped has found its answer and never returns; an index still on the stack at the end has no warmer day, so its answer stays `0` (or `-1`)." },
          { kind: "interview", text: "Name the pattern before you code: 'for each element I need the next greater one to the right, so I keep a decreasing stack of indices and resolve elements as they get popped'. Store indices, not values, so you can compute distances and write results into the right slot." },
        ],
      },
      {
        title: "Why it is O(n), and which way to point it",
        blocks: [
          { kind: "text", text: "A `while` inside a `for` looks quadratic, but count the work differently: each index is pushed exactly once and popped at most once. Over the whole run the pops total at most `n`, so the loop is `O(n)` time with `O(n)` extra space. One iteration may pop many items; the average is constant. This is the same amortized argument as the two-stack queue." },
          { kind: "text", text: "The same skeleton answers four questions, depending on the comparison and the scan direction. Next greater to the right: pop while the top is smaller. Next smaller to the right: pop while the top is larger. Previous greater or smaller to the left: read the top before you push (it is the nearest survivor). Pick the question first, then the comparison, then check what happens on equal values." },
          { kind: "code", run: true, caption: "Sum of the minimum of every subarray, one pass. Each value counts for the stretch where it is the minimum.", code: `#include <iostream>
#include <stack>
#include <vector>

int main() {
    std::vector<int> a = {2, 5, 2};
    const int n = static_cast<int>(a.size());
    long long total = 0;
    std::stack<int> st;                      // values rise from bottom to top
    for (int i = 0; i <= n; ++i) {
        const int cur = (i == n) ? -1 : a[i];  // -1 sentinel flushes everything
        while (!st.empty() && a[st.top()] >= cur) {
            const int mid = st.top();
            st.pop();
            const int left = st.empty() ? -1 : st.top();
            total += static_cast<long long>(a[mid]) * (mid - left) * (i - mid);
        }
        st.push(i);
    }
    std::cout << total << '\\n';
}
` },
          { kind: "pitfall", title: "Ties must be broken on exactly one side", text: "With equal values, a subarray has several 'minimum' positions. If both sides stop on equal values you count it twice; if neither does you miss it. Make one side strict and the other non-strict (above: pop on `>=`, so the left boundary is strictly smaller and the right boundary may be equal). Test with a tiny array of equal numbers before you trust the code." },
          { kind: "text", text: "Other problems in this region reuse the idea with a twist. Asteroid collisions pop weaker rocks as a heavier one arrives. Car fleets sort by position and keep a stack of arrival times. Removing `k` digits to make the smallest number pops a larger digit whenever a smaller one comes next." },
        ],
      },
      {
        title: "Rectangles and water: the sentinel",
        blocks: [
          { kind: "text", text: "For the largest rectangle under a histogram, each bar can stretch left and right until a shorter bar stops it. Keep a stack of bars with rising heights. When a shorter bar arrives, the top bar can stretch no further to the right: pop it, and it spans from the new top (the nearest shorter bar on the left) to the current index, so its width is `i - left - 1`." },
          { kind: "code", run: true, caption: "Largest rectangle in a histogram. The trailing 0 forces every remaining bar to be measured.", code: `#include <algorithm>
#include <iostream>
#include <stack>
#include <vector>

int main() {
    std::vector<int> h = {2, 1, 5, 6, 2, 3};
    h.push_back(0);                          // sentinel: shorter than every real bar
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
` },
          { kind: "text", text: "Without the sentinel, bars still on the stack at the end are never measured, and that is the most common bug. Adding a height `0` at the end (or flushing after the loop) fixes it. The maximal-rectangle grid problem is this routine run once per row on column heights, `O(rows * cols)` overall." },
          { kind: "text", text: "Trapping rain water also has a stack form: keep non-increasing walls. When a taller wall arrives, pop a floor, and the water above it is a horizontal layer of width `i - left - 1` and height `min(left wall, new wall) - floor`. Use `long long` for the total: a deep, wide well overflows 32 bits." },
          { kind: "interview", text: "State the complexity with the reason: 'each index is pushed and popped once, so O(n) time and O(n) space'. Then walk a small example with a duplicate value and with a strictly increasing input (nothing pops until the sentinel)." },
        ],
      },
    ],
  },
];
