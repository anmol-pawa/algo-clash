import type { Card } from "@/lib/cards/types";

/** R2 Array Atoll cards. Predict, trace, parsons and cloze results are computed by g++ (content/cards/generated.json). */
export const r2Cards: Card[] = [
  // ---- Hash lookup
  {
    id: "r2-hash-signal", kind: "mcq", region: "R2", tags: ["hashing", "recognition"],
    prompt: "Which phrase in a problem statement most strongly suggests a hash map or set?",
    choices: ["The array is sorted in ascending order", "Report the first value that has appeared before", "Find the contiguous block with the largest total", "Do it in place with O(1) extra memory"],
    answer: 1,
    explanation: "'Appeared before', 'pair summing to', 'group by' and 'count how many' are lookup questions: remember what you have seen. Sorted input points to two pointers or binary search, a best contiguous block to Kadane, and O(1) extra memory rules the hash table out.",
  },
  {
    id: "r2-hash-cost", kind: "mcq", region: "R2", tags: ["hashing", "big-o"],
    prompt: "A pair-sum scan stores every value in an unordered_set and looks up target - x for each x. What are the time and extra space?",
    choices: ["O(n) average time, O(n) space", "O(n log n) time, O(1) space", "O(n²) time, O(n) space", "O(n) worst-case time, O(1) space"],
    answer: 0,
    explanation: "Each of the n lookups and inserts is O(1) on average, so the pass is O(n), and the set can hold n values. The worst case degrades if many keys collide, which is why interviewers want 'average' said out loud.",
  },
  {
    id: "r2-map-bracket-insert", kind: "predict", region: "R2", tags: ["unordered_map", "operator-brackets"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<int, int> m;
    m[1] = 10;
    int a = m[2];            // read a key that is missing
    std::cout << a << ' ' << m.size() << '\\n';
}
`,
    explanation: "`operator[]` inserts a missing key with a value-initialised `0`, so reading key 2 both returns 0 and grows the map to two entries. Use `find` or `count` to ask without inserting.",
  },
  {
    id: "r2-count-loop", kind: "predict", region: "R2", tags: ["frequency-map"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <string>
#include <unordered_map>

int main() {
    std::string s = "banana";
    std::unordered_map<char, int> freq;
    for (char c : s) ++freq[c];
    std::cout << freq['a'] << ' ' << freq['n'] << ' ' << freq['b'] << ' ' << freq.size() << '\\n';
}
`,
    explanation: "'a' appears 3 times, 'n' twice, 'b' once, and there are 3 distinct letters. `++freq[c]` is the standard frequency idiom because a missing key starts at 0.",
  },
  {
    id: "r2-pair-complement", kind: "parsons", region: "R2", tags: ["pair-sum", "parsons"],
    prompt: "Order the lines so the program prints the index pair (2 sum to 9) found in one pass.",
    lines: [
      "#include <iostream>",
      "#include <unordered_map>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> a = {2, 7, 11, 15};",
      "    std::unordered_map<int, int> idx;",
      "    for (int i = 0; i < 4; ++i) {",
      "        auto it = idx.find(9 - a[i]);",
      "        if (it != idx.end()) { std::cout << it->second << ' ' << i << \"\\n\"; break; }",
      "        idx[a[i]] = i;",
      "    }",
      "}",
    ],
    explanation: "Look the complement up first, then insert the current value. Inserting before the lookup would let an element pair with itself (for example target 8 with a 4 in the array).",
  },
  {
    id: "r2-set-insert-result", kind: "predict", region: "R2", tags: ["unordered_set", "duplicates"],
    prompt: "What does this program print? (insert returns a pair whose .second says whether a new element was added.)",
    code: `#include <iostream>
#include <unordered_set>

int main() {
    std::unordered_set<int> s;
    int values[] = {5, 3, 5, 8, 3};
    for (int v : values) std::cout << s.insert(v).second;
    std::cout << '\\n';
}
`,
    explanation: "The first 5, 3 and 8 are new (1), the repeated 5 and 3 are not (0). Checking `insert(v).second` finds the first duplicate in a single hash operation per element.",
  },
  {
    id: "r2-hash-pair-order", kind: "mcq", region: "R2", tags: ["pair-sum", "hashing"],
    prompt: "In the one-pass pair-sum loop, why do you look up the complement before inserting the current value?",
    choices: ["So an element cannot pair with itself", "Because insert invalidates every iterator", "To keep the map sorted", "It makes the lookup O(1) instead of O(log n)"],
    answer: 0,
    explanation: "If x were inserted first, target - x could match x itself when target = 2x, counting one element as a pair. Looking first only sees earlier elements, and every valid pair is still found when its later element arrives.",
  },
  {
    id: "r2-find-vs-count", kind: "multi", region: "R2", tags: ["unordered_map", "api"],
    prompt: "Select every expression that tests whether key k is in an unordered_map m WITHOUT inserting it.",
    choices: ["m.count(k) > 0", "m.find(k) != m.end()", "m[k] != 0", "m.contains(k)  (C++20)", "m.at(k) != 0"],
    answers: [0, 1, 3],
    explanation: "`count`, `find` and C++20 `contains` only look. `m[k]` inserts a zero when the key is missing, and `m.at(k)` throws std::out_of_range instead of answering false.",
  },
  {
    id: "r2-hash-key-sorted", kind: "cloze", region: "R2", tags: ["grouping", "canonical-key"],
    prompt: "Fill the blanks so the program groups anagrams under a sorted-letters key and prints how many groups there are.",
    template: `#include <algorithm>
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
`,
    blanks: [["std::sort", "sort"], ["push_back", "emplace_back"]],
    explanation: "The sorted letters are the same for every anagram of a word, so they make a canonical key; each group collects its words in a vector. Three keys (aet, ant, abt) give three groups.",
  },
  {
    id: "r2-hash-const-bracket", kind: "compilerError", region: "R2", tags: ["const", "unordered_map", "compiler-errors"],
    prompt: "This helper does not compile. What is the cause?",
    code: `#include <string>
#include <unordered_map>

int countOf(const std::unordered_map<std::string, int>& m, const std::string& k) {
    return m[k];
}

int main() {
    std::unordered_map<std::string, int> m{{"a", 1}};
    return countOf(m, "a");
}
`,
    choices: ["operator[] may insert, so it cannot be called on a const map", "The key must be a char, not a string", "countOf must return a reference", "unordered_map needs a custom hash for string"],
    answer: 0,
    explanation: "`operator[]` is a non-const member because it can insert. For a const map use `find` (then `it->second`), `count`, or `at(k)` if throwing on a missing key is acceptable.",
  },
  {
    id: "r2-hash-chain-start", kind: "mcq", region: "R2", tags: ["hash-set", "longest-consecutive"],
    prompt: "Longest consecutive run using an unordered_set: why is it O(n) even though a while loop sits inside the for loop?",
    choices: ["Only values whose x - 1 is absent start a run, so each element is walked once", "The while loop runs at most 26 times", "The set keeps its elements sorted", "Hash lookups cost O(1) so loops are free"],
    answer: 0,
    explanation: "A run is only walked from its first element, and the walk visits each of its members once. Every element belongs to exactly one run, so the total over all starts is n steps plus n set lookups.",
  },
  {
    id: "r2-hash-iteration-order", kind: "mcq", region: "R2", tags: ["unordered_map", "pitfalls"],
    prompt: "A solution prints the contents of an unordered_map by iterating it. What can you rely on?",
    choices: ["Nothing: the order is unspecified, so sort first if the order matters", "Keys come out in insertion order", "Keys come out in ascending order", "Keys come out in the order of their hash values, which is portable"],
    answer: 0,
    explanation: "The order depends on the implementation, the bucket count and the history of inserts. For deterministic output copy to a vector and sort, or use std::map (ordered, O(log n) per operation).",
  },

  // ---- Two pointers
  {
    id: "r2-tp-signal", kind: "mcq", region: "R2", tags: ["two-pointers", "recognition"],
    prompt: "Which statement is the best fit for two pointers moving inward from both ends?",
    choices: ["Given a sorted array, find two values that add to a target using O(1) extra memory", "Count subarrays whose sum equals k, with negative values", "Group words made of the same letters", "Find the largest sum of a contiguous block"],
    answer: 0,
    explanation: "Sorted input plus a pair target plus a memory limit is the textbook case. The other three are prefix sums + hash map, hash grouping and Kadane.",
  },
  {
    id: "r2-tp-why-move", kind: "mcq", region: "R2", tags: ["two-pointers", "correctness"],
    prompt: "In the sorted pair-sum scan, a[l] + a[r] is smaller than the target. Which pointer moves and why?",
    choices: ["l moves right: a[l] with anything at or left of r is even smaller, so a[l] cannot be in an answer", "r moves left: it makes the sum smaller", "Both move: the pair is useless", "Neither: stop and report no pair"],
    answer: 0,
    explanation: "Because the array is sorted, a[r] is the largest value still available to pair with a[l]. If even that is too small, a[l] has no partner. Discarding it keeps the search space shrinking by one each step.",
  },
  {
    id: "r2-tp-sorted-pair", kind: "trace", region: "R2", tags: ["two-pointers", "trace"],
    prompt: "What does this program print (the number of loop iterations)?",
    code: `#include <iostream>
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
`,
    explanation: "The scan tests (1,15) too big, (1,11) too small, (2,11) too small, (4,11) = 15 found: four iterations. Each step either finds the pair or drops an element, so there are never more than n - 1 steps.",
  },
  {
    id: "r2-tp-compact", kind: "predict", region: "R2", tags: ["two-pointers", "in-place"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {3, 0, 3, 5, 0, 5};
    int write = 0;
    for (int read = 0; read < 6; ++read)
        if (a[read] != 0) a[write++] = a[read];
    std::cout << write << ' ' << a[0] << a[1] << a[2] << a[3] << '\\n';
}
`,
    explanation: "Four non-zero values are kept in order (3, 3, 5, 5), so write ends at 4 and the first four cells read 3355. The tail still holds old values; a real solution zero-fills it or just returns the length.",
  },
  {
    id: "r2-tp-compact-order", kind: "parsons", region: "R2", tags: ["two-pointers", "parsons"],
    prompt: "Order the lines so the program removes the zeros in place and prints the new length.",
    lines: [
      "#include <iostream>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> a = {0, 1, 0, 2, 3};",
      "    int write = 0;",
      "    for (int read = 0; read < 5; ++read) {",
      "        if (a[read] != 0) a[write++] = a[read];",
      "    }",
      "    std::cout << write << \"\\n\";",
      "}",
    ],
    explanation: "Initialise the write pointer before the loop, copy kept values forward as the read pointer scans, and print the count after the loop. Printing before the loop ends would show 0.",
  },
  {
    id: "r2-tp-dedupe-3sum", kind: "mcq", region: "R2", tags: ["two-pointers", "3sum"],
    prompt: "In 3Sum (sort, fix i, scan l and r), what stops the same trio from being reported twice?",
    choices: ["Skip equal values at i, and after a hit move l and r past equal neighbours", "Store every trio in a vector and rely on == to dedupe", "Use only one pointer", "Nothing: duplicates are impossible after sorting"],
    answer: 0,
    explanation: "Sorted equal values sit next to each other, so skipping them at the fixed index and after each hit removes duplicate trios in O(1) per skip. This keeps the total at O(n²) without a set of vectors.",
  },
  {
    id: "r2-tp-water-move", kind: "mcq", region: "R2", tags: ["two-pointers", "container-water"],
    prompt: "Container with most water: at each step you move one pointer. Which one, and why is it safe?",
    choices: ["The one at the shorter wall: the shorter wall limits every container it can still form, and width only shrinks", "The one at the taller wall: it shrinks the width faster", "Always the left one", "Whichever gives the larger next area, found by looking ahead"],
    answer: 0,
    explanation: "Area = width × min(heights). Keeping the shorter wall and moving the taller one only reduces width while the height limit stays at most the short wall, so no better container uses that short wall. Move it and continue.",
  },
  {
    id: "r2-tp-trap-cost", kind: "mcq", region: "R2", tags: ["two-pointers", "trapping-rain-water", "big-o"],
    prompt: "Trapping rain water with two pointers and a running maximum from each side: time and extra space?",
    choices: ["O(n) time, O(1) space", "O(n log n) time, O(n) space", "O(n²) time, O(1) space", "O(n) time, O(n) space"],
    answer: 0,
    explanation: "One pass moves the pointer on the side with the smaller maximum, and the water above that cell is that maximum minus its height. Two integers for the maxima are all the extra memory; the O(n)-space version stores prefix and suffix maxima arrays.",
  },
  {
    id: "r2-tp-dutch", kind: "trace", region: "R2", tags: ["two-pointers", "dutch-flag"],
    prompt: "What does this program print (the array after one pass of the three-pointer partition)?",
    code: `#include <iostream>
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
`,
    explanation: "Zeros are swapped toward the front, twos toward the back, ones are skipped. After the pass the array is sorted: 001122. When a 2 is swapped in from the end, i does not advance because the value that arrived has not been checked.",
  },
  {
    id: "r2-tp-boats", kind: "mcq", region: "R2", tags: ["two-pointers", "greedy"],
    prompt: "Boats carry at most two people and a weight limit. Sorted weights, lightest at l and heaviest at r. The pair does not fit. What do you do?",
    choices: ["Send the heaviest alone and move r left", "Send the lightest alone and move l right", "Move both pointers", "Swap them and retry"],
    answer: 0,
    explanation: "If the heaviest cannot ride with the lightest, it cannot ride with anyone, so it takes its own boat. If they do fit, pair them and move both. Each step uses one boat, giving O(n log n) with the sort.",
  },
  {
    id: "r2-tp-palindrome-skip", kind: "cloze", region: "R2", tags: ["two-pointers", "palindrome"],
    prompt: "Fill the blanks so it prints 1 when the string is a palindrome after ignoring non-letters.",
    template: `#include <cctype>
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
`,
    blanks: [["--r"], ["--r"]],
    explanation: "Move the pointer that sits on a junk character; when both point at letters, compare them case-insensitively and then step both inward. Casting to unsigned char keeps isalpha and tolower defined for every char value.",
  },
  {
    id: "r2-tp-sort-cost", kind: "mcq", region: "R2", tags: ["two-pointers", "big-o", "sorting"],
    prompt: "Unsorted input: sort the array, then run the two-pointer pair scan. What is the total time?",
    choices: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    answer: 0,
    explanation: "Sequential steps add and the larger one wins: the sort is O(n log n), the scan O(n). If you need the original indices of the pair, sorting loses them unless you sort indices instead, and a hash map is simpler.",
  },

  // ---- Prefix sums, difference arrays, Kadane
  {
    id: "r2-ps-signal", kind: "mcq", region: "R2", tags: ["prefix-sum", "recognition"],
    prompt: "An array never changes, and you must answer 10^5 queries, each asking for the sum between two positions. Which technique?",
    choices: ["Prefix sums: O(n) to build, O(1) per query", "Re-sum the range for each query: O(n) per query", "A sliding window", "A monotonic stack"],
    answer: 0,
    explanation: "Many range-sum queries on fixed data is the prefix-sum signal. Re-summing costs O(n·q) = 10^10 here, far over budget.",
  },
  {
    id: "r2-ps-build", kind: "predict", region: "R2", tags: ["prefix-sum"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {2, 5, 1, 4};
    std::vector<int> pre(a.size() + 1, 0);
    for (std::size_t i = 0; i < a.size(); ++i) pre[i + 1] = pre[i] + a[i];
    for (int x : pre) std::cout << x << ' ';
    std::cout << '\\n';
}
`,
    explanation: "pre[i] is the sum of the first i elements, so the table is 0, 2, 7, 8, 12 (the leading 0 is the empty prefix). Its length is n + 1, which is what makes the range formula uniform.",
  },
  {
    id: "r2-ps-range", kind: "cloze", region: "R2", tags: ["prefix-sum", "cloze"],
    prompt: "Fill the blanks so it prints the sum of a[1..3] (inclusive) using the prefix table.",
    template: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> a = {2, 5, 1, 4, 9};
    std::vector<int> pre = {0, 2, 7, 8, 12, 21};
    int l = 1, r = 3;
    std::cout << pre[___] - pre[___] << "\\n";
}
`,
    blanks: [["r + 1", "r+1", "4"], ["l", "1"]],
    explanation: "sum(a[l..r]) = pre[r + 1] - pre[l]. Here 12 - 2 = 10 = 5 + 1 + 4. Using pre[r] would drop the last element: the classic off-by-one.",
  },
  {
    id: "r2-ps-subk-seed", kind: "mcq", region: "R2", tags: ["prefix-sum", "subarray-sum-k"],
    prompt: "Counting subarrays with sum k via prefix sums and a map. Why is the map initialised with {0: 1}?",
    choices: ["So subarrays starting at index 0 are counted: they need the empty prefix 0", "To avoid a division by zero", "Because the map cannot be empty", "To count the empty subarray in the answer"],
    answer: 0,
    explanation: "A subarray a[0..i] has sum pre[i + 1] - 0, so it matches when pre[i + 1] - k equals the empty prefix. Without the seed, every subarray beginning at the front is missed and small tests may still pass.",
  },
  {
    id: "r2-ps-subk-trace", kind: "predict", region: "R2", tags: ["prefix-sum", "subarray-sum-k"],
    prompt: "What does this program print (the number of subarrays with sum 3)?",
    code: `#include <iostream>
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
`,
    explanation: "The qualifying subarrays are [1,2], [3], [1,2,3,-3], [3,-3,3] and the final [3]. The negative value shows why a sliding window fails here while prefix sums with counts still work.",
  },
  {
    id: "r2-ps-negatives", kind: "mcq", region: "R2", tags: ["prefix-sum", "sliding-window"],
    prompt: "'Count subarrays with sum exactly k', values may be negative. Why can a plain two-pointer window not solve it?",
    choices: ["Extending the window no longer always increases the sum, so you cannot decide which end to move", "Windows only work on sorted arrays", "Windows use too much memory", "Windows cannot count, only maximise"],
    answer: 0,
    explanation: "A window relies on monotonicity: add a positive value and the sum grows, drop one and it shrinks. Negatives break both. Prefix sums plus a hash map make no such assumption.",
  },
  {
    id: "r2-diff-array", kind: "predict", region: "R2", tags: ["difference-array"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> d(6, 0);
    d[1] += 4; d[4] -= 4;      // add 4 to cells 1..3
    d[2] += 1; d[5] -= 1;      // add 1 to cells 2..4
    int run = 0;
    for (int i = 0; i < 5; ++i) { run += d[i]; std::cout << run << ' '; }
    std::cout << '\\n';
}
`,
    explanation: "Each update marks where an increase starts and ends; the running sum turns the marks into cell values: 0 4 5 5 1. Cell 4 gets only the +1 because the +4 ended before it.",
  },
  {
    id: "r2-diff-order", kind: "parsons", region: "R2", tags: ["difference-array", "parsons"],
    prompt: "Order the lines so the program applies one range update (+7 on cells 1..2) and prints the rebuilt array.",
    lines: [
      "#include <iostream>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> d(5, 0);",
      "    d[1] += 7;",
      "    d[3] -= 7;",
      "    int run = 0;",
      "    for (int i = 0; i < 4; ++i) { run += d[i]; std::cout << run << ' '; }",
      "    std::cout << \"\\n\";",
      "}",
    ],
    explanation: "Apply all the point updates first, then rebuild with one running sum. The difference array is sized n + 1 so d[r + 1] is always a valid index, even for a range ending at the last cell.",
  },
  {
    id: "r2-kadane-restart", kind: "trace", region: "R2", tags: ["kadane", "trace"],
    prompt: "What does this program print?",
    code: `#include <algorithm>
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
`,
    explanation: "After the -5 the running sum (−3) is worse than starting fresh, so it restarts at 4, then grows to 3 and 5 at the next element. The best stretch is [4, -1, 2] with sum 5.",
  },
  {
    id: "r2-kadane-negative", kind: "mcq", region: "R2", tags: ["kadane", "edge-cases"],
    prompt: "Why must Kadane start with cur = best = a[0] rather than 0 when the stretch must be non-empty?",
    choices: ["With every value negative, starting at 0 would return 0, an empty stretch", "Starting at 0 is slower", "a[0] avoids integer overflow", "It changes nothing"],
    answer: 0,
    explanation: "For {-4, -2, -7} the correct answer is -2. A zero start never lets best go below 0, so it reports an empty stretch that is not allowed. Always test the all-negative case.",
  },
  {
    id: "r2-circular", kind: "mcq", region: "R2", tags: ["kadane", "circular"],
    prompt: "Best subarray sum on a circular array. Which two candidates do you compare?",
    choices: ["Plain Kadane maximum, and total sum minus the minimum stretch (with an all-negative guard)", "Plain Kadane on the array doubled twice", "The sum of the whole array, always", "Maximum prefix minus minimum prefix, nothing else"],
    answer: 0,
    explanation: "A circular best either does not wrap (ordinary Kadane) or wraps, in which case the unused middle is a minimum stretch, so the wrapped sum is total − minimum. If every value is negative the minimum stretch is the whole array and the wrap case would be empty, so return the plain Kadane answer.",
  },
  {
    id: "r2-ps-overflow", kind: "mcq", region: "R2", tags: ["prefix-sum", "overflow"],
    prompt: "n = 10^5 values, each up to 10^9, are summed into prefix sums. What type should the prefix table use?",
    choices: ["long long: the total can reach 10^14", "int: values fit in 32 bits", "unsigned int: the sums are non-negative", "float: it holds large numbers"],
    answer: 0,
    explanation: "Each value fits in an int but the sum can reach 10^14, far above 2.1·10^9. Signed overflow is undefined behaviour, so accumulate in long long and keep the table long long too.",
  },
];
