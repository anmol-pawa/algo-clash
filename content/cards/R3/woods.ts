import type { Card } from "@/lib/cards/types";

/** R3 Window Woods cards. Predict, trace, parsons, cloze and compiler-error results are computed by g++ (content/cards/generated.json). */
export const r3Cards: Card[] = [
  // ---- Sliding window
  {
    id: "r3-win-signal", kind: "mcq", region: "R3", tags: ["sliding-window", "recognition"],
    prompt: "Which problem statement is a sliding-window problem?",
    choices: ["Longest substring that holds at most two distinct letters", "Count the ways to climb n stairs taking 1 or 2 steps", "Shortest path through a grid with walls", "Merge k sorted lists into one"],
    answer: 0,
    explanation: "'Longest/shortest contiguous stretch with a rule' is the window signal: the answer is a substring or subarray and the rule can be repaired by moving one edge. Stairs is DP, grid paths are BFS, merging lists is a heap.",
  },
  {
    id: "r3-win-fixed-cost", kind: "mcq", region: "R3", tags: ["sliding-window", "fixed-window"],
    prompt: "A window of size k moves one step right. How do you update its sum in O(1)?",
    choices: ["Add the entering element and subtract the leaving one", "Recompute the sum of all k elements", "Sort the window and read the middle", "Subtract the maximum of the window"],
    answer: 0,
    explanation: "Exactly one element enters and one leaves, so `sum += a[i] - a[i - k]`. Recomputing would make the whole scan O(n·k).",
  },
  {
    id: "r3-win-fixed-sums", kind: "predict", region: "R3", tags: ["sliding-window", "fixed-window"],
    prompt: "What does this program print?",
    code: `#include <iostream>
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
`,
    explanation: "Window sums of three neighbours: the leaver `a[i - k]` is subtracted once the window is full. There are n - k + 1 = 4 windows.",
  },
  {
    id: "r3-win-monotone", kind: "mcq", region: "R3", tags: ["sliding-window", "invariants"],
    prompt: "Why is shrinking from the left enough to repair 'longest substring with at most k distinct letters'?",
    choices: ["Removing letters can only lower the distinct count, so moving l right eventually restores validity", "Strings are immutable so the right edge cannot move", "The left pointer runs faster than the right", "The window must stay sorted"],
    answer: 0,
    explanation: "The rule is monotone: a valid window stays valid when you cut letters off its end. So once r breaks it, only l has to move, and nothing left of l can matter again.",
  },
  {
    id: "r3-win-cost", kind: "mcq", region: "R3", tags: ["sliding-window", "big-o"],
    prompt: "A variable window has `for (r...)` with a `while (...) ++l;` inside. What is the time on n elements?",
    choices: ["O(n): l and r each move at most n steps in total", "O(n²) because of the nested loops", "O(n log n)", "O(n·k) for window size k"],
    answer: 0,
    explanation: "The inner loop is not restarted: l only moves forward, so across the whole run it moves at most n times. Count total pointer moves, not nesting depth.",
  },
  {
    id: "r3-win-longest-trace", kind: "trace", region: "R3", tags: ["sliding-window", "trace"],
    prompt: "What does this program print?",
    code: `#include <algorithm>
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
`,
    explanation: "The window shrinks past the older 'w' whenever a repeat arrives. The longest repeat-free stretch is 'wke' (or 'kew'), length 3.",
  },
  {
    id: "r3-win-update-spot", kind: "mcq", region: "R3", tags: ["sliding-window", "shortest"],
    prompt: "For the SHORTEST window whose sum is at least a target (positive values), where do you record the answer?",
    choices: ["Inside the shrink loop, before moving l", "After the shrink loop", "Before the for loop", "Only when r reaches the last index"],
    answer: 0,
    explanation: "Inside the loop the window is still valid, and each shrink may give an even shorter valid one. After the loop it is invalid. A 'longest' window is recorded after the loop instead.",
  },
  {
    id: "r3-win-shortest-parsons", kind: "parsons", region: "R3", tags: ["sliding-window", "parsons"],
    prompt: "Order the lines so the program prints the length of the shortest stretch with sum at least 7.",
    lines: [
      "#include <algorithm>",
      "#include <iostream>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> a = {2, 3, 1, 2, 4, 3};",
      "    int sum = 0, l = 0, best = 99;",
      "    for (int r = 0; r < 6; ++r) {",
      "        sum += a[r];",
      "        while (sum >= 7) {",
      "            best = std::min(best, r - l + 1);",
      "            sum -= a[l++];",
      "        }",
      "    }",
      "    std::cout << best << \"\\n\";",
      "}",
    ],
    explanation: "Add on the right, then while the window is valid record its length and drop the left element. Recording after the loop would measure an invalid window.",
  },
  {
    id: "r3-win-negatives", kind: "mcq", region: "R3", tags: ["sliding-window", "negatives"],
    prompt: "Why does the plain two-pointer window fail for 'shortest subarray with sum at least K' when values may be negative?",
    choices: ["The sum is no longer monotone in the window, so you cannot tell which edge to move", "Negative numbers cannot be stored in vector<int>", "Prefix sums always overflow", "std::deque rejects negative values"],
    answer: 0,
    explanation: "With negatives, adding an element can lower the sum and removing one can raise it. A too-small window might become valid by growing, or a valid one might need its left end kept. Prefix sums plus a monotonic deque restore the argument.",
  },
  {
    id: "r3-win-counts", kind: "mcq", region: "R3", tags: ["sliding-window", "frequency-table"],
    prompt: "The input contains only lowercase letters. What is the best structure for the window's letter counts?",
    choices: ["int cnt[26], indexed by c - 'a'", "std::set<char> that stores each letter once", "std::vector<std::string>", "A sorted copy of the window"],
    answer: 0,
    explanation: "A fixed array gives O(1), cache-friendly updates and supports tracking a `distinct` counter. A set loses multiplicity: you need counts to know when a letter fully leaves.",
  },
  {
    id: "r3-win-exactly-k", kind: "mcq", region: "R3", tags: ["sliding-window", "exactly-k"],
    prompt: "How do you count subarrays with EXACTLY K odd numbers using window passes?",
    choices: ["atMost(K) - atMost(K - 1)", "atMost(K) + atMost(K - 1)", "2 * atMost(K)", "atMost(K + 1) - atMost(K - 1)"],
    answer: 0,
    explanation: "'At most K' includes 'exactly K' and everything with fewer. Subtracting 'at most K-1' leaves exactly K. 'At most' is monotone, so it fits a window; 'exactly' is not.",
  },
  {
    id: "r3-win-atmost-count", kind: "predict", region: "R3", tags: ["sliding-window", "exactly-k"],
    prompt: "What does this program print? (counts subarrays with exactly 2 ones)",
    code: `#include <iostream>
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
`,
    explanation: "The ranges with exactly two ones are [0,2], [0,3], [1,4] and [2,4]: 4. The difference of two at-most passes removes everything with fewer than two ones.",
  },
  {
    id: "r3-win-count-add", kind: "mcq", region: "R3", tags: ["sliding-window", "counting"],
    prompt: "In an 'at most K' counting window, after shrinking, why do you add r - l + 1 to the total?",
    choices: ["Every start from l to r gives a valid subarray ending at r", "It is the length of the longest answer so far", "It counts only the single subarray [l, r]", "It prevents integer overflow"],
    answer: 0,
    explanation: "Validity is monotone, so if [l, r] is valid then [l+1, r], ..., [r, r] are valid too. That is r - l + 1 subarrays that end exactly at r; summing over r counts each subarray once.",
  },
  {
    id: "r3-win-long-long", kind: "mcq", region: "R3", tags: ["sliding-window", "overflow"],
    prompt: "n = 100000 and you count every valid subarray. Which type should the total have?",
    choices: ["long long: n(n+1)/2 is about 5·10^9", "int: n fits in int", "short", "unsigned char"],
    answer: 0,
    explanation: "The number of subarrays grows like n²/2, beyond 2^31 - 1 ≈ 2.1·10^9. The inputs fitting in int does not make the count fit.",
  },
  {
    id: "r3-win-lambda-capture", kind: "compilerError", region: "R3", tags: ["lambda", "compiler-errors"],
    prompt: "This predicate does not compile. What is the cause?",
    code: `#include <vector>

int main() {
    int limit = 3;
    std::vector<int> a = {1, 2, 3};
    auto tooBig = [](int x) { return x > limit; };
    return tooBig(a[0]);
}
`,
    choices: ["The lambda uses limit but does not capture it", "A lambda cannot return bool", "limit must be a global", "tooBig must be declared with int, not auto"],
    answer: 0,
    explanation: "A lambda with an empty capture list cannot see local variables. Write `[limit](int x) { ... }` (by value) or `[&]` (by reference).",
  },
  {
    id: "r3-win-fixed-cloze", kind: "cloze", region: "R3", tags: ["sliding-window", "fixed-window"],
    prompt: "Fill the blanks so the program prints the largest sum of 3 consecutive values.",
    template: `#include <algorithm>
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
`,
    blanks: [["-"], ["i - k", "i-k"]],
    explanation: "The entering element is added and the one k places behind is subtracted: `sum += a[i] - a[i - k]`. The best window is 7 + 8 + 1 = 16.",
  },
  {
    id: "r3-win-shrink-cloze", kind: "cloze", region: "R3", tags: ["sliding-window", "variable-window"],
    prompt: "Fill the blanks so it prints the longest stretch with no repeated letter.",
    template: `#include <algorithm>
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
`,
    blanks: [[">"], ["++l", "l++"]],
    explanation: "A letter seen more than once breaks the rule, so shrink while `cnt > 1`; the shrink must also advance `l`, otherwise the loop never ends.",
  },
  {
    id: "r3-win-multi-signal", kind: "multi", region: "R3", tags: ["sliding-window", "recognition"],
    prompt: "Select every problem that fits a sliding window.",
    choices: ["Longest substring with at most k distinct characters", "Shortest subarray of positives with sum at least a target", "Maximum of every window of size k", "Count the ways to partition into equal-sum subsets", "Minimum cost path through a DAG"],
    answers: [0, 1, 2],
    explanation: "The first three ask about contiguous stretches with a rule repaired by moving edges. Subset partition and DAG paths are DP problems: the chosen items are not contiguous.",
  },
  {
    id: "r3-win-anagram", kind: "mcq", region: "R3", tags: ["sliding-window", "anagram"],
    prompt: "You slide a window of size |p| over s and compare two 26-slot count arrays with == at every step. What is the time?",
    choices: ["O(26·n) = O(n)", "O(n·|p|) for every input", "O(n²)", "O(26^n)"],
    answer: 0,
    explanation: "Each step updates two counts and compares 26 slots, a constant. Keeping a `matches` counter for how many letters agree makes it O(n) without even the factor 26.",
  },

  // ---- Monotonic deque
  {
    id: "r3-dq-signal", kind: "mcq", region: "R3", tags: ["monotonic-deque", "recognition"],
    prompt: "You must report the maximum of every window of size k. What is the best-fit structure?",
    choices: ["A monotonic deque of indices (O(n))", "Sort each window", "Memoised recursion", "Union-Find"],
    answer: 0,
    explanation: "A monotonic deque keeps the champion at the front and discards candidates that can never win, for O(n) in total. Sorting each window is O(n·k log k); a heap is O(n log n).",
  },
  {
    id: "r3-dq-why-pop", kind: "mcq", region: "R3", tags: ["monotonic-deque", "invariants"],
    prompt: "When a[i] arrives, why can an earlier, smaller element be dropped from a max-deque?",
    choices: ["It leaves the window sooner and is smaller, so it can never be the maximum of a window that includes a[i]", "Because it was already printed", "Because the deque must be sorted by index", "It would overflow the deque"],
    answer: 0,
    explanation: "Any window containing the older element also contains the newer, larger one (windows are contiguous and slide right), and the older one expires first. So it is dominated forever.",
  },
  {
    id: "r3-dq-indices", kind: "mcq", region: "R3", tags: ["monotonic-deque", "indices"],
    prompt: "Why does the deque store indices rather than values?",
    choices: ["To know when the front has left the window", "Because deque<int> cannot hold array values", "Because values may be negative", "To make push_back faster"],
    answer: 0,
    explanation: "The value is always `a[idx]`, but an index also tells you its age: when `front <= i - k` it is outside the window and must be removed.",
  },
  {
    id: "r3-dq-cost", kind: "mcq", region: "R3", tags: ["monotonic-deque", "big-o"],
    prompt: "What is the time complexity of the monotonic-deque window maximum?",
    choices: ["O(n): each index is pushed once and popped at most once", "O(n·k)", "O(n log k)", "O(n log n)"],
    answer: 0,
    explanation: "The inner `while` pops elements that were pushed earlier, and nothing is pushed twice, so total pops are at most n. This amortised argument is what interviewers want to hear.",
  },
  {
    id: "r3-dq-window-max", kind: "predict", region: "R3", tags: ["monotonic-deque", "trace"],
    prompt: "What does this program print?",
    code: `#include <deque>
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
`,
    explanation: "The 9 is the champion until index 0 leaves the window; then 8 takes over. Each printed value is the front of the deque after the expiry check.",
  },
  {
    id: "r3-dq-front-trace", kind: "trace", region: "R3", tags: ["monotonic-deque", "trace"],
    prompt: "What does this program print?",
    code: `#include <deque>
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
`,
    explanation: "A strictly decreasing array never pops from the back, so the deque grows until old indices expire. At the end it holds the last k indices (2, 3, 4): size 3.",
  },
  {
    id: "r3-dq-equal", kind: "mcq", region: "R3", tags: ["monotonic-deque", "ties"],
    prompt: "In a max-deque, a[back] equals a[i]. Which statement is true?",
    choices: ["Popping with <= keeps one entry per run of equals; popping with < keeps all of them; both give correct maxima", "Only <= is correct", "Only < is correct", "Equal elements must be removed from the array first"],
    answer: 0,
    explanation: "Equal values give the same maximum. Popping them (<=) keeps the deque smaller, and the newer copy outlives the older, so nothing is lost. Keeping them (<) is also correct but wastes space.",
  },
  {
    id: "r3-dq-slide-parsons", kind: "parsons", region: "R3", tags: ["monotonic-deque", "parsons"],
    prompt: "Order the lines so the program prints the maximum of each window of size 2.",
    lines: [
      "#include <deque>",
      "#include <iostream>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> a = {4, 2, 12, 3};",
      "    int k = 2;",
      "    std::deque<int> dq;",
      "    for (int i = 0; i < 4; ++i) {",
      "        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();",
      "        dq.push_back(i);",
      "        if (dq.front() <= i - k) dq.pop_front();",
      "        if (i >= k - 1) std::cout << a[dq.front()] << ' ';",
      "    }",
      "    std::cout << \"\\n\";",
      "}",
    ],
    explanation: "Pop dominated candidates from the back, push the new index, expire the front, then read the champion once a full window exists.",
  },
  {
    id: "r3-dq-expire", kind: "mcq", region: "R3", tags: ["monotonic-deque", "off-by-one"],
    prompt: "The window ending at i covers indices i-k+1 .. i. When has the front index f expired?",
    choices: ["f <= i - k", "f < i - k", "f >= i - k", "f == i"],
    answer: 0,
    explanation: "Index i-k is just outside [i-k+1, i]. Using `<` would keep a stale champion one step too long, a classic off-by-one.",
  },
  {
    id: "r3-dq-api", kind: "multi", region: "R3", tags: ["deque", "api"],
    prompt: "Select every member function that exists on std::deque<int>.",
    choices: ["push_back(x)", "pop_front()", "front()", "push(x)", "top()"],
    answers: [0, 1, 2],
    explanation: "`std::deque` has push_back/push_front, pop_back/pop_front, front, back, size and empty. `push` and `top` belong to `std::queue` and `std::stack` adaptors.",
  },
  {
    id: "r3-dq-empty", kind: "mcq", region: "R3", tags: ["deque", "undefined-behaviour"],
    prompt: "What happens if you call dq.front() on an empty std::deque?",
    choices: ["Undefined behaviour: guard with !dq.empty()", "It throws std::out_of_range", "It returns 0", "It returns -1"],
    answer: 0,
    explanation: "`front()` does not check. `at()` throws for out-of-range indexes but there is no checked front. Always test `empty()` first when the loop may have popped everything.",
  },
  {
    id: "r3-dq-min-cloze", kind: "cloze", region: "R3", tags: ["monotonic-deque", "window-min"],
    prompt: "Fill the blanks so it prints the MINIMUM of every window of size 3.",
    template: `#include <deque>
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
`,
    blanks: [[">=", ">"], ["<="]],
    explanation: "For a minimum, flip the pop test: drop back elements that are larger than (or equal to) the newcomer. Expiry is unchanged: `front <= i - k`.",
  },
  {
    id: "r3-dq-prefix-why", kind: "mcq", region: "R3", tags: ["monotonic-deque", "prefix-sums"],
    prompt: "Why use prefix sums for 'shortest subarray with sum at least K' when negatives are allowed?",
    choices: ["P[j] - P[i] is any range sum, so each end j needs the nearest start i with a small enough prefix", "They remove the negative numbers", "They sort the array", "They make the plain window monotone"],
    answer: 0,
    explanation: "Prefix sums turn a range sum into a difference of two entries. The problem becomes: for each j find the closest earlier i with P[i] <= P[j] - K, which a monotonic deque answers in amortised O(1).",
  },
  {
    id: "r3-dq-prefix-rules", kind: "mcq", region: "R3", tags: ["monotonic-deque", "prefix-sums"],
    prompt: "In the prefix-sum deque, why pop from the back while P[back] >= P[j]?",
    choices: ["A later start with a smaller or equal prefix is shorter and at least as good for every future end", "To keep the deque sorted by index", "To avoid overflow", "To remove duplicate indices"],
    answer: 0,
    explanation: "For any future end, using start j instead of the older back start gives a shorter stretch and a sum that is at least as large. The older start is dominated and can be discarded.",
  },
  {
    id: "r3-dq-prefix-shortest", kind: "predict", region: "R3", tags: ["monotonic-deque", "prefix-sums"],
    prompt: "What does this program print?",
    code: `#include <algorithm>
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
`,
    explanation: "No stretch of length 1 or 2 reaches 7; [4, -2, 6] sums to 8, so the answer is 3. The negative values would break a plain window, but the two pops handle them.",
  },
  {
    id: "r3-dq-prefix-ll", kind: "mcq", region: "R3", tags: ["prefix-sums", "overflow"],
    prompt: "n = 10^5 and |a[i]| <= 10^5. How large can a prefix sum be, and what type should P use?",
    choices: ["Up to 10^10: long long", "Up to 10^5: int", "Up to 10^7: int", "Exactly 2^31: unsigned int"],
    answer: 0,
    explanation: "10^5 values of up to 10^5 each sum to 10^10, past the int range. Declare `P` and `K` as `long long`; otherwise the comparison `P[j] - P[i] >= K` can wrap.",
  },
  {
    id: "r3-dq-no-push", kind: "compilerError", region: "R3", tags: ["deque", "compiler-errors"],
    prompt: "This code does not compile. What is the cause?",
    code: `#include <deque>

int main() {
    std::deque<int> dq;
    dq.push(3);
    return dq.size();
}
`,
    choices: ["std::deque has no push; use push_back or push_front", "deque needs a size argument", "The deque must be declared const", "int cannot be stored in a deque"],
    answer: 0,
    explanation: "`push` and `pop` are the interface of `std::queue` and `std::stack`. The deque itself spells the end explicitly: push_back, push_front, pop_back, pop_front.",
  },
  {
    id: "r3-dq-vs-heap", kind: "mcq", region: "R3", tags: ["monotonic-deque", "heap"],
    prompt: "A max-heap with lazy deletion also solves window maximum. Compared with it, the monotonic deque…",
    choices: ["Runs in O(n) instead of O(n log n) and needs no lazy deletion", "Runs in O(n log n)", "Only works on sorted arrays", "Uses recursion"],
    answer: 0,
    explanation: "A heap keeps stale entries until they reach the top; the deque keeps only live candidates and both of its ends are O(1). The heap is still a fine fallback when you forget the deque.",
  },
];
