import type { Lesson } from "@/lib/lessons/types";

/** R4 Hashwood Harbor (CURRICULUM R4): hash table internals, key design, rolling hash. Original wording. */
export const r4Lessons: Lesson[] = [
  {
    id: "r4-hash-internals", region: "R4", section: "R4",
    title: "Inside the hash table: buckets, load and rehash",
    summary: "A hash map is an array of buckets plus a function that picks one. Knowing where it stays fast and where it quietly degrades is what lets you trust it in a loop.",
    cardIds: ["r4-hash-signal", "r4-hash-avg", "r4-hash-chain-trace", "r4-hash-load", "r4-hash-rehash", "r4-hash-openaddr", "r4-hash-subscript", "r4-hash-order", "r4-hash-pair-error", "r4-hash-anti", "r4-hash-set-cloze", "r4-hash-freq-parsons"],
    problemIds: ["locker-board", "drum-bag"],
    pages: [
      {
        title: "Buckets and chains",
        blocks: [
          { kind: "text", text: "A hash table keeps an array of buckets. To store a key, compute `hash(key) % bucketCount` and put the entry in that bucket. Two keys can land in the same bucket (a collision), so each bucket holds a small chain. A lookup hashes once, jumps to one bucket and walks its chain. If chains stay short, that is `O(1)` on average." },
          { kind: "code", run: true, caption: "A toy chained table with 4 buckets: key % 4 picks the bucket.", code: `#include <iostream>
#include <list>
#include <vector>

int main() {
    std::vector<std::list<int>> bucket(4);
    for (int key : {3, 7, 11, 2, 6}) bucket[key % 4].push_back(key);
    for (int b = 0; b < 4; ++b) {
        std::cout << b << ':';
        for (int key : bucket[b]) std::cout << ' ' << key;
        std::cout << '\\n';
    }
}
` },
          { kind: "text", text: "Bucket 3 holds three keys, so finding `11` walks three nodes. A good hash function spreads keys evenly; a bad one (or hostile input) piles them into one chain and a lookup becomes `O(n)`." },
          { kind: "idiom", title: "Say 'average' and 'worst'", text: "Hash map insert, find and erase are `O(1)` on average and `O(n)` in the worst case. In an interview say both, and say what the average rests on: a spread-out hash and a bounded load factor." },
          { kind: "interview", text: "When you reach for a map, name the job: 'I need to ask have-I-seen-this or what-is-its-count in constant time'. That is the signal that a hash map or set replaces a nested loop." },
        ],
      },
      {
        title: "Load factor, rehash and open addressing",
        blocks: [
          { kind: "text", text: "The load factor is `size / bucketCount`. When it passes a limit (`std::unordered_map` defaults to 1.0), the table allocates a bigger bucket array and re-inserts every entry: a rehash. One rehash costs `O(n)`, but growing by a constant factor makes the total over many inserts `O(n)`, so each insert is amortized `O(1)`." },
          { kind: "code", run: true, caption: "Doubling the buckets whenever size passes the bucket count: count the moves.", code: `#include <cstddef>
#include <iostream>

int main() {
    std::size_t buckets = 8, size = 0;
    long long moved = 0;
    int rehashes = 0;
    for (int i = 0; i < 1000; ++i) {
        ++size;
        if (size > buckets) {          // load factor passed 1.0
            moved += static_cast<long long>(size - 1);
            buckets *= 2;
            ++rehashes;
        }
    }
    std::cout << rehashes << " rehashes moved " << moved << " entries for 1000 inserts\\n";
}
` },
          { kind: "text", text: "The moved entries add up to less than twice the inserts: 8 + 16 + 32 + ... is a geometric series. Expensive single steps, cheap on average." },
          { kind: "text", text: "Open addressing is the other design. There are no chains: every entry lives in the array itself, and on a collision you probe the next slot (linear probing) until you find a free one. It is cache friendly, but it needs a lower load factor, and erasing leaves a tombstone so later probes do not stop early. `std::unordered_map` uses chaining; many hand-written tables (and the Locker Board exercise) are free to choose." },
          { kind: "pitfall", title: "A rehash invalidates iterators", text: "After an insert that triggers a rehash, iterators into the table are invalid (references to elements stay valid for `std::unordered_map`). Do not hold an iterator across inserts. If you know the size, call `reserve(n)` first to avoid rehashes." },
        ],
      },
      {
        title: "Using unordered_map and unordered_set well",
        blocks: [
          { kind: "code", run: true, caption: "operator[] inserts a default value; count and find do not.", code: `#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<int, int> m;
    if (m[5] == 0) std::cout << "zero ";
    std::cout << m.size() << ' ' << m.count(9) << ' ' << m.size() << '\\n';
}
` },
          { kind: "text", text: "Reading `m[5]` created the entry `5 -> 0`. Use `count` or `find` to test for presence, and `m[key]` when you want 'insert if missing, then use'. That is exactly what you want for `++freq[x]`." },
          { kind: "text", text: "Keys must be hashable. `int`, `long long`, `char`, `std::string` work out of the box; `std::pair` and `std::vector` do not. Supply a hash functor as the third template argument. Mix the bits well: the finaliser below (splitmix64) also protects against inputs built to collide." },
          { kind: "code", run: true, caption: "A pair key with a custom hash.", code: `#include <cstddef>
#include <cstdint>
#include <iostream>
#include <unordered_map>
#include <utility>

struct PairHash {
    std::size_t operator()(const std::pair<int, int>& p) const {
        std::uint64_t x = (static_cast<std::uint64_t>(static_cast<std::uint32_t>(p.first)) << 32)
                        | static_cast<std::uint32_t>(p.second);
        x += 0x9e3779b97f4a7c15ULL;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
        return static_cast<std::size_t>(x ^ (x >> 31));
    }
};

int main() {
    std::unordered_map<std::pair<int, int>, int, PairHash> seen;
    seen[{1, 2}] = 5;
    seen[{2, 1}] += 7;
    std::cout << seen.size() << ' ' << seen[{1, 2}] << ' ' << seen[{2, 1}] << '\\n';
}
` },
          { kind: "pitfall", title: "Iteration order is unspecified", text: "Never print or return the contents of an `unordered_map` in iteration order and expect the same order on another machine or compiler. Copy to a vector and sort, or use `std::map` when order is part of the answer." },
          { kind: "interview", text: "If asked why not an identity hash for `int`: an adversary can send keys that are all multiples of the bucket count and force one long chain. Mention a randomised or mixed hash and that you would not worry on a trusted judge. It shows you know the cost model, not just the API." },
        ],
      },
    ],
  },
  {
    id: "r4-key-design", region: "R4", section: "R4",
    title: "Designing keys: what should equal what?",
    summary: "Most hash-map problems are won or lost in the key. Choose a key so that two things are equal exactly when the problem says they are the same.",
    cardIds: ["r4-key-def", "r4-key-anagram", "r4-key-delim", "r4-key-delim-trace", "r4-key-cell-cloze", "r4-key-bijection", "r4-key-bijection-trace", "r4-key-prefix-predict", "r4-key-prefix-parsons", "r4-key-multi", "r4-key-ordered", "r4-key-const-error"],
    problemIds: ["twin-scripts", "verse-match", "brick-gap", "crate-variety"],
    pages: [
      {
        title: "Canonical forms: sorted and counted signatures",
        blocks: [
          { kind: "text", text: "Ask: what do two items have in common when the problem calls them 'the same'? Build a key from only that. Words that are rearrangements of each other share their sorted letters, so the sorted word is a canonical key. For long words with a small alphabet, a count array is faster than sorting." },
          { kind: "code", run: true, caption: "A sorted signature: rearrangements collapse to one key.", code: `#include <algorithm>
#include <iostream>
#include <string>

std::string signature(std::string w) {   // by value: we sort our own copy
    std::sort(w.begin(), w.end());
    return w;
}

int main() {
    std::string a = signature("listen"), b = signature("silent"), c = signature("enlist!");
    std::cout << a << ' ' << (a == b) << ' ' << (a == c) << '\\n';
}
` },
          { kind: "text", text: "When the signature is a list of numbers, turn it into a string with a **separator**. Plain concatenation merges different lists into the same text." },
          { kind: "code", run: true, caption: "Without a separator, {1, 11} and {11, 1} become the same key.", code: `#include <iostream>
#include <string>
#include <vector>

std::string bad(const std::vector<int>& v) {
    std::string s;
    for (int x : v) s += std::to_string(x);
    return s;
}

std::string good(const std::vector<int>& v) {
    std::string s;
    for (int x : v) s += std::to_string(x) + '#';   // '#' ends every number
    return s;
}

int main() {
    std::cout << (bad({1, 11}) == bad({11, 1})) << ' ' << (good({1, 11}) == good({11, 1})) << '\\n';
}
` },
          { kind: "pitfall", title: "Ambiguous encodings", text: "A key encoding must be injective: different inputs, different keys. Fixed width, a separator that cannot appear in the data, or a length prefix all work. 'Just glue them together' does not." },
          { kind: "interview", text: "State the key out loud and justify it: 'two words are anagrams exactly when their sorted forms match, so the sorted word is my key'. Then give the cost of building it, `O(L log L)` for length `L`, or `O(L + 26)` with counts." },
        ],
      },
      {
        title: "Pairs, cells and bijections",
        blocks: [
          { kind: "text", text: "A grid cell `(r, c)` becomes one integer `r * cols + c`. It is reversible: `r = id / cols`, `c = id % cols`. The multiplier must be the number of columns (the range of `c`); any smaller value makes different cells collide. A `long long` key lets you pack two 32-bit values. Fixed-width packing is faster than a `std::pair` with a custom hash." },
          { kind: "text", text: "Pattern matching problems ask for a **bijection**: each symbol maps to one symbol, and no two symbols share a target. One map checks the first half only (`ab` to `aa` passes it). Keep a second map in the other direction, or store the index of the last occurrence per symbol." },
          { kind: "code", run: true, caption: "Two maps give a two-way check.", code: `#include <iostream>
#include <string>
#include <unordered_map>

bool isomorphic(const std::string& s, const std::string& t) {
    if (s.size() != t.size()) return false;
    std::unordered_map<char, char> fwd, back;
    for (std::size_t i = 0; i < s.size(); ++i) {
        auto f = fwd.find(s[i]);
        auto b = back.find(t[i]);
        if (f == fwd.end() && b == back.end()) {      // both new: pair them up
            fwd[s[i]] = t[i];
            back[t[i]] = s[i];
        } else if (f == fwd.end() || b == back.end() || f->second != t[i]) {
            return false;                              // one side seen, the other not, or a mismatch
        }
    }
    return true;
}

int main() {
    std::cout << isomorphic("paper", "title") << isomorphic("badc", "baba") << isomorphic("ab", "aa") << '\\n';
}
` },
          { kind: "idiom", title: "Find, don't subscript, when absence matters", text: "`fwd.find(x)` tells you 'never seen' without inserting. `fwd[x]` would create an entry and make the next check lie." },
          { kind: "interview", text: "Word-pattern and isomorphic-string questions are the same bijection in different clothes. Say 'I need the mapping to be one-to-one in both directions' and you have shown the key insight." },
        ],
      },
      {
        title: "State in a map: prefix sums and counts",
        blocks: [
          { kind: "text", text: "A hash map can also hold running state for another pattern. For 'how many subarrays sum to `k`', let `sum` be the prefix total after each element. A subarray ending here sums to `k` when an earlier prefix equals `sum - k`. So keep a map from prefix value to how often it occurred, and add that count. This works with negatives, where a sliding window does not." },
          { kind: "code", run: true, caption: "Count subarrays with sum k: prefix value to number of times seen.", code: `#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {3, 4, -7, 1, 3, 3};
    const int k = 7;
    std::unordered_map<int, int> seen;
    seen[0] = 1;                       // the empty prefix
    int sum = 0;
    long long ways = 0;
    for (int x : a) {
        sum += x;
        auto it = seen.find(sum - k);
        if (it != seen.end()) ways += it->second;
        ++seen[sum];                   // record AFTER counting
    }
    std::cout << ways << '\\n';
}
` },
          { kind: "pitfall", title: "Seed the empty prefix", text: "Without `seen[0] = 1`, subarrays that start at index 0 are never counted. And record the current prefix after you look up `sum - k`, or `k = 0` counts an empty subarray." },
          { kind: "pitfall", title: "const maps and subscript", text: "`operator[]` may insert, so it does not compile on a `const` map. Use `find` or `at` in functions that take `const std::unordered_map<...>&`." },
          { kind: "idiom", title: "Pick the container by the question", text: "Need only equal/not equal and fast average time: `unordered_map`. Need keys in order, `lower_bound`, or a worst-case bound: `std::map` at `O(log n)`. Brick Wall is the first kind: count how many rows share each edge position." },
        ],
      },
    ],
  },
  {
    id: "r4-rolling-hash", region: "R4", section: "R4",
    title: "Rolling hash: fingerprints that slide",
    summary: "Turn a window of text into a number you can update in O(1). Compare numbers instead of strings, verify the rare match, and binary search on length for the hard problems.",
    cardIds: ["r4-rh-signal", "r4-rh-update", "r4-rh-collision", "r4-rh-cost", "r4-rh-negative", "r4-rh-overflow", "r4-rh-2bit-predict", "r4-rh-mask-cloze", "r4-rh-bsearch-why", "r4-rh-bsearch-trace", "r4-rh-bsearch-parsons", "r4-rh-anti", "r4-rh-words"],
    problemIds: ["echo-strand", "longest-echo", "word-chain-window"],
    pages: [
      {
        title: "A hash you can update in O(1)",
        blocks: [
          { kind: "text", text: "Comparing a pattern of length `m` against every window of a text costs `O(n·m)`. Give every window a fingerprint instead. Treat the window as a number in base `B`: `h = s[i]·B^(m-1) + ... + s[i+m-1]`, taken modulo a large prime. Sliding by one character is then `O(1)`: remove the leaving character's term, multiply by `B`, add the entering character." },
          { kind: "code", run: true, caption: "Rabin-Karp: count the starts of a pattern, verifying every fingerprint match.", code: `#include <iostream>
#include <string>

int main() {
    const long long MOD = 1'000'000'007, BASE = 131;
    std::string s = "ababa", p = "aba";
    const int n = static_cast<int>(s.size()), m = static_cast<int>(p.size());
    long long top = 1;                           // BASE^(m-1) mod MOD
    for (int i = 1; i < m; ++i) top = top * BASE % MOD;
    long long hp = 0, hw = 0;
    for (int i = 0; i < m; ++i) {
        hp = (hp * BASE + p[i]) % MOD;
        hw = (hw * BASE + s[i]) % MOD;
    }
    int found = 0;
    for (int i = 0; i + m <= n; ++i) {
        if (hw == hp && s.compare(i, m, p) == 0) ++found;   // verify: equal hashes may collide
        if (i + m < n) {
            hw = (hw - s[i] * top % MOD + MOD) % MOD;       // + MOD keeps it non-negative
            hw = (hw * BASE + s[i + m]) % MOD;
        }
    }
    std::cout << found << '\\n';
}
` },
          { kind: "pitfall", title: "Negative remainders", text: "In C++ `%` of a negative number is negative. After subtracting the leaving term, add `MOD` before taking `% MOD`, or the fingerprint of a valid window goes wrong." },
          { kind: "pitfall", title: "Overflow in the product", text: "With `MOD` near `10^9`, `hash * BASE` fits in `long long`. With a 61-bit modulus the product needs `__int128`. A modulus of `2^64` (unsigned overflow) looks free but can be broken by structured strings such as Thue-Morse sequences." },
          { kind: "interview", text: "Say the guarantee honestly: 'equal strings always have equal fingerprints; equal fingerprints are only probably equal strings, so I verify, or use two moduli and accept a tiny failure chance'." },
        ],
      },
      {
        title: "Exact keys: packing small alphabets",
        blocks: [
          { kind: "text", text: "When the alphabet is tiny and the window is short, you do not need a probabilistic hash at all. DNA letters need 2 bits each, so a 10-letter window is a 20-bit integer. Shift left by 2, OR in the new letter, and mask off the oldest bits. The key is exact: equal keys mean equal windows, no verification needed." },
          { kind: "code", run: true, caption: "Rolling 2-bit key of width k = 4: A=0, C=1, G=2, T=3.", code: `#include <iostream>
#include <string>

int code(char c) { return c == 'A' ? 0 : c == 'C' ? 1 : c == 'G' ? 2 : 3; }

int main() {
    std::string s = "ACGTAC";
    const int k = 4;
    const int mask = (1 << (2 * k)) - 1;      // keep the newest 2k bits
    int key = 0;
    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        key = ((key << 2) | code(s[i])) & mask;
        if (i >= k - 1) std::cout << key << ' ';
    }
    std::cout << '\\n';
}
` },
          { kind: "text", text: "A `std::unordered_map<int, int>` or `unordered_set<int>` of these keys finds repeated windows in `O(n)`. Compare that with storing every `substr` of length 10: the same time but 10× the memory and a heap allocation per window." },
          { kind: "idiom", title: "Mask from the width", text: "`(1 << (2 * k)) - 1` for 2-bit letters, `(1 << (5 * k)) - 1` for 5-bit letters. Use `long long` (and `1LL`) once `2k` or `5k` reaches 31 bits." },
        ],
      },
      {
        title: "Binary search on length, and hashing words",
        blocks: [
          { kind: "text", text: "To find the longest substring that appears twice, check a fixed length `L` with a rolling hash in `O(n)`. If some repeat has length `L`, trimming one letter gives a repeat of length `L-1`, so the question is monotone: binary search the largest `L` that passes. Total `O(n log n)`." },
          { kind: "code", run: true, caption: "Binary search on the repeat length (the check here is exact and simple; the real exercise swaps in a rolling hash).", code: `#include <iostream>
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
    int lo = 0, hi = static_cast<int>(s.size()) - 1;   // answer is in [lo, hi]
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;                   // round up so the range always shrinks
        if (hasRepeat(s, mid)) lo = mid; else hi = mid - 1;
    }
    std::cout << lo << '\\n';
}
` },
          { kind: "text", text: "Hashing also works above the character level. For 'find windows made of every given word exactly once', give each distinct word a small integer id, then run a count-based sliding window over the ids. Words of equal length `w` mean there are only `w` alignments to try, each a plain window over word-sized steps." },
          { kind: "pitfall", title: "Anti-hash tests", text: "One fixed base with one modulus can be attacked if tests are built against it. Use two moduli, or a random base chosen at run time, and verify candidate matches when the cost is acceptable." },
          { kind: "interview", text: "For a hard 'duplicate substring' prompt, outline: 'binary search on length, rolling hash to test a length in `O(n)`, verify or double-hash, total `O(n log n)`'. Then mention the suffix array as the alternative that avoids probability." },
        ],
      },
    ],
  },
];
