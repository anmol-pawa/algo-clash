import type { Lesson } from "@/lib/lessons/types";

/ R2 Array Atoll (CURRICULUM R2): hashing basics, two pointers, prefix sums, Kadane. Original wording. */
export const r2Lessons: Lesson[] = [
  {
    id: "r2-hash-lookup", region: "R2", section: "R2",
    title: "Hash lookup: have I seen it before?",
    summary: "Trade memory for time: store what you have seen in an unordered_map or unordered_set and answer pair, duplicate and grouping questions in one pass.",
    cardIds: ["r2-hash-signal", "r2-hash-cost", "r2-map-bracket-insert", "r2-count-loop", "r2-pair-complement", "r2-set-insert-result", "r2-hash-pair-order", "r2-find-vs-count", "r2-hash-key-sorted", "r2-hash-const-bracket", "r2-hash-chain-start", "r2-hash-iteration-order"],
    problemIds: ["matching-pairs", "echo-gate", "scramble-check", "badge-chain", "scramble-clans"],
    pages: [
      {
        title: "The lookup habit",
        blocks: [
          { kind: "text", text: "The brute force for 'is there a pair that sums to `t`?' tries every pair: `O(n²)`. The hash version asks a different question at each element: has the partner I need already appeared? A lookup in `unordered_map` or `unordered_set` is `O(1)` on average, so one pass gives `O(n)` time and `O(n)` extra space." },
          { kind: "text", text: "Order matters: look the partner up before you insert the current element. That is what stops an element from pairing with itself, and it still finds every pair because the earlier element of the pair is already stored when the later one arrives." },
          { kind: "code", run: true, caption: "Count pairs that add to a target, one pass.", code: `#include <iostream>
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
` },
          { kind: "pitfall", title: "operator[] inserts", text: "`seen[k]` on a missing key creates it with value `0`. Reading with `[]` while you are also testing membership silently grows the map and can change a later `size()` or iteration. Use `find`, `count` or `contains` (C++20) to ask without inserting." },
          { kind: "interview", text: "Say the trade out loud: 'I spend O(n) memory to turn an O(n) inner scan into an O(1) lookup, so the pair search drops from O(n²) to O(n).' Then state the average-versus-worst-case caveat for hashing." },
        ],
      },
      {
        title: "Keys, grouping and chain starts",
        blocks: [
          { kind: "text", text: "Hashing is not only 'seen it'. Frequency maps answer 'how many'. Canonical keys answer 'same group': two words are anagrams exactly when their sorted letters match, so the sorted word is the map key and the value is the list of words. When the alphabet is small and fixed, a 26-slot count array is both the fastest map and the key." },
          { kind: "text", text: "A hash set can also replace sorting. To find the longest run of consecutive integers, put every value in a set, then only start counting from values whose predecessor `x - 1` is not in the set. Each run is walked once, so the total work is `O(n)` even though there is a loop inside the loop." },
          { kind: "code", run: true, caption: "Longest run of consecutive values; only chain starts walk.", code: `#include <algorithm>
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
` },
          { kind: "idiom", title: "C++ Corner: the unordered_map API", text: "`m[k]` read-or-insert, `m.find(k)` returns an iterator (`it->second`), `m.count(k)` is 0 or 1, `m.emplace(k, v)` and `m.insert({k, v})` do not overwrite an existing key, `m.erase(k)` removes it. Iterate with `for (const auto& [key, value] : m)`. The iteration order is unspecified: never print a map's order and call it an answer." },
          { kind: "pitfall", title: "No hash for pair or vector", text: "`unordered_map<pair<int,int>, int>` does not compile because the standard provides no hash for `pair`. Encode the pair into one `long long` (`(long long)a * M + b`), build a string key, or use `map` (`O(log n)` but always legal). Hashwood Harbor goes deeper on custom hashes." },
          { kind: "interview", text: "Name the signal before the code: 'seen before', 'pair summing to', 'group by', 'count frequency'. Then mention the worst case: adversarial keys can degrade a hash table to O(n) per operation." },
        ],
      },
    ],
  },
  {
    id: "r2-two-pointers", region: "R2", section: "R2",
    title: "Two pointers: let order do the work",
    summary: "On sorted input or in-place rewriting, two indices that only move forward replace a nested loop with a single pass.",
    cardIds: ["r2-tp-signal", "r2-tp-why-move", "r2-tp-sorted-pair", "r2-tp-compact", "r2-tp-compact-order", "r2-tp-dedupe-3sum", "r2-tp-water-move", "r2-tp-trap-cost", "r2-tp-dutch", "r2-tp-boats", "r2-tp-palindrome-skip", "r2-tp-sort-cost"],
    problemIds: ["mirror-check", "triple-tally", "widest-basin", "ferry-pairs", "tide-pools"],
    pages: [
      {
        title: "Opposite ends",
        blocks: [
          { kind: "text", text: "When the array is sorted and you want a pair with a target sum, put `l` at the left end and `r` at the right end. If `a[l] + a[r]` is too small, the only way to grow it is to move `l` right; if too large, move `r` left. Every step discards one element that can no longer be part of an answer, so the scan is `O(n)` after the sort." },
          { kind: "code", run: true, caption: "Sorted pair sum with no extra memory.", code: `#include <iostream>
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
` },
          { kind: "text", text: "The same shape solves *three sum*: sort, fix the first value, run the pair scan on the rest, and skip equal neighbours after each hit so a repeated value does not report the same trio twice. Container-with-most-water uses it too: the area is limited by the shorter wall, so only moving the shorter pointer can ever help. Trapping rain water keeps the running maximum from each side and always advances the side with the smaller maximum." },
          { kind: "pitfall", title: "Two pointers needs a reason to move", text: "Before you write the loop, be able to say why discarding one end is safe. If you cannot, the pattern does not apply (unsorted input with negatives usually wants a hash map or prefix sums instead)." },
          { kind: "interview", text: "Argue correctness in one sentence: 'if the sum is too small, a[l] paired with anything left of r is even smaller, so a[l] can never be in an answer, and I can drop it.'" },
        ],
      },
      {
        title: "Same direction: read and write pointers",
        blocks: [
          { kind: "text", text: "For in-place filtering, a read pointer scans every element and a write pointer marks where the next kept element goes. Keep it when it passes the test, copy it to `write`, advance `write`. At the end `write` is the new length. Order is preserved and no extra array is used." },
          { kind: "code", run: true, caption: "Move zeros to the back, keeping the order of the rest.", code: `#include <iostream>
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
` },
          { kind: "text", text: "Three pointers give the Dutch national flag: `lo` marks the end of the zeros, `hi` the start of the twos, `i` scans. Swap a `0` to `lo` and advance both; swap a `2` to `hi` and move only `hi` (the swapped-in value is unchecked); step past a `1`. It sorts three values in one pass and `O(1)` space." },
          { kind: "idiom", title: "Greedy pairing on sorted weights", text: "To fit the most boats with a weight limit and at most two people each, sort, then try to pair the heaviest remaining with the lightest. If they do not fit together, the heaviest travels alone. This is two pointers plus an exchange argument." },
          { kind: "interview", text: "Mention the cost of getting the order: 'sorting is O(n log n), so the whole solution is O(n log n) even though the scan is O(n).' Forgetting this is a common slip." },
        ],
      },
    ],
  },
  {
    id: "r2-prefix-kadane", region: "R2", section: "R2",
    title: "Prefix sums, difference arrays and Kadane",
    summary: "Precompute running totals so any range sum is a subtraction, turn range updates into two point updates, and find the best subarray in one pass.",
    cardIds: ["r2-ps-signal", "r2-ps-build", "r2-ps-range", "r2-ps-subk-seed", "r2-ps-subk-trace", "r2-ps-negatives", "r2-diff-array", "r2-diff-order", "r2-kadane-restart", "r2-kadane-negative", "r2-circular", "r2-ps-overflow"],
    problemIds: ["range-ledger", "hot-streak", "exact-stretches", "sprinkler-lanes", "ring-gain"],
    pages: [
      {
        title: "Prefix sums",
        blocks: [
          { kind: "text", text: "Let `pre[i]` be the sum of the first `i` elements, with `pre[0] = 0`. Then the sum of `a[l..r]` (inclusive) is `pre[r + 1] - pre[l]`. Building the table costs `O(n)` once; each of `q` queries is `O(1)`, so `q` queries cost `O(n + q)` instead of `O(n·q)`." },
          { kind: "text", text: "For 'count subarrays whose sum is `k`' with negative values allowed, a sliding window breaks because extending the window no longer makes the sum monotone. Use prefix sums instead: a subarray ending here sums to `k` exactly when some earlier prefix equals `current - k`. Keep a map of prefix → count and seed it with `{0: 1}` so subarrays that start at index 0 are counted." },
          { kind: "code", run: true, caption: "Count subarrays with sum k, negatives allowed.", code: `#include <iostream>
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
` },
          { kind: "pitfall", title: "Overflow and the missing seed", text: "Sums of `10⁵` values up to `10⁹` need `long long`. Forgetting the `{0, 1}` seed loses every subarray that starts at the front: the bug passes small hand tests and fails the hidden ones." },
          { kind: "interview", text: "Tell the interviewer why not a window: 'negatives mean the sum is not monotone, so I use prefix sums with a hash map'. It signals you understand when each pattern is valid." },
        ],
      },
      {
        title: "Difference arrays and Kadane",
        blocks: [
          { kind: "text", text: "A difference array is the prefix sum in reverse. To add `v` to every cell in `[l, r]`, do `d[l] += v` and `d[r + 1] -= v`, which is `O(1)` per update. After all updates, a running sum over `d` rebuilds the final array in `O(n)`. Many range updates followed by one read is its signal (sprinklers, bookings, car pooling)." },
          { kind: "code", run: true, caption: "Three range additions, one rebuild.", code: `#include <iostream>
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
` },
          { kind: "text", text: "Kadane's algorithm finds the best non-empty subarray sum in one pass. At each element decide: extend the run that ends at the previous element, or restart here. `cur = max(x, cur + x)`, `best = max(best, cur)`. Start from the first element (not `0`), or an all-negative array returns a wrong `0`." },
          { kind: "code", run: true, caption: "Kadane with the correct start.", code: `#include <algorithm>
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
` },
          { kind: "idiom", title: "Circular arrays", text: "The best circular subarray is either an ordinary one or the total minus the worst ordinary one (the wrapped part is everything outside a minimum stretch). Take the larger. If every value is negative the 'total minus min' case would be empty, so return the plain Kadane answer." },
          { kind: "interview", text: "Name the invariant: 'cur is the best sum of a subarray ending at i'. Interviewers listen for a stated invariant, then ask about the all-negative case." },
        ],
      },
    ],
  },
];
