import type { Card } from "@/lib/cards/types";

/** R4 Hashwood Harbor cards. Predict, trace, parsons, cloze and compiler-error results are computed by g++ (content/cards/generated.json). */
export const r4Cards: Card[] = [
  // ---- Hash internals
  {
    id: "r4-hash-signal", kind: "mcq", region: "R4", tags: ["hash-map", "recognition"],
    prompt: "Which job is the clearest signal to reach for a hash map or hash set?",
    choices: ["Tell in O(1) whether a value was seen before, or how often", "Visit nodes of a graph level by level", "Find the k-th smallest value in a stream", "Reverse the order of a list in place"],
    answer: 0,
    explanation: "'Have I seen this? How many times?' is what a hash table is for: it turns a nested search into one lookup per item. Level order is BFS, k-th smallest is a heap or selection, reversal is two pointers.",
  },
  {
    id: "r4-hash-avg", kind: "mcq", region: "R4", tags: ["hash-map", "big-o"],
    prompt: "What does a hash map guarantee for find with a good hash function and bounded load factor?",
    choices: ["O(1) on average, O(n) in the worst case", "O(log n) always", "O(1) always, even for adversarial keys", "O(n) on average"],
    answer: 0,
    explanation: "Average cost is constant because chains stay short. The worst case is every key in one bucket, a single chain of length n. Say both in an interview.",
  },
  {
    id: "r4-hash-chain-trace", kind: "trace", region: "R4", tags: ["hash-map", "collisions", "trace"],
    prompt: "Keys go to bucket key % 5. What does this program print (the longest chain)?",
    code: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> chain(5, 0);
    for (int key : {10, 15, 20, 7, 12, 25, 3}) ++chain[key % 5];
    int longest = 0;
    for (int len : chain) longest = std::max(longest, len);
    std::cout << longest << '\\n';
}
`,
    explanation: "10, 15, 20 and 25 are multiples of 5, so all four land in bucket 0. A hash that ignores structure in the keys builds exactly this long chain.",
  },
  {
    id: "r4-hash-load", kind: "mcq", region: "R4", tags: ["hash-map", "load-factor"],
    prompt: "A chained table has 64 buckets and holds 96 entries. What is its load factor?",
    choices: ["1.5", "0.67", "96", "2.0"],
    answer: 0,
    explanation: "Load factor = entries / buckets = 96 / 64 = 1.5. Past the limit (1.0 by default in std::unordered_map) the table grows and rehashes.",
  },
  {
    id: "r4-hash-rehash", kind: "mcq", region: "R4", tags: ["hash-map", "amortized"],
    prompt: "Each rehash costs O(n). Why is insert still O(1) amortized?",
    choices: ["Doubling the bucket count makes the total rehash work a geometric series, under 2n for n inserts", "Rehash only happens on erase", "The rehash runs in a background thread", "The load factor never exceeds 0.5"],
    answer: 0,
    explanation: "Rehashes happen at sizes 8, 16, 32, ... and move that many entries, which sums to less than twice the final size. Growing by a constant factor is the key; growing by a fixed +10 would make it O(n²).",
  },
  {
    id: "r4-hash-openaddr", kind: "mcq", region: "R4", tags: ["hash-map", "open-addressing"],
    prompt: "In an open-addressing table with linear probing, why does erase leave a tombstone marker?",
    choices: ["A lookup stops at the first empty slot; clearing a slot in the middle of a probe run would hide later keys", "To make the table smaller", "Tombstones speed up insert only", "Because the key must be zeroed for security"],
    answer: 0,
    explanation: "Probing for key K walks from its home slot until it meets an empty slot. If an erase emptied a slot inside that run, keys placed after it would become unreachable, so the slot is marked 'deleted' instead.",
  },
  {
    id: "r4-hash-subscript", kind: "predict", region: "R4", tags: ["unordered_map", "operator[]"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<int, int> stock;
    stock[4] = 2;
    int a = stock[9];
    int b = static_cast<int>(stock.count(7));
    std::cout << stock.size() << ' ' << a << ' ' << b << '\\n';
}
`,
    explanation: "`stock[9]` inserts 9 with value 0, so the size is 2 and `a` is 0. `count(7)` only looks, so it returns 0 and inserts nothing.",
  },
  {
    id: "r4-hash-order", kind: "mcq", region: "R4", tags: ["unordered_map", "iteration-order"],
    prompt: "You must print the word counts in alphabetical order. What is safe?",
    choices: ["Copy the pairs to a vector and sort, or use std::map", "Iterate the unordered_map; it comes out sorted", "Iterate the unordered_map; it comes out in insertion order", "Reserve the right bucket count first"],
    answer: 0,
    explanation: "The iteration order of an unordered container is unspecified and can change after inserts. If order matters, sort the pairs or use an ordered map (O(log n) per operation).",
  },
  {
    id: "r4-hash-pair-error", kind: "compilerError", region: "R4", tags: ["unordered_map", "pair", "compiler-errors"],
    prompt: "This map of cell distances does not compile. What is the cause?",
    code: `#include <unordered_map>
#include <utility>

int main() {
    std::unordered_map<std::pair<int, int>, int> dist;
    dist[{0, 0}] = 1;
    return static_cast<int>(dist.size());
}
`,
    choices: ["std::pair has no std::hash, so the map needs a hash functor", "A map value cannot be int", "The braces in dist[{0, 0}] are not allowed", "unordered_map needs a comparison operator for pair"],
    answer: 0,
    explanation: "The standard library has no `std::hash<std::pair<...>>`. Pass your own hash as the third template argument, or pack the pair into one `long long`.",
  },
  {
    id: "r4-hash-anti", kind: "mcq", region: "R4", tags: ["hash-map", "anti-hash"],
    prompt: "Why might a contest solution use a custom mixed hash instead of the default for int keys?",
    choices: ["Test data can be built so many keys share a bucket, turning O(1) lookups into O(n)", "The default hash does not compile for int", "Mixed hashes use less memory", "The default hash is not deterministic within a run"],
    answer: 0,
    explanation: "With a predictable hash and bucket count, an adversary can send keys that all collide. A bit-mixing function (and a random seed) removes the pattern. On trusted interview inputs the default is fine, but know the reason.",
  },
  {
    id: "r4-hash-set-cloze", kind: "cloze", region: "R4", tags: ["unordered_set", "duplicates"],
    prompt: "Fill the blanks so it prints the first value that repeats.",
    template: `#include <iostream>
#include <unordered_set>
#include <vector>

int main() {
    std::vector<int> a = {2, 7, 4, 7, 2};
    std::unordered_set<int> seen;
    for (int x : a) {
        if (!seen.___(x).second) {
            std::cout << x << "\\n";
            ___;
        }
    }
}
`,
    blanks: [["insert"], ["break"]],
    explanation: "`insert` returns a pair whose `.second` is false when the value was already there. That one call both tests and records. `break` stops at the first repeat.",
  },
  {
    id: "r4-hash-freq-parsons", kind: "parsons", region: "R4", tags: ["unordered_map", "frequency", "parsons"],
    prompt: "Order the lines so the program prints how many times 'a' appears in banana.",
    lines: [
      "#include <iostream>",
      "#include <string>",
      "#include <unordered_map>",
      "int main() {",
      "    std::string s = \"banana\";",
      "    std::unordered_map<char, int> count;",
      "    for (char c : s) ++count[c];",
      "    std::cout << count['a'] << \"\\n\";",
      "}",
    ],
    explanation: "Declare the string and map, count with `++count[c]` (operator[] creates a zero first), then read the answer. The headers come first.",
  },

  // ---- Key design
  {
    id: "r4-key-def", kind: "mcq", region: "R4", tags: ["key-design", "recognition"],
    prompt: "What is the test for a good map key in a grouping problem?",
    choices: ["Two items have equal keys exactly when the problem calls them the same", "The key is as short as possible", "The key is always a string", "The key is the first element of the item"],
    answer: 0,
    explanation: "Equal keys must mean 'same group' in both directions. Too coarse a key merges groups that differ; too fine a key splits groups that should be together.",
  },
  {
    id: "r4-key-anagram", kind: "predict", region: "R4", tags: ["key-design", "anagram"],
    prompt: "What does this program print?",
    code: `#include <algorithm>
#include <iostream>
#include <string>

std::string signature(std::string w) {
    std::sort(w.begin(), w.end());
    return w;
}

int main() {
    std::string a = signature("listen"), b = signature("silent"), c = signature("enlist!");
    std::cout << a << ' ' << (a == b) << ' ' << (a == c) << '\\n';
}
`,
    explanation: "Sorting the letters gives `eilnst` for both rearrangements. The extra `!` makes the third signature `!eilnst`, so it differs. The cost is O(L log L) per word.",
  },
  {
    id: "r4-key-delim", kind: "mcq", region: "R4", tags: ["key-design", "encoding"],
    prompt: "You encode a list of ints as a string key by appending each number. What goes wrong without a separator?",
    choices: ["{1, 11} and {11, 1} both become \"111\" and collide", "The string is too long to hash", "Negative numbers become positive", "to_string stops working for numbers over 9"],
    answer: 0,
    explanation: "Plain concatenation is not injective. Append a delimiter after each number (such as '#'), use fixed width, or prefix lengths so two different lists never share a key.",
  },
  {
    id: "r4-key-delim-trace", kind: "trace", region: "R4", tags: ["key-design", "encoding", "trace"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <set>
#include <string>
#include <vector>

std::string glue(const std::vector<int>& v) {
    std::string s;
    for (int x : v) s += std::to_string(x);
    return s;
}

int main() {
    std::set<std::string> keys;
    keys.insert(glue({1, 11}));
    keys.insert(glue({11, 1}));
    keys.insert(glue({111}));
    std::cout << keys.size() << '\\n';
}
`,
    explanation: "All three lists glue to \"111\", so the set holds one key. Three different inputs, one key: this is the collision a separator prevents.",
  },
  {
    id: "r4-key-cell-cloze", kind: "cloze", region: "R4", tags: ["key-design", "grid"],
    prompt: "Fill the blanks to turn a grid cell into one integer id and back.",
    template: `#include <iostream>

int main() {
    const int cols = 5;
    int r = 2, c = 3;
    int id = r * ___ + c;
    int back = id / ___;
    std::cout << id << ' ' << back << "\\n";
}
`,
    blanks: [["cols"], ["cols"]],
    explanation: "Multiply the row by the number of columns, because `c` ranges over `0..cols-1`; dividing by `cols` recovers the row. Any other multiplier makes different cells collide.",
  },
  {
    id: "r4-key-bijection", kind: "mcq", region: "R4", tags: ["key-design", "bijection"],
    prompt: "Why is a single map letter-of-s to letter-of-t not enough to test isomorphic strings?",
    choices: ["\"ab\" and \"aa\" pass it, but two different letters cannot map to the same one", "A single map is slower", "Maps cannot hold chars", "It rejects strings of different length"],
    answer: 0,
    explanation: "The first map only proves each source letter has one target. The target side must also have one source: keep the reverse map (or the last index per letter).",
  },
  {
    id: "r4-key-bijection-trace", kind: "trace", region: "R4", tags: ["key-design", "bijection", "trace"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <string>
#include <unordered_map>

bool isomorphic(const std::string& s, const std::string& t) {
    if (s.size() != t.size()) return false;
    std::unordered_map<char, char> fwd, back;
    for (std::size_t i = 0; i < s.size(); ++i) {
        auto f = fwd.find(s[i]);
        auto b = back.find(t[i]);
        if (f == fwd.end() && b == back.end()) {
            fwd[s[i]] = t[i];
            back[t[i]] = s[i];
        } else if (f == fwd.end() || b == back.end() || f->second != t[i]) {
            return false;
        }
    }
    return true;
}

int main() {
    std::cout << isomorphic("paper", "title") << isomorphic("badc", "baba") << isomorphic("ab", "aa") << '\\n';
}
`,
    explanation: "'paper' to 'title' is a consistent two-way pairing. In 'badc' to 'baba', 'd' is new but 'b' is already the target of 'b', so it fails; 'ab' to 'aa' fails the same way.",
  },
  {
    id: "r4-key-prefix-predict", kind: "predict", region: "R4", tags: ["prefix-sum", "hash-map"],
    prompt: "What does this program print (subarrays with sum 7)?",
    code: `#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {3, 4, -7, 1, 3, 3};
    const int k = 7;
    std::unordered_map<int, int> seen;
    seen[0] = 1;
    int sum = 0;
    long long ways = 0;
    for (int x : a) {
        sum += x;
        auto it = seen.find(sum - k);
        if (it != seen.end()) ways += it->second;
        ++seen[sum];
    }
    std::cout << ways << '\\n';
}
`,
    explanation: "A subarray ending here sums to k when an earlier prefix equals `sum - k`. The map counts earlier prefixes by value, so it handles negatives and repeated prefixes.",
  },
  {
    id: "r4-key-prefix-parsons", kind: "parsons", region: "R4", tags: ["prefix-sum", "hash-map", "parsons"],
    prompt: "Order the lines so the program prints the number of subarrays of {1, 1, 1} with sum 2.",
    lines: [
      "#include <iostream>",
      "#include <unordered_map>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> a = {1, 1, 1};",
      "    std::unordered_map<int, int> seen;",
      "    seen[0] = 1;",
      "    int sum = 0, ways = 0;",
      "    for (int x : a) {",
      "        sum += x;",
      "        ways += seen[sum - 2];",
      "        ++seen[sum];",
      "    }",
      "    std::cout << ways << \"\\n\";",
      "}",
    ],
    explanation: "Seed the empty prefix, then per element: extend the sum, count matches for `sum - k` first, and only then record the new prefix. Counting after recording would mis-handle k = 0.",
  },
  {
    id: "r4-key-multi", kind: "multi", region: "R4", tags: ["unordered_map", "hashable-keys"],
    prompt: "Which key types work in std::unordered_map with no extra hash code?",
    choices: ["int", "std::string", "long long", "std::pair<int, int>", "std::vector<int>"],
    answers: [0, 1, 2],
    explanation: "The standard provides hashes for integers, chars, strings and pointers. Pairs, tuples and vectors have none: pack them into a string or integer, or pass a hash functor.",
  },
  {
    id: "r4-key-ordered", kind: "mcq", region: "R4", tags: ["map-vs-unordered"],
    prompt: "For each query you need the smallest stored key that is >= x. Which container fits?",
    choices: ["std::map (or std::set) with lower_bound, O(log n)", "std::unordered_map, O(1)", "std::unordered_set with find", "A plain vector scanned each time"],
    answer: 0,
    explanation: "Hash tables only answer exact-match questions. Order queries (lower_bound, predecessor, range) need a sorted structure; a hash table has no notion of 'next key'.",
  },
  {
    id: "r4-key-const-error", kind: "compilerError", region: "R4", tags: ["unordered_map", "const", "compiler-errors"],
    prompt: "This helper does not compile. What is the cause?",
    code: `#include <unordered_map>

int lookup(const std::unordered_map<int, int>& table, int key) {
    return table[key];
}

int main() {
    std::unordered_map<int, int> t = {{1, 2}};
    return lookup(t, 1);
}
`,
    choices: ["operator[] can insert, so it is not allowed on a const map; use find or at", "A map cannot be passed by reference", "The key must be a long long", "lookup must return a pointer"],
    answer: 0,
    explanation: "`operator[]` is not a const member because it may add an entry. In a function that only reads, call `table.at(key)` (throws if missing) or `find` and check for `end()`.",
  },

  // ---- Rolling hash
  {
    id: "r4-rh-signal", kind: "mcq", region: "R4", tags: ["rolling-hash", "recognition"],
    prompt: "Which prompt points to a rolling hash?",
    choices: ["Find every window of a long text that equals a pattern or another window", "Find the shortest path in a weighted graph", "Merge overlapping intervals", "Count paths in a grid"],
    answer: 0,
    explanation: "Many windows compared against each other or a pattern: fingerprint each window in O(1) and compare numbers. The others are Dijkstra, sorting, and DP.",
  },
  {
    id: "r4-rh-update", kind: "mcq", region: "R4", tags: ["rolling-hash", "update"],
    prompt: "With h = s[i]·B^(m-1) + ... + s[i+m-1] (mod M), how do you slide the window one step right?",
    choices: ["Subtract s[i]·B^(m-1), multiply by B, add s[i+m]", "Multiply by B and add s[i+m]; the old term vanishes by itself", "Recompute all m terms", "Add s[i+m] and subtract s[i] (no multiply)"],
    answer: 0,
    explanation: "The leaving character holds the highest power, so remove that term first; multiplying by B then shifts everyone one place up, and the entering character takes the units place. All mod M.",
  },
  {
    id: "r4-rh-collision", kind: "mcq", region: "R4", tags: ["rolling-hash", "collisions"],
    prompt: "Two windows have the same fingerprint. What do you know?",
    choices: ["They are probably equal; verify them, or use a second modulus, to be sure", "They are certainly equal", "They are certainly different", "Nothing; fingerprints are random"],
    answer: 0,
    explanation: "Equal strings always give equal fingerprints, but the reverse can fail (a collision). Compare the actual characters on a fingerprint match, which is rare, or double-hash.",
  },
  {
    id: "r4-rh-cost", kind: "mcq", region: "R4", tags: ["rolling-hash", "big-o"],
    prompt: "Rabin-Karp with verification on each fingerprint match: what is the time on text n and pattern m with a good hash?",
    choices: ["O(n + m) expected, O(n·m) worst case", "O(n log m)", "O(n·m) always", "O(m²)"],
    answer: 0,
    explanation: "Building the pattern hash is O(m), each slide is O(1), and a verification costs O(m) but rarely happens for a spread-out hash. If every window matches by hash, or the pattern really occurs everywhere, the worst case is O(n·m).",
  },
  {
    id: "r4-rh-negative", kind: "mcq", region: "R4", tags: ["rolling-hash", "pitfalls"],
    prompt: "After subtracting the leaving term from the hash, why do you add MOD before taking % MOD?",
    choices: ["In C++ a negative left operand gives a negative remainder", "To make the hash larger", "Because MOD is odd", "To avoid division by zero"],
    answer: 0,
    explanation: "`(a - b) % M` is negative when a < b. Writing `(a - b + M) % M` keeps the fingerprint in `[0, M)` so equal windows keep equal values.",
  },
  {
    id: "r4-rh-overflow", kind: "mcq", region: "R4", tags: ["rolling-hash", "overflow"],
    prompt: "With MOD = 1,000,000,007, which type should hold hash * BASE before the % ?",
    choices: ["long long", "int", "short", "float"],
    answer: 0,
    explanation: "The product can reach about 10^9 × 10^9 = 10^18, which fits in a signed 64-bit integer (up to 9.2·10^18) but overflows a 32-bit int. Keep all intermediate values in `long long`.",
  },
  {
    id: "r4-rh-2bit-predict", kind: "predict", region: "R4", tags: ["rolling-hash", "bit-packing"],
    prompt: "A=0, C=1, G=2, T=3, two bits each. What does this program print?",
    code: `#include <iostream>
#include <string>

int code(char c) { return c == 'A' ? 0 : c == 'C' ? 1 : c == 'G' ? 2 : 3; }

int main() {
    std::string s = "ACGTAC";
    const int k = 4;
    const int mask = (1 << (2 * k)) - 1;
    int key = 0;
    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        key = ((key << 2) | code(s[i])) & mask;
        if (i >= k - 1) std::cout << key << ' ';
    }
    std::cout << '\\n';
}
`,
    explanation: "ACGT is 00 01 10 11 in binary = 27; the next window CGTA is 01 10 11 00 = 108; GTAC is 10 11 00 01 = 177. The mask drops the oldest letter each step.",
  },
  {
    id: "r4-rh-mask-cloze", kind: "cloze", region: "R4", tags: ["rolling-hash", "bit-packing"],
    prompt: "Fill the blanks to keep only the newest k letters of the key (2 bits per letter).",
    template: `#include <iostream>
#include <string>

int main() {
    std::string s = "GATTACA";
    const int k = 3;
    const int mask = (1 << (2 * k)) - 1;
    int key = 0, last = 0;
    for (char ch : s) {
        int code = ch == 'A' ? 0 : ch == 'C' ? 1 : ch == 'G' ? 2 : 3;
        key = ((key << ___) | code) & ___;
        last = key;
    }
    std::cout << last << "\\n";
}
`,
    blanks: [["2"], ["mask"]],
    explanation: "Shift left by the bits per letter (2), OR in the new code, then AND with the mask to discard letters older than k. The last window, ACA, is 00 01 00 = 4.",
  },
  {
    id: "r4-rh-bsearch-why", kind: "mcq", region: "R4", tags: ["rolling-hash", "binary-search"],
    prompt: "Why can you binary search the length of the longest repeated substring?",
    choices: ["If a repeat of length L exists, trimming a letter gives a repeat of length L-1, so 'has a repeat' is monotone in L", "Because substrings are sorted", "Because the hash is monotone", "Because the string length is a power of two"],
    answer: 0,
    explanation: "Monotone yes/no answers are what binary search needs. Each probe checks one length in O(n) with a rolling hash, so the total is O(n log n) instead of trying every length.",
  },
  {
    id: "r4-rh-bsearch-trace", kind: "trace", region: "R4", tags: ["rolling-hash", "binary-search", "trace"],
    prompt: "What does this program print?",
    code: `#include <iostream>
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
    int lo = 0, hi = static_cast<int>(s.size()) - 1;
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;
        if (hasRepeat(s, mid)) lo = mid; else hi = mid - 1;
    }
    std::cout << lo << '\\n';
}
`,
    explanation: "'ana' occurs at 1 and 3, so length 3 works, while no length-4 substring repeats. Rounding mid up (+1) is required when the branch sets `lo = mid`, or the loop can stall.",
  },
  {
    id: "r4-rh-bsearch-parsons", kind: "parsons", region: "R4", tags: ["binary-search", "parsons"],
    prompt: "Order the lines: the largest value in [0, 9] for which ok(v) is true, where ok(v) means v * v <= 40.",
    lines: [
      "#include <iostream>",
      "int main() {",
      "    int lo = 0, hi = 9;",
      "    while (lo < hi) {",
      "        int mid = (lo + hi + 1) / 2;",
      "        if (mid * mid <= 40) lo = mid;",
      "        else hi = mid - 1;",
      "    }",
      "    std::cout << lo << \"\\n\";",
      "}",
    ],
    explanation: "The 'largest true' template: round mid up, move `lo = mid` on success and `hi = mid - 1` on failure. The answer is 6 since 6·6 = 36 and 7·7 = 49.",
  },
  {
    id: "r4-rh-anti", kind: "mcq", region: "R4", tags: ["rolling-hash", "anti-hash"],
    prompt: "A rolling hash uses unsigned 64-bit overflow (mod 2^64) with one fixed base. What is the danger?",
    choices: ["Structured strings such as Thue-Morse sequences can force collisions whatever the base", "It is slower than a prime modulus", "The result is always negative", "Overflow is a compile error"],
    answer: 0,
    explanation: "A power-of-two modulus has algebraic weaknesses: long Thue-Morse strings collide for every base. Use a large prime modulus (two of them, or a random base) and verify matches.",
  },
  {
    id: "r4-rh-words", kind: "mcq", region: "R4", tags: ["rolling-hash", "word-window"],
    prompt: "All words have equal length w. To find windows that are a concatenation of every word once, how many alignments must you try?",
    choices: ["w, one per starting offset 0..w-1, each a window over word-sized steps", "1; it is enough to start at 0", "n, one per start index in the text", "2^w"],
    answer: 0,
    explanation: "A valid window starts at some index; its words sit at that start modulo w. Slide a count-based window over words for each of the w offsets: total about O(n) word checks per offset, using word ids instead of rehashing strings.",
  },
];
