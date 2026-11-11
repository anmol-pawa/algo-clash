import type { Card } from "@/lib/cards/types";

/** R4 Hashwood Harbor cards. Predict, trace, parsons, cloze and compiler-error results are computed by g++ (content/cards/generated.json). */
export const r4Cards: Card[] = [
  // ---- Hash table internals
  {
    id: "r4-hash-signal", kind: "mcq", region: "R4", tags: ["hash-map", "recognition"],
    prompt: "Which need is the clearest sign that a hash map is the right tool?",
    choices: ["Have I seen this exact value (or its partner) before, in O(1)?", "Give me the k-th smallest value at any time", "Visit all values in sorted order", "Find the shortest path in a weighted graph"],
    answer: 0,
    explanation: "Hash maps answer exact-match questions: seen before, count of, index of, partner of. Order statistics and sorted traversal need a tree or heap, and shortest paths need a graph algorithm.",
  },
  {
    id: "r4-hash-cost", kind: "mcq", region: "R4", tags: ["hash-map", "big-o"],
    prompt: "What are the honest time bounds for one unordered_map lookup?",
    choices: ["O(1) on average, O(n) in the worst case when many keys collide", "O(log n) always", "O(1) always, collisions cannot happen", "O(n) on average, O(1) at best"],
    answer: 0,
    explanation: "With a good spread of hashes the chains are short and a lookup is O(1) on average. If everything lands in one bucket the chain has n entries. Say both when asked.",
  },
  {
    id: "r4-hash-chain-load", kind: "predict", region: "R4", tags: ["hash-map", "buckets"],
    prompt: "What does this program print?",
    code: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    for (int buckets : {6, 5}) {
        std::vector<int> load(buckets, 0);
        for (int i = 1; i <= 6; ++i) ++load[(i * 6) % buckets];
        std::cout << *std::max_element(load.begin(), load.end()) << ' ';
    }
    std::cout << '\\n';
}
`,
    explanation: "All keys are multiples of 6, so with 6 buckets they all land in bucket 0 (a chain of 6). With 5 buckets they spread (6,12,18,24,30 -> 1,2,3,4,0). Keys that share a factor with the bucket count pile up, which is why table sizes are chosen odd or prime.",
  },
  {
    id: "r4-hash-load-factor", kind: "mcq", region: "R4", tags: ["hash-map", "load-factor"],
    prompt: "What happens when an insert pushes size()/bucket_count() above max_load_factor()?",
    choices: ["The table allocates more buckets and re-places every entry (a rehash)", "The insert fails and returns false", "The oldest entry is evicted", "Nothing, chains just grow"],
    answer: 0,
    explanation: "Rehashing keeps chains short. It costs O(size) for that insert but is rare, which makes inserts O(1) amortised.",
  },
  {
    id: "r4-hash-rehash-cost", kind: "trace", region: "R4", tags: ["hash-map", "amortised"],
    prompt: "What does this program print?",
    code: `#include <iostream>

int main() {
    const int n = 100;
    int capacity = 1, size = 0;
    long long moved = 0;
    for (int i = 0; i < n; ++i) {
        if (size == capacity) {
            moved += size;
            capacity *= 2;
        }
        ++size;
    }
    std::cout << moved << '\\n';
}
`,
    explanation: "Doubling happens at sizes 1, 2, 4, ..., 64, moving 1 + 2 + ... + 64 = 127 entries in total: fewer than 2n. Total rehash work is O(n), so each insert is O(1) amortised.",
  },
  {
    id: "r4-hash-reserve", kind: "mcq", region: "R4", tags: ["hash-map", "reserve"],
    prompt: "You will insert about 200000 keys into an unordered_map. What does m.reserve(200000) buy you?",
    choices: ["No rehashes during the inserts", "Sorted iteration", "Guaranteed O(1) worst-case lookups", "Keys are stored in insertion order"],
    answer: 0,
    explanation: "reserve allocates enough buckets for that many entries up front. It does not change the worst case or the ordering; it removes the rehash spikes.",
  },
  {
    id: "r4-hash-subscript", kind: "predict", region: "R4", tags: ["hash-map", "operator-subscript"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<int, int> m;
    m[1] = 10;
    if (m[2] > 0) std::cout << "big ";
    std::cout << m.size() << ' ' << m.count(2) << ' ' << m.count(3) << '\\n';
}
`,
    explanation: "Reading m[2] inserts the key 2 with value 0, so size() is 2 and count(2) is 1. count(3) never inserts. Use count or find to ask a question without changing the map.",
  },
  {
    id: "r4-hash-const-error", kind: "compilerError", region: "R4", tags: ["hash-map", "const", "compiler-errors"],
    prompt: "This function does not compile. What is the cause?",
    code: `#include <unordered_map>

int lookup(const std::unordered_map<int, int>& m, int key) {
    return m[key];
}

int main() {
    std::unordered_map<int, int> m;
    return lookup(m, 1);
}
`,
    choices: ["operator[] may insert, so it is not available on a const map", "int cannot be a map key", "m must be passed by value", "lookup needs a trailing return type"],
    answer: 0,
    explanation: "A const map cannot be modified, and operator[] is allowed to insert. Use `m.at(key)` (throws if missing) or `find`.",
  },
  {
    id: "r4-hash-pair-error", kind: "compilerError", region: "R4", tags: ["hash-map", "pair", "compiler-errors"],
    prompt: "This declaration does not compile. What is the cause?",
    code: `#include <unordered_map>
#include <utility>

int main() {
    std::unordered_map<std::pair<int, int>, int> seen;
    seen[{1, 2}] = 1;
}
`,
    choices: ["std::hash has no specialisation for std::pair, so a hasher is required", "pair<int,int> cannot be copied", "The initialiser list {1, 2} is illegal in C++", "unordered_map needs a comparator as its third argument"],
    answer: 0,
    explanation: "The standard supplies hashes for integers, strings and pointers but not for pair, tuple or vector. Pack the pair into one integer key, or pass a custom hasher as the third template argument. `std::map<pair<int,int>, int>` also works because pair has operator<.",
  },
  {
    id: "r4-hash-erase-iter", kind: "mcq", region: "R4", tags: ["hash-map", "iterators"],
    prompt: "How do you erase every entry with value 0 while looping over an unordered_map?",
    choices: ["it = m.erase(it) when erasing, ++it otherwise", "Call m.erase(it) and then ++it in the for header", "Collect nothing, erase is not allowed inside loops", "Sort the map first"],
    answer: 0,
    explanation: "Erasing invalidates the iterator you erased. erase returns the next valid iterator; use it, and advance manually only when you did not erase.",
  },
  {
    id: "r4-hash-ref-valid", kind: "mcq", region: "R4", tags: ["hash-map", "iterator-invalidation"],
    prompt: "You hold `int& r = m[5];` and then insert many keys, which triggers a rehash. Is r still valid?",
    choices: ["Yes: rehash invalidates iterators but not references to elements", "No: every reference is invalidated by a rehash", "Only if you called reserve first", "Only for const references"],
    answer: 0,
    explanation: "unordered_map stores nodes that do not move on rehash, so pointers and references stay valid while iterators do not. (This is unlike vector, where growth moves everything.)",
  },
  {
    id: "r4-hash-anti", kind: "mcq", region: "R4", tags: ["hash-map", "anti-hash"],
    prompt: "Why do competitive programmers add a random seed and a mixing function (such as splitmix64) to a custom hash?",
    choices: ["So crafted inputs cannot force all keys into one bucket", "To make the hash reversible", "To keep iteration order sorted", "Because std::hash<int> does not compile"],
    answer: 0,
    explanation: "A predictable hash lets someone build keys that all collide and push every operation to O(n). A per-run random seed makes that impossible to prepare in advance.",
  },
  {
    id: "r4-hash-order", kind: "multi", region: "R4", tags: ["hash-map", "iteration-order"],
    prompt: "Select every statement that is true about std::unordered_map.",
    choices: ["Iteration order is unspecified and may change after inserts", "find does not create a missing key", "Iteration visits keys in insertion order", "operator[] creates a missing key with a default value", "It keeps its keys sorted"],
    answers: [0, 1, 3],
    explanation: "Order is unspecified, so never rely on it (and never print by iterating if the output must be stable: sort first). find only looks; operator[] creates. Sorted keys belong to std::map.",
  },
  {
    id: "r4-hash-map-vs-unordered", kind: "mcq", region: "R4", tags: ["hash-map", "map-vs-unordered"],
    prompt: "When is std::map the better choice than std::unordered_map?",
    choices: ["You need sorted iteration, lower_bound or a guaranteed O(log n) worst case", "You only need exact lookups and want the fastest average", "The keys are small integers", "You need to reserve capacity"],
    answer: 0,
    explanation: "A balanced tree gives order, nearest-key queries and a worst-case bound. If you only test exact membership, the hash map is usually faster.",
  },
  {
    id: "r4-hash-count-cloze", kind: "cloze", region: "R4", tags: ["hash-map", "frequency"],
    prompt: "Fill the blanks so the program prints the number of distinct values and how often 7 appears.",
    template: `#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {7, 3, 7, 1, 7, 3};
    std::unordered_map<int, int> freq;
    for (int x : a) ___freq[x];
    const auto it = freq.___(7);
    std::cout << freq.size() << ' ' << (it == freq.end() ? 0 : it->second) << "\\n";
}
`,
    blanks: [["++"], ["find"]],
    explanation: "`++freq[x]` creates the entry at 0 and increments it. `find(7)` looks without inserting, so `size()` stays the number of distinct values: 3 kinds, and 7 appears 3 times.",
  },

  // ---- Key design
  {
    id: "r4-key-anagram", kind: "mcq", region: "R4", tags: ["key-design", "anagram"],
    prompt: "Group words of length up to L that are anagrams of each other. Which key is correct, and cheapest for lowercase words?",
    choices: ["The 26 letter counts (as a string or array): O(L) per word", "The first letter of the word", "The length of the word", "The word's hash modulo 26"],
    answer: 0,
    explanation: "Anagrams share exactly the same counts, and counting is O(L). Sorting the letters is also correct but O(L log L). First letter or length merge unrelated words; a hash mod 26 collides constantly.",
  },
  {
    id: "r4-key-tuple", kind: "mcq", region: "R4", tags: ["key-design", "packing"],
    prompt: "A grid has rows 0..999 and columns 0..999. Which packing of (r, c) into one integer is NOT collision-free?",
    choices: ["r * 100 + c", "r * 1000 + c", "r * 1024 + c", "(r << 10) | c"],
    answer: 0,
    explanation: "The multiplier must exceed the largest c. With 100, the cells (0, 100) and (1, 0) both map to 100. Use 1000 or a bit shift of at least 10.",
  },
  {
    id: "r4-key-delimiter", kind: "mcq", region: "R4", tags: ["key-design", "encoding"],
    prompt: "You turn a vector<int> into a string key by concatenating the numbers. What goes wrong without a separator?",
    choices: ["{1, 12} and {11, 2} both become \"112\"", "The string is too long to hash", "Negative numbers are rejected", "Nothing, concatenation is injective"],
    answer: 0,
    explanation: "Concatenation is not injective: different sequences can spell the same text. Add a delimiter such as a comma, or use fixed-width fields, so equal keys mean equal sequences.",
  },
  {
    id: "r4-key-bijection", kind: "mcq", region: "R4", tags: ["key-design", "bijection"],
    prompt: "Strings s and t are 'isomorphic' if letters map one-to-one. Why is a single map s[i] -> t[i] not enough?",
    choices: ["\"ab\" and \"cc\" pass it, yet two letters share one partner", "Maps cannot store chars", "It is too slow", "It fails when the strings have equal length"],
    answer: 0,
    explanation: "A forward map only guarantees each source letter has one image. Different letters may still share an image, which a bijection forbids. Check the reverse map too (or check that images are unique).",
  },
  {
    id: "r4-key-bijection-predict", kind: "predict", region: "R4", tags: ["key-design", "bijection"],
    prompt: "What does this program print? (1 means the check says 'isomorphic')",
    code: `#include <iostream>
#include <string>
#include <unordered_map>

bool forwardOnly(const std::string& s, const std::string& t) {
    std::unordered_map<char, char> f;
    for (std::size_t i = 0; i < s.size(); ++i) {
        auto [it, fresh] = f.try_emplace(s[i], t[i]);
        if (!fresh && it->second != t[i]) return false;
    }
    return true;
}

int main() {
    std::cout << forwardOnly("egg", "add") << forwardOnly("foo", "bar") << forwardOnly("ab", "cc") << '\\n';
}
`,
    explanation: "\"egg\"/\"add\" is a true bijection (1). \"foo\"/\"bar\": 'o' would map to both 'a' and 'r', so 0. \"ab\"/\"cc\" passes the forward-only test (1) even though it is not a bijection: that is the bug the reverse map fixes.",
  },
  {
    id: "r4-key-prefix-parsons", kind: "parsons", region: "R4", tags: ["key-design", "prefix-sum", "parsons"],
    prompt: "Order the lines so the program counts the subarrays whose sum is 3.",
    lines: [
      "#include <iostream>",
      "#include <unordered_map>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> a = {1, 2, 3, -3, 3};",
      "    const int k = 3;",
      "    std::unordered_map<int, int> seen;",
      "    seen[0] = 1;",
      "    int prefix = 0, count = 0;",
      "    for (int x : a) {",
      "        prefix += x;",
      "        count += seen[prefix - k];",
      "        ++seen[prefix];",
      "    }",
      "    std::cout << count << \"\\n\";",
      "}",
    ],
    explanation: "Look up how many earlier prefixes equal `prefix - k` BEFORE recording the current prefix, so a subarray is never paired with an empty range of itself. `seen[0] = 1` counts subarrays that start at index 0.",
  },
  {
    id: "r4-key-prefix-init", kind: "mcq", region: "R4", tags: ["key-design", "prefix-sum"],
    prompt: "In the 'subarrays with sum k' pass, why do you start with seen[0] = 1?",
    choices: ["The empty prefix has sum 0, so subarrays that begin at index 0 are counted", "It prevents integer overflow", "It makes the map non-empty so find works", "It stores the answer"],
    answer: 0,
    explanation: "A subarray [i, j] has sum prefix[j] - prefix[i-1]. When i = 0 the subtracted prefix is the empty one, with sum 0. Without the seed those subarrays would be missed.",
  },
  {
    id: "r4-key-edge-gap", kind: "mcq", region: "R4", tags: ["key-design", "counting"],
    prompt: "Rows of bricks have joints at various x positions. A vertical line at x crosses a row unless it passes through that row's joint. How do you find the line that crosses the fewest rows?",
    choices: ["Count rows with a joint at each x (skip each row's final edge); answer = rows - max count", "Sort the rows by length", "Try every x and walk every row each time", "Use the row with the most bricks"],
    answer: 0,
    explanation: "The line through the most joints crosses the fewest rows. A hash map `edges[x]` counts joints; the right wall (each row's last edge) is skipped because a line there crosses nothing and would always win.",
  },
  {
    id: "r4-key-swap-last", kind: "mcq", region: "R4", tags: ["key-design", "swap-with-last"],
    prompt: "A vector plus a value->index map supports O(1) erase. What is the erase step?",
    choices: ["Move the last element into the removed slot, fix its index in the map, pop_back", "vector::erase at the index", "Mark the slot deleted and rebuild the vector later", "Sort the vector and drop the first element"],
    answer: 0,
    explanation: "vector::erase in the middle shifts everything: O(n). Overwriting the hole with the last element keeps the array dense and costs O(1). The map entry of the moved element must be updated to the hole's index.",
  },
  {
    id: "r4-key-swap-cloze", kind: "cloze", region: "R4", tags: ["key-design", "swap-with-last", "cloze"],
    prompt: "Fill the blanks so erasing 20 works and the program prints the moved element, the size and the map size.",
    template: `#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> items = {10, 20, 30, 40};
    std::unordered_map<int, int> where = {{10, 0}, {20, 1}, {30, 2}, {40, 3}};
    const int victim = 20;
    const int hole = where[victim];
    const int last = items.back();
    items[hole] = ___;
    where[___] = hole;
    items.pop_back();
    where.erase(victim);
    std::cout << items[hole] << ' ' << items.size() << ' ' << where.size() << "\\n";
}
`,
    blanks: [["last"], ["last"]],
    explanation: "The last value fills the hole and its recorded index becomes `hole`. Erasing the victim key afterwards is safe even if the victim was the last element; doing it before the reassignment would resurrect it.",
  },
  {
    id: "r4-key-distinct-window", kind: "mcq", region: "R4", tags: ["key-design", "window"],
    prompt: "A window keeps count[x] in an unordered_map and uses count.size() as 'kinds inside'. What must you do when a count drops to 0?",
    choices: ["Erase the entry, otherwise size() overcounts", "Nothing, zero entries are ignored by size()", "Rebuild the whole map", "Switch to std::map"],
    answer: 0,
    explanation: "size() counts entries, not positive entries. A leftover zero would make the window look like it holds a kind it no longer has. Erase at zero, or keep a separate `distinct` counter.",
  },
  {
    id: "r4-key-distinct-predict", kind: "predict", region: "R4", tags: ["key-design", "window", "pitfall"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <unordered_map>
#include <vector>

int main() {
    std::vector<int> a = {1, 2, 1, 3};
    std::unordered_map<int, int> keep, drop;
    for (int i = 0; i < 4; ++i) {
        ++keep[a[i]];
        ++drop[a[i]];
        if (i >= 2) {                       // window of size 2 slides: a[i-2] leaves
            if (--keep[a[i - 2]] == 0) keep.erase(a[i - 2]);
            --drop[a[i - 2]];
        }
    }
    std::cout << keep.size() << ' ' << drop.size() << '\\n';
}
`,
    explanation: "After the loop the window holds {1, 3}. The map that erases at zero reports 2 kinds. The other still contains key 2 with count 0, so it reports 3: a classic off-by-stale bug.",
  },
  {
    id: "r4-key-multi-signal", kind: "multi", region: "R4", tags: ["key-design", "recognition"],
    prompt: "Select every task a hash map of 'what I have seen' solves in one pass.",
    choices: ["Find two indices whose values sum to a target", "Longest substring with at most k distinct letters", "Count subarrays whose sum equals k", "Find the median of a stream", "Visit nodes of a weighted graph by shortest distance first"],
    answers: [0, 1, 2],
    explanation: "Complement lookup, window state and prefix counts are all 'remember what I have seen'. The streaming median needs two heaps, and shortest-first traversal needs a priority queue (Dijkstra).",
  },

  // ---- Rolling hash
  {
    id: "r4-roll-signal", kind: "mcq", region: "R4", tags: ["rolling-hash", "recognition"],
    prompt: "Which task is the classic fit for a rolling hash?",
    choices: ["Find a repeated substring of length k, or compare many long substrings", "Sort an array of integers", "Find the shortest path in an unweighted grid", "Merge two sorted lists"],
    answer: 0,
    explanation: "Substring equality is O(k) by comparison but O(1) with a hash that slides. 'Repeated block', 'pattern occurs in text' and 'longest duplicate substring' all share that cost.",
  },
  {
    id: "r4-roll-cost", kind: "mcq", region: "R4", tags: ["rolling-hash", "big-o"],
    prompt: "A text has n characters. What does hashing every window of length k cost with a rolling hash, versus recomputing each hash from scratch?",
    choices: ["O(n) versus O(n·k)", "O(n log n) versus O(n)", "O(k) versus O(n)", "Both O(n)"],
    answer: 0,
    explanation: "Each slide removes one digit and adds one: O(1) per window. Recomputing touches k characters per window.",
  },
  {
    id: "r4-roll-update", kind: "mcq", region: "R4", tags: ["rolling-hash", "formula"],
    prompt: "The window hash is s[i]·B^(k-1) + ... + s[i+k-1] (mod M). What is the hash after sliding to start at i+1?",
    choices: ["(h - s[i]·B^(k-1))·B + s[i+k]  (mod M)", "h·B + s[i+k]", "h - s[i] + s[i+k]", "h / B + s[i+k]"],
    answer: 0,
    explanation: "Remove the leading digit (its weight is B^(k-1)), shift everything left by multiplying by B, then add the new last digit. Division is avoided because inverses mod M are awkward.",
  },
  {
    id: "r4-roll-mod-neg", kind: "mcq", region: "R4", tags: ["rolling-hash", "modulo", "pitfall"],
    prompt: "After subtracting the leaving digit in a rolling hash the value can be negative. What is the fix?",
    choices: ["Add M before the final % M", "Take the absolute value", "Use unsigned char", "Ignore it, % M always returns a non-negative value in C++"],
    answer: 0,
    explanation: "In C++ the remainder takes the sign of the dividend, so (-3) % 7 is -3. Writing `(h - x + M) % M` keeps it in [0, M).",
  },
  {
    id: "r4-roll-mod-ll", kind: "mcq", region: "R4", tags: ["rolling-hash", "overflow"],
    prompt: "M = 1000000007 and both h and B are already below M. Which type holds h * B safely?",
    choices: ["long long (the product is below 10^18)", "int", "unsigned int", "float"],
    answer: 0,
    explanation: "The product of two residues below ~10^9 is below ~10^18, inside the 9.2·10^18 range of a 64-bit signed integer. In 32 bits it overflows. Reduce after every multiplication.",
  },
  {
    id: "r4-roll-verify", kind: "mcq", region: "R4", tags: ["rolling-hash", "collisions"],
    prompt: "Two windows have equal hashes. What can you conclude?",
    choices: ["They are probably equal; confirm by comparing characters, or use two moduli", "They are definitely equal", "They are definitely different", "Nothing, the hash is random"],
    answer: 0,
    explanation: "Equal strings give equal hashes, but not the other way round: collisions exist. A match is a candidate. Verifying costs O(k) and is rare on honest data; a second modulus makes a false match astronomically unlikely.",
  },
  {
    id: "r4-roll-dna-predict", kind: "predict", region: "R4", tags: ["rolling-hash", "bit-packing"],
    prompt: "What does this program print? (A=0, C=1, G=2, T=3, two bits per letter)",
    code: `#include <iostream>
#include <string>

int main() {
    const std::string s = "ACGT";
    int key = 0;
    for (char c : s) {
        const int code = c == 'A' ? 0 : c == 'C' ? 1 : c == 'G' ? 2 : 3;
        key = (key << 2) | code;
    }
    std::cout << key << '\\n';
}
`,
    explanation: "The digits in base 4 are 0, 1, 2, 3, which is 0·64 + 1·16 + 2·4 + 3 = 27 (binary 00011011). Two bits per letter packs a window of k letters exactly, with no collisions.",
  },
  {
    id: "r4-roll-dna-cloze", kind: "cloze", region: "R4", tags: ["rolling-hash", "bit-packing"],
    prompt: "Fill the blank: the mask keeps only the newest 3 letters (6 bits). The program prints the 3-letter keys.",
    template: `#include <iostream>
#include <string>

int main() {
    const std::string s = "ACGTAC";
    const int mask = ___;
    int key = 0;
    for (int i = 0; i < 6; ++i) {
        const char c = s[i];
        const int code = c == 'A' ? 0 : c == 'C' ? 1 : c == 'G' ? 2 : 3;
        key = ((key << 2) | code) & mask;
        if (i >= 2) std::cout << key << ' ';
    }
    std::cout << "\\n";
}
`,
    blanks: [["(1 << 6) - 1", "(1<<6)-1", "63", "0x3F", "0x3f", "(1 << (2 * 3)) - 1", "(1<<(2*3))-1"]],
    explanation: "Six bits set: `(1 << 6) - 1` = 63. Anding with it drops the oldest letter after each shift, so every key describes exactly the latest three letters.",
  },
  {
    id: "r4-roll-binsearch", kind: "mcq", region: "R4", tags: ["rolling-hash", "binary-search"],
    prompt: "Why can you binary-search the length L in 'longest substring that occurs twice'?",
    choices: ["If a repeat of length L exists, a repeat of length L-1 exists too (monotone)", "Substring lengths are always powers of two", "The hash is sorted", "Because the string is sorted"],
    answer: 0,
    explanation: "Chop one character off both copies of a length-L repeat and you get a length-(L-1) repeat. The predicate 'a repeat of length L exists' is therefore true up to the answer and false after, which is what binary search needs.",
  },
  {
    id: "r4-roll-binsearch-cost", kind: "mcq", region: "R4", tags: ["rolling-hash", "big-o"],
    prompt: "Binary search on length with an O(n) rolling-hash check per length. What is the expected total time?",
    choices: ["O(n log n)", "O(n)", "O(n²)", "O(n² log n)"],
    answer: 0,
    explanation: "About log n candidate lengths, each checked in O(n) with a hash set of window hashes (plus rare verifications). Comparing all pairs of positions would be O(n²) or worse.",
  },
  {
    id: "r4-roll-thue", kind: "mcq", region: "R4", tags: ["rolling-hash", "anti-hash"],
    prompt: "Why is a rolling hash that just lets unsigned 64-bit arithmetic overflow (mod 2^64) considered unsafe?",
    choices: ["Special strings (Thue–Morse) collide for every base", "Overflow is undefined behaviour for unsigned types", "It is slower than % M", "It cannot hash lowercase letters"],
    answer: 0,
    explanation: "Unsigned overflow is well defined, but a hash mod 2^64 has structured collisions: the Thue–Morse sequence gives two different strings with equal hashes whatever base you pick. Use a prime modulus, preferably two, or verify matches.",
  },
  {
    id: "r4-roll-words", kind: "mcq", region: "R4", tags: ["rolling-hash", "word-window"],
    prompt: "Find every start where a concatenation of given equal-length words occurs in a text. How do you slide?",
    choices: ["For each of the w alignments, slide over whole words with a count map", "Slide one character at a time and sort the window each step", "Hash the whole text once and compare", "Try every permutation of the words"],
    answer: 0,
    explanation: "Every candidate start belongs to one of the w alignments modulo the word length. Within one alignment the words are the symbols, so the count-map window pattern applies. Trying permutations is factorial.",
  },
];
