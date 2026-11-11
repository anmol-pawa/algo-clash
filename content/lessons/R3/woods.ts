import type { Lesson } from "@/lib/lessons/types";

/** R3 Window Woods (CURRICULUM R3): fixed and variable windows, at-most/exactly-K, monotonic deque. Original wording. */
export const r3Lessons: Lesson[] = [
  {
    id: "r3-sliding-window", region: "R3", section: "R3",
    title: "Sliding window: grow, shrink, never look back",
    summary: "A contiguous stretch with a rule becomes one pass: a right edge that only grows, a left edge that only follows, and a running summary of what is inside.",
    cardIds: ["r3-win-signal", "r3-win-fixed-cost", "r3-win-fixed-sums", "r3-win-monotone", "r3-win-cost", "r3-win-longest-trace", "r3-win-update-spot", "r3-win-shortest-parsons", "r3-win-negatives", "r3-win-counts", "r3-win-exactly-k", "r3-win-atmost-count", "r3-win-count-add", "r3-win-long-long", "r3-win-lambda-capture", "r3-win-fixed-cloze", "r3-win-shrink-cloze", "r3-win-multi-signal", "r3-win-anagram"],
    problemIds: ["peak-stretch", "calm-window", "tidy-tape", "tight-patch", "flip-budget", "shuffle-spotter", "odd-picks", "cover-strip", "distinct-picks"],
    pages: [
      {
        title: "Fixed window: slide, don't recompute",
        blocks: [
          { kind: "text", text: "When the question is about every stretch of exactly `k` neighbours (the best sum, the number of distinct letters, whether it is a rearrangement of a pattern), recomputing each stretch costs `O(n·k)`. Slide instead: when the window moves one step right, one element enters and one leaves, so update the summary by those two changes in `O(1)`." },
          { kind: "code", run: true, caption: "Largest sum of k consecutive values; one element in, one out.", code: `#include <algorithm>
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
` },
          { kind: "idiom", title: "Index of the leaver", text: "The element that leaves when the window ends at `i` is `a[i - k]`. Write that expression once and check it on the first step: the window `[0, k-1]` becomes `[1, k]`, so `a[0]` leaves when `i = k`." },
          { kind: "pitfall", title: "Short input", text: "If `k > n` there is no window at all. Decide the answer (often 0 or 'none') before the first loop, or the initial `for (i < k)` reads past the end." },
          { kind: "interview", text: "Name the signal: 'fixed size, contiguous, every window'. Then say the update rule in one sentence: 'add the entering element, remove the leaving one'. That sentence is most of the solution." },
        ],
      },
      {
        title: "Variable window: expand right, shrink left",
        blocks: [
          { kind: "text", text: "When the window length is part of the answer ('longest ... such that', 'shortest ... with at least'), keep two indices `l` and `r`. Move `r` right one step at a time to add an element. If the rule is now broken, move `l` right until it holds again. Neither index ever moves backwards, so each element enters once and leaves once: `O(n)` total even though a `while` sits inside a `for`." },
          { kind: "text", text: "This only works when the rule is monotone: if a window is valid, every smaller window inside it is valid too (or the mirror image for a 'sum at least' rule). Then the shrink loop has a clear stopping point and nothing to the left of `l` is worth revisiting." },
          { kind: "code", run: true, caption: "Longest stretch with no repeated letter.", code: `#include <algorithm>
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
` },
          { kind: "code", run: true, caption: "Shortest stretch whose sum reaches a target (all values positive).", code: `#include <algorithm>
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
` },
          { kind: "idiom", title: "Where the answer is recorded", text: "For a 'longest valid' window, record after the shrink loop, when the window is valid. For a 'shortest valid' window, record inside the shrink loop, while it is still valid and you are trying to make it smaller." },
          { kind: "pitfall", title: "Negative numbers break the window", text: "With negatives in a 'sum at least' rule, adding an element can lower the sum and removing one can raise it, so the rule is no longer monotone and shrinking from the left can skip the true answer. That is the case for prefix sums plus a deque (next lesson)." },
          { kind: "interview", text: "Before coding, state why the window is legal: 'the rule only gets harder as the window grows, so once it breaks, only moving the left edge can repair it'. Interviewers listen for that argument, not just the loop." },
        ],
      },
      {
        title: "At most K, exactly K, and counting windows",
        blocks: [
          { kind: "text", text: "Counting windows is a variable window with one change: for each right edge `r`, every start from `l` to `r` gives a valid stretch ending at `r`, so add `r - l + 1`. That is 'count of subarrays with at most K ...'. The 'exactly K' version is not monotone, but it is a difference of two monotone ones: `exactly(K) = atMost(K) - atMost(K - 1)`." },
          { kind: "code", run: true, caption: "Count subarrays containing at most k odd numbers.", code: `#include <iostream>
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
` },
          { kind: "pitfall", title: "Counts overflow int", text: "A window count can reach about `n²/2`. With `n = 10^5` that is `5·10^9`, past the range of `int`. Make the total `long long` even when every input fits in `int`." },
          { kind: "idiom", title: "Counting table for small alphabets", text: "For lowercase letters use `int cnt[26]` or `std::array<int, 26>`: faster than `unordered_map` and comparable with `==` for fixed-window anagram checks. Keep a separate `distinct` or `missing` counter when the rule needs 'how many kinds are inside' so you never rescan the table." },
          { kind: "interview", text: "Say 'at most is monotone, exactly is not, so I subtract two at-most passes' and show the small example. It signals you know why the trick works, not just that it does." },
        ],
      },
    ],
  },
  {
    id: "r3-monotonic-deque", region: "R3", section: "R3",
    title: "Monotonic deque: the window's champion",
    summary: "Keep candidates in a deque that stays sorted, so the best value in the window is always at the front and each index is pushed and popped once.",
    cardIds: ["r3-dq-signal", "r3-dq-why-pop", "r3-dq-indices", "r3-dq-cost", "r3-dq-window-max", "r3-dq-front-trace", "r3-dq-equal", "r3-dq-slide-parsons", "r3-dq-expire", "r3-dq-api", "r3-dq-empty", "r3-dq-min-cloze", "r3-dq-prefix-why", "r3-dq-prefix-rules", "r3-dq-prefix-shortest", "r3-dq-prefix-ll", "r3-dq-no-push", "r3-dq-vs-heap"],
    problemIds: ["pane-peaks", "quota-run"],
    pages: [
      {
        title: "Window maximum in O(n)",
        blocks: [
          { kind: "text", text: "A window of size `k` slides over the array and you need the maximum of every window. Scanning each is `O(n·k)`; a heap with lazy deletion is `O(n log n)`. A deque does it in `O(n)`. Keep indices in the deque in decreasing order of value. Before pushing index `i`, pop from the back every index whose value is `<= a[i]`: those elements are older and no bigger, so they can never be the maximum of any later window. The front is always the champion; drop it when it falls out of the window." },
          { kind: "code", run: true, caption: "Maximum of every window of size k.", code: `#include <deque>
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
` },
          { kind: "idiom", title: "Store indices, not values", text: "You need the index to know when the front has expired (`dq.front() <= i - k`) and you can always get the value back with `a[idx]`. Storing values loses the expiry information." },
          { kind: "pitfall", title: "Empty deque", text: "`front()` and `back()` on an empty `std::deque` are undefined behaviour. The `while` guard checks `!dq.empty()` first; after popping the expired front the deque still contains `i`, so reading the front for the answer is safe." },
          { kind: "interview", text: "Give the amortised argument: 'every index is pushed once and popped at most once, so the inner while loop costs O(n) in total'. That sentence is what separates a deque solution from a quadratic one." },
        ],
      },
      {
        title: "Negatives: prefix sums plus a deque",
        blocks: [
          { kind: "text", text: "Shortest subarray with sum at least `K`, with negatives allowed, cannot use a plain window. Use prefix sums `P[0..n]` where `P[j] - P[i]` is the sum of `a[i..j-1]`. For each `j` you want the largest `i < j` with `P[i] <= P[j] - K`. Keep candidate starts in a deque with increasing prefix values." },
          { kind: "text", text: "Two pops keep it correct. Pop the front while `P[j] - P[front] >= K`: that start has answered for `j`, and any later `j` would only make the stretch longer, so it is finished. Pop the back while `P[back] >= P[j]`: a later start with a smaller or equal prefix is better for every future end. Then push `j`." },
          { kind: "code", run: true, caption: "Shortest subarray with sum >= K, negatives allowed.", code: `#include <algorithm>
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
` },
          { kind: "pitfall", title: "Prefix sums need long long", text: "Even when every value fits in `int`, a prefix sum of 10^5 values of 10^5 is 10^10. Store `P` as `long long`, and make `K` `long long` too so the comparison does not overflow." },
          { kind: "interview", text: "Explain why the plain window fails (not monotone with negatives) and why each pop is safe. Then give `O(n)` time and `O(n)` space and mention that prefix sums turn a range question into a two-index difference." },
        ],
      },
    ],
  },
];
