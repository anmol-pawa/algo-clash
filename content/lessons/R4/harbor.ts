import type { Lesson } from "@/lib/lessons/types";

/** R4 Hashwood Harbor (CURRICULUM R4): hash table internals, key design, rolling hash. Original wording. */
export const r4Lessons: Lesson[] = [
  {
    id: "r4-hash-internals", region: "R4", section: "R4",
    title: "Inside the hash table",
    summary: "Buckets, chains, load factor and rehashing explain both the O(1) promise and every way it breaks: bad keys, surprise inserts, invalidated iterators and hostile inputs.",
    cardIds: ["r4-hash-signal", "r4-hash-cost", "r4-hash-chain-load", "r4-hash-load-factor", "r4-hash-rehash-cost", "r4-hash-reserve", "r4-hash-subscript", "r4-hash-const-error", "r4-hash-pair-error", "r4-hash-erase-iter", "r4-hash-ref-valid", "r4-hash-anti", "r4-hash-order", "r4-hash-map-vs-unordered", "r4-hash-count-cloze"],
    problemIds: ["twin-scripts", "brick-gap", "locker-board"],
    pages: [
      {
        title: "Buckets, chains and the load factor",
        blocks: [
          { kind: "text", text: "A hash table is an array of buckets. To store a key, compute `hash(key)`, reduce it to a bucket number (usually `hash % bucketCount`), and put the entry there. Two keys can land in the same bucket; `std::unordered_map` keeps a short chain of entries per bucket (separate chaining). A lookup hashes the key, jumps to its bucket and walks the chain comparing keys with `==`. If chains stay short, that is `O(1)` on average." },
          { kind: "text", text: "The **load factor** is `size / bucketCount`, the average chain length. When an insert pushes it above `max_load_factor()` (1.0 by default), the table allocates more buckets and re-places every entry: a **rehash**, `O(size)` for that one insert. Because the bucket count roughly doubles each time, the total rehash work over `n` inserts is `O(n)`, so inserts are `O(1)` amortised, the same argument as `vector::push_back`." },
          { kind: "code", run: true, caption: "Why the bucket count and the keys must not share a pattern: eight multiples of 8.", code: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> keys;
    for (int i = 1; i <= 8; ++i) keys.push_back(i * 8);
    for (int buckets : {8, 7}) {
        std::vector<int> load(buckets, 0);
        for (int k : keys) ++load[k % buckets];
        std::cout << buckets << " buckets: longest chain "
                  << *std::max_element(load.begin(), load.end()) << '\\n';
    }
}
` },
          { kind: "code", run: true, caption: "Counting the work of doubling: each rehash moves every existing entry.", code: `#include <iostream>

int main() {
    const int n = 1000;
    int capacity = 1, size = 0;
    long long moved = 0;
    for (int i = 0; i < n; ++i) {
        if (size == capacity) {      // full: re-place everything into twice the buckets
            moved += size;
            capacity *= 2;
        }
        ++size;
    }
    std::cout << moved << " moves for " << n << " inserts\\n";
}
` },
          { kind: "idiom", title: "Reserve when you know the size", text: "`m.reserve(n)` allocates buckets for `n` entries up front, so the inserts never rehash. It does not change the complexity class, but it removes the rehash spikes and is a cheap habit when `n` is known." },
          { kind: "interview", text: "Say 'average O(1), worst case O(n) if everything collides' and name what makes the average hold: a good spread of hashes and a bounded load factor. Interviewers probe exactly this when you say 'hash map'." },
        ],
      },
      {
        title: "API traps that cost wrong answers",
        blocks: [
          { kind: "text", text: "Most hash-map bugs are not about hashing at all. They come from four habits of the standard container: `operator[]` creates, `find` does not; erasing while iterating needs care; iterators die on rehash while references survive; and iteration order is unspecified." },
          { kind: "code", run: true, caption: "operator[] inserts a default value; count and find leave the map alone.", code: `#include <iostream>
#include <string>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, int> stock;
    stock["apple"] = 3;
    std::cout << stock.count("pear") << ' ' << stock.size() << '\\n';
    int p = stock["pear"];                 // reading through [] creates "pear" -> 0
    std::cout << p << ' ' << stock.size() << '\\n';
    auto it = stock.find("plum");
    std::cout << (it == stock.end()) << ' ' << stock.size() << '\\n';
}
` },
          { kind: "pitfall", title: "Reading with [] grows the map", text: "Writing `if (m[k] > 0)` to test membership inserts `k` every time it is missing. That changes `size()`, can cost memory, and silently breaks any logic that uses `m.size()` as a count of distinct keys. Use `count(k)` or `find(k)` to ask, and `[]` only when you intend to create or update." },
          { kind: "code", run: false, caption: "Erase while iterating: use the iterator erase returns.", code: `for (auto it = m.begin(); it != m.end(); ) {
    if (it->second == 0) it = m.erase(it);   // erase returns the next valid iterator
    else ++it;
}` },
          { kind: "pitfall", title: "Rehash kills iterators, not references", text: "Inserting may rehash. After a rehash every iterator is invalid, but pointers and references to the stored elements stay valid (the elements are nodes that do not move). So do not keep an iterator across inserts; if you must keep access to a value, a reference is safe, an iterator is not." },
          { kind: "pitfall", title: "const maps and operator[]", text: "`operator[]` may insert, so it is not available on a `const` map. Take the map by `const&` and use `at(k)` (throws if missing) or `find(k)`." },
          { kind: "interview", text: "When you count frequencies say it in two lines: '`++freq[x]` creates the entry at zero and increments it'. For membership questions say 'I use find so I do not create keys'. It shows you know the difference." },
        ],
      },
      {
        title: "Custom hashes, hostile inputs and the ordered fallback",
        blocks: [
          { kind: "text", text: "`std::unordered_map` only knows how to hash types that have a `std::hash` specialisation: integers, strings, pointers. There is none for `std::pair`, `std::tuple` or `std::vector`. For those you either encode the key into an integer or string yourself (next lesson), or pass your own hasher as the third template argument." },
          { kind: "code", run: true, caption: "A hasher for pair<int,int>: pack the two ints, then scramble with splitmix64 and a per-run seed.", code: `#include <chrono>
#include <cstdint>
#include <iostream>
#include <unordered_map>
#include <utility>

struct PairHash {
    static std::uint64_t mix(std::uint64_t x) {        // splitmix64 finaliser
        x += 0x9e3779b97f4a7c15ULL;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
        return x ^ (x >> 31);
    }
    std::size_t operator()(const std::pair<int, int>& p) const {
        static const std::uint64_t seed =
            static_cast<std::uint64_t>(std::chrono::steady_clock::now().time_since_epoch().count());
        const std::uint64_t packed = (static_cast<std::uint64_t>(static_cast<std::uint32_t>(p.first)) << 32) |
                                     static_cast<std::uint32_t>(p.second);
        return static_cast<std::size_t>(mix(packed ^ seed));
    }
};

int main() {
    std::unordered_map<std::pair<int, int>, int, PairHash> hits;
    ++hits[{1, 2}];
    ++hits[{1, 2}];
    ++hits[{2, 1}];
    std::cout << hits[{1, 2}] << ' ' << hits[{2, 1}] << ' ' << hits.size() << '\\n';
}
` },
          { kind: "text", text: "Why bother with a seed? On sites that publish hack tests, someone can craft thousands of keys that all fall in one bucket of the default hash, turning every operation into `O(n)`. A random per-run seed makes such inputs useless. In an interview you rarely need it; say that you know the risk and that you would add it for adversarial input." },
          { kind: "idiom", title: "When to prefer std::map", text: "`std::map` is a balanced tree: `O(log n)` per operation, worst case guaranteed, sorted iteration, `lower_bound`, and any key with `operator<` works. Choose it when you need order, nearest-key queries or hash-free keys. Choose `unordered_map` when you only need exact lookups and speed." },
          { kind: "interview", text: "If asked 'can the hash map be slow?', give the three honest causes: adversarial or patterned keys, a huge load factor, and large keys (hashing a string costs `O(length)`, so a string lookup is not `O(1)` in the length)." },
        ],
      },
    ],
  },
  {
    id: "r4-key-design", region: "R4", section: "R4",
    title: "Designing the key",
    summary: "Most hash-map solutions are one decision: what exactly is the key, and what is stored with it? Signatures, packed pairs, two-way maps, prefix counts and swap-with-last bookkeeping.",
    cardIds: ["r4-key-anagram", "r4-key-tuple", "r4-key-delimiter", "r4-key-bijection", "r4-key-bijection-predict", "r4-key-prefix-parsons", "r4-key-prefix-init", "r4-key-edge-gap", "r4-key-swap-last", "r4-key-swap-cloze", "r4-key-distinct-window", "r4-key-distinct-predict", "r4-key-multi-signal"],
    problemIds: ["twin-scripts", "verse-match", "brick-gap", "crate-variety", "drum-bag"],
    pages: [
      {
        title: "Signatures and packed keys",
        blocks: [
          { kind: "text", text: "A hash map groups things that share a **key**. Your job is to choose a key that is equal exactly when two items belong together. For anagrams the key is the sorted letters (`O(k log k)` to build) or a 26-slot count array turned into a string (`O(k)`). For grid cells the key is the pair `(row, col)`, which you can pack into one integer." },
          { kind: "code", run: true, caption: "Pack (row, col) into one long long; the multiplier must exceed the largest col.", code: `#include <iostream>
#include <unordered_set>

long long cell(int row, int col) { return static_cast<long long>(row) * 1000003LL + col; }

int main() {
    std::unordered_set<long long> visited;
    visited.insert(cell(2, 5));
    visited.insert(cell(5, 2));
    std::cout << visited.count(cell(2, 5)) << visited.count(cell(2, 6)) << ' ' << visited.size() << '\\n';
}
` },
          { kind: "pitfall", title: "Encodings that collide", text: "Joining numbers into a string key needs a delimiter: `\"1\" + \"12\"` and `\"11\" + \"2\"` are both `\"112\"`. Packing two numbers needs a multiplier larger than the second one's range: `row * 100 + col` collides as soon as `col` can reach 100." },
          { kind: "interview", text: "State the key out loud with its equality rule: 'two strings are in the same group exactly when their letter counts match'. Then you can argue the map is correct before you write it." },
        ],
      },
      {
        title: "Two-way maps, prefix counts and edges",
        blocks: [
          { kind: "text", text: "**Bijection** (isomorphic strings, word pattern): one map `a -> b` only proves each `a` has one partner. `\"ab\"` and `\"cc\"` pass that test but `a` and `b` both map to `c`. Keep the reverse map `b -> a` as well, or check that images are unique." },
          { kind: "code", run: true, caption: "Forward-only versus two-way check on 'ab' and 'cc'.", code: `#include <iostream>
#include <string>
#include <unordered_map>

bool oneWay(const std::string& s, const std::string& t) {
    std::unordered_map<char, char> f;
    for (std::size_t i = 0; i < s.size(); ++i) {
        auto [it, fresh] = f.try_emplace(s[i], t[i]);
        if (!fresh && it->second != t[i]) return false;
    }
    return true;
}

bool twoWay(const std::string& s, const std::string& t) {
    std::unordered_map<char, char> f, g;
    for (std::size_t i = 0; i < s.size(); ++i) {
        auto [it, fresh] = f.try_emplace(s[i], t[i]);
        auto [jt, freshBack] = g.try_emplace(t[i], s[i]);
        if ((!fresh && it->second != t[i]) || (!freshBack && jt->second != s[i])) return false;
    }
    return true;
}

int main() { std::cout << oneWay("ab", "cc") << twoWay("ab", "cc") << '\\n'; }
` },
          { kind: "text", text: "**Prefix counts**: the number of subarrays with sum `k` is the number of pairs of prefixes with `prefix[j] - prefix[i] = k`. Walk left to right keeping a map `prefix value -> how many times seen`; at each step add `seen[prefix - k]`. Seed `seen[0] = 1` so a subarray that starts at index 0 is counted." },
          { kind: "code", run: true, caption: "Subarrays with sum k, in one pass.", code: `#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {1, 2, 3, -3, 3};
    const int k = 3;
    std::unordered_map<int, int> seen;
    seen[0] = 1;                       // the empty prefix
    long long prefix = 0, count = 0;
    for (int x : a) {
        prefix += x;
        auto it = seen.find(prefix - k);
        if (it != seen.end()) count += it->second;
        ++seen[prefix];
    }
    std::cout << count << '\\n';
}
` },
          { kind: "idiom", title: "Count the shared boundaries", text: "Brick-wall style questions ('which vertical line crosses the fewest rows?') flip the view: count how many rows have a joint at each position with `++edges[pos]`, skip the final edge of each row, and answer `rows - max(edges)`. Counting the thing you want to avoid crossing is the usual trick." },
          { kind: "pitfall", title: "Overflow in prefixes", text: "Prefix sums of `int` values need `long long` once there are many elements or large values. The map key type must be `long long` too, or the keys silently wrap." },
        ],
      },
      {
        title: "Map plus array, and maps as window state",
        blocks: [
          { kind: "text", text: "To support `insert`, `erase` and `pick by position` all in `O(1)`, store the values in a `vector` and keep an `unordered_map` from value to its index. Erase by **swapping with the last element**: copy the last value into the hole, update its index in the map, `pop_back`, then erase the removed key. Erasing the key last matters when the removed value is itself the last one." },
          { kind: "code", run: true, caption: "O(1) erase from a vector with a position map.", code: `#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> items = {10, 20, 30, 40};
    std::unordered_map<int, int> where = {{10, 0}, {20, 1}, {30, 2}, {40, 3}};
    const int victim = 20;
    const int hole = where[victim];
    const int last = items.back();
    items[hole] = last;               // move the last value into the hole
    where[last] = hole;               // tell the map where it lives now
    items.pop_back();
    where.erase(victim);              // erase the key last (victim may equal last)
    std::cout << items[hole] << ' ' << items.size() << ' ' << where.size() << '\\n';
}
` },
          { kind: "text", text: "A hash map also works as the **state of a window**: `count[x]` is how many times `x` is inside. For 'at most `k` distinct kinds', the number of distinct kinds is `count.size()`, but only if you `erase` an entry when its count reaches zero. A zero entry left behind still counts toward `size()`." },
          { kind: "pitfall", title: "Zero entries inflate size()", text: "After `--count[x]` reaches 0, call `count.erase(x)` if you read `count.size()` as 'kinds inside'. Otherwise either erase or track a separate `distinct` counter." },
          { kind: "interview", text: "Name the invariant of the map you keep: 'it holds exactly the letters inside the window with their counts, no zero entries'. Then the shrink loop and the answer update follow directly." },
        ],
      },
    ],
  },
  {
    id: "r4-rolling-hash", region: "R4", section: "R4",
    title: "Rolling hash: comparing substrings in O(1)",
    summary: "Turn a window of text into a number that updates in O(1) as the window slides, then check equality of long substrings cheaply, with the collision rules that keep it correct.",
    cardIds: ["r4-roll-signal", "r4-roll-cost", "r4-roll-update", "r4-roll-mod-neg", "r4-roll-mod-ll", "r4-roll-verify", "r4-roll-dna-predict", "r4-roll-dna-cloze", "r4-roll-binsearch", "r4-roll-binsearch-cost", "r4-roll-thue", "r4-roll-words"],
    problemIds: ["echo-strand", "longest-echo", "word-chain-window"],
    pages: [
      {
        title: "Polynomial hash and the O(1) slide",
        blocks: [
          { kind: "text", text: "Treat a string `s[i..i+k-1]` as digits in base `B`: `h = s[i]·B^(k-1) + ... + s[i+k-1]`, taken modulo a large prime `M`. When the window moves right by one, remove the leading digit, shift, and add the new one: `h = (h - s[i]·B^(k-1)) · B + s[i+k]`, all mod `M`. Precompute `B^(k-1) mod M` once. Every window's hash then costs `O(1)`, so scanning `n` windows is `O(n)` instead of `O(n·k)`." },
          { kind: "code", run: true, caption: "Hashes of all windows of length 3, compared with a direct recomputation.", code: `#include <iostream>
#include <string>

int main() {
    const std::string s = "abcabc";
    const int k = 3;
    const long long B = 131, M = 1000000007LL;
    long long top = 1;                                  // B^(k-1) mod M
    for (int i = 0; i < k - 1; ++i) top = top * B % M;
    long long h = 0;
    for (int i = 0; i < k; ++i) h = (h * B + s[i]) % M;
    std::cout << h;
    for (int i = k; i < static_cast<int>(s.size()); ++i) {
        h = (h - s[i - k] * top % M + M) % M;           // remove leaver; +M keeps it non-negative
        h = (h * B + s[i]) % M;                          // shift, add entering digit
        std::cout << ' ' << h;
    }
    std::cout << '\\n';
}
` },
          { kind: "pitfall", title: "Negative remainders and overflow", text: "In C++ `%` can return a negative number, so after a subtraction add `M` before the final `% M`. With `M ≈ 10^9` the product of two residues is below `10^18` and fits in `long long`, but only if the operands are already reduced; never multiply three terms before reducing." },
          { kind: "text", text: "Equal strings always have equal hashes, but equal hashes do not prove equal strings: two different windows can **collide**. Safe uses: (1) after a hash match, compare the actual characters (`O(k)`, rare on random data); (2) use two independent moduli or bases so a false match needs both to collide." },
          { kind: "interview", text: "Always say the collision story: 'a hash match is a candidate, so I verify it' or 'I use two moduli, so the false-match chance is about 10^-18 per pair'. Silence on collisions is the most common rolling-hash red flag." },
        ],
      },
      {
        title: "Small alphabets: pack the window into bits",
        blocks: [
          { kind: "text", text: "When the alphabet is tiny (DNA has four letters) you do not need a modulus at all. Give each letter 2 bits, and a window of length `k` is a `2k`-bit integer. Slide with a shift and a mask that throws the leaver away: `key = ((key << 2) | code) & mask`, where `mask = (1 << 2k) - 1`. For `k ≤ 30` the key fits in 60 bits, and **it is exact, not a hash**: different windows give different keys, so there is nothing to verify." },
          { kind: "code", run: true, caption: "Windows of 3 letters as 6-bit keys; the mask drops the oldest letter.", code: `#include <iostream>
#include <string>

int code(char c) { return c == 'A' ? 0 : c == 'C' ? 1 : c == 'G' ? 2 : 3; }

int main() {
    const std::string s = "ACGTAC";
    const int k = 3;
    const int mask = (1 << (2 * k)) - 1;
    int key = 0;
    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        key = ((key << 2) | code(s[i])) & mask;
        if (i >= k - 1) std::cout << key << ' ';
    }
    std::cout << '\\n';
}
` },
          { kind: "idiom", title: "Count with a map, report once", text: "To list every block that occurs at least twice, keep `unordered_map<key, int>` and add a block to the answer exactly when its count becomes 2, so a block seen five times is reported once." },
          { kind: "pitfall", title: "Shift width", text: "`1 << 40` on a 32-bit `int` is undefined behaviour. When `2k` can exceed 30, use `1LL << (2 * k)` and a `long long` key." },
        ],
      },
      {
        title: "Binary search on the answer and word-level windows",
        blocks: [
          { kind: "text", text: "**Longest repeated substring**: if some substring of length `L` occurs twice, its prefix of length `L-1` does too, so 'a repeat of length `L` exists' is monotone in `L`. Binary search `L`; for each candidate, slide a rolling hash across the string and look for a repeated hash (verifying matches). That is `O(n log n)` expected, against `O(n²)` for comparing all pairs." },
          { kind: "text", text: "**Words of equal length `w`**: to find where a concatenation of the given words starts, treat each word as a single symbol. For each of the `w` alignments, slide a window over words (not characters) with a count map, adding the entering word and removing the leaving one, exactly the variable-window pattern from the Woods. Each step costs `O(w)` to extract and look up the word, so the total is `O(n·w)` character work with plain strings." },
          { kind: "pitfall", title: "Natural overflow is not a safe modulus", text: "Letting an `unsigned long long` overflow (an implicit mod 2^64) is fast but breakable: the Thue–Morse string makes two different strings share a hash for any base. Prefer a prime modulus, ideally two, or verify every match." },
          { kind: "interview", text: "For 'longest duplicate substring' narrate three beats: monotone predicate, binary search on length, rolling hash with verification for the check. Then give `O(n log n)` expected time and name the alternative, a suffix array, as the deterministic option." },
        ],
      },
    ],
  },
];
