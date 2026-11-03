import type { Lesson } from "@/lib/lessons/types";

/** R0 Syntax Shores S3 "Arrays, vectors and strings" (CURRICULUM §2). Original wording. */
export const s3Lessons: Lesson[] = [
  {
    id: "s3-vectors", region: "R0", section: "S3",
    title: "Vectors and grids",
    summary: "Building vectors and 2D grids, what push_back, reserve, resize, insert and erase really cost, and looping without copies.",
    cardIds: ["s3-ctor-forms", "s3-reserve-resize", "s3-oob-index", "s3-size-unsigned", "s3-2d-init", "s3-erase-cost", "s3-auto-ref", "s3-const-auto-error"],
    problemIds: ["grid-turn", "run-squash"],
    pages: [
      {
        title: "Building vectors",
        blocks: [
          { kind: "text", text: "`std::vector<T>` is a growable array that owns its elements in one contiguous block. It is the default container for almost every interview problem: indexing is O(1), `push_back` is amortised O(1), and the memory layout is cache friendly. A fixed-size `std::array<int, 5>` has the same indexing but its length is part of the type and it never grows." },
          { kind: "code", run: true, caption: "Parentheses give a count, braces give the elements.", code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> a(3, 7);     // three elements, each 7
    std::vector<int> b{3, 7};     // two elements: 3 and 7
    std::vector<int> c(4);        // four zeros
    std::cout << a.size() << ' ' << b.size() << ' ' << c.size() << '\\n';
}
` },
          { kind: "pitfall", title: "(n) is not {n}", text: "`vector<int> v(5)` is five zeros; `vector<int> v{5}` is one element whose value is 5. Use parentheses for \"n copies of x\" and braces only for a literal list." },
          { kind: "text", text: "A grid is a vector of vectors. Build it with the row template as the second constructor argument, so every row is a separate vector of the right length. Indexing is `g[row][col]`, and the shape is `g.size()` by `g[0].size()` (check for an empty grid before touching `g[0]`)." },
          { kind: "code", run: true, caption: "An n by m grid of zeros, then a row-major fill.", code: `#include <iostream>
#include <vector>

int main() {
    int n = 2, m = 3;
    std::vector<std::vector<int>> g(n, std::vector<int>(m, 0));
    for (int r = 0; r < n; ++r)
        for (int c = 0; c < m; ++c)
            g[r][c] = r * m + c;
    std::cout << g[1][2] << ' ' << g.size() << 'x' << g[0].size() << '\\n';
}
` },
          { kind: "idiom", title: "Size first, then fill", text: "If you know the final length, either size the vector up front and assign by index, or call `reserve(n)` and then `push_back`. Both avoid repeated reallocation." },
          { kind: "interview", text: "Say the shape before you write the loops: \"the grid is n rows by m columns, so the result of a transpose is m by n\". Non-square inputs are where silent shape mix-ups hide." },
        ],
      },
      {
        title: "Costs and safe loops",
        blocks: [
          { kind: "text", text: "`reserve(n)` only sets aside capacity: the size stays 0 and indexing past the size is still undefined. `resize(n)` changes the size, creating value-initialised elements (zeros for `int`). `push_back` appends at the end, and when the capacity is full the vector moves everything to a bigger block, which is why the cost is O(1) amortised, not worst case." },
          { kind: "code", run: true, caption: "size() counts elements, not reserved room.", code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    v.reserve(100);
    std::cout << v.size() << ' ';
    v.resize(4);
    v.push_back(9);
    std::cout << v.size() << ' ' << v[3] << ' ' << v.back() << '\\n';
}
` },
          { kind: "text", text: "Anything that is not at the back is expensive. `insert` and `erase` in the middle or at the front shift every later element, so each call is O(n). Deleting many elements one at a time in a loop is therefore O(n^2); the standard fix is the erase-remove idiom (`v.erase(std::remove(...), v.end())`), which compacts the survivors in one O(n) pass." },
          { kind: "pitfall", title: "size() is unsigned", text: "`v.size()` returns an unsigned type. On an empty vector `v.size() - 1` wraps to a huge number, so `i < v.size() - 1` loops far out of bounds. Write `i + 1 < v.size()` instead." },
          { kind: "code", run: true, caption: "auto& edits the element; auto edits a copy; const auto& reads without copying.", code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v{1, 2, 3};
    for (auto x : v) x *= 10;        // changes a copy
    for (auto& x : v) x += 1;        // changes the element
    for (const auto& x : v) std::cout << x << ' ';
    std::cout << '\\n';
}
` },
          { kind: "idiom", title: "Range-for defaults", text: "Use `const auto&` to read, `auto&` to modify, and plain `auto` only for cheap values like `int`. With strings or vectors as elements, a plain `auto` silently copies every element." },
          { kind: "interview", text: "Mention the cost of a mutation as you choose it: \"erasing from the front is O(n) each, so I will compact in one pass\". Naming the complexity before the interviewer asks is a Problem Solving signal." },
        ],
      },
    ],
  },
  {
    id: "s3-strings", region: "R0", section: "S3",
    title: "Strings, characters and costs",
    summary: "Indexing, substr and its copying cost, find and npos, character arithmetic, and numbers to and from text.",
    cardIds: ["s3-substr-args", "s3-find-npos", "s3-char-arith", "s3-to-string-stoi", "s3-substr-tle"],
    problemIds: ["letter-tally", "overlap-count"],
    pages: [
      {
        title: "Indexing, substr and find",
        blocks: [
          { kind: "text", text: "`std::string` behaves like a `vector<char>` with text helpers: `s[i]` is O(1), `s.size()` is the length, and `s += x` appends. `s.substr(pos, len)` returns a new string holding a copy of up to `len` characters starting at `pos`; leave `len` out to take everything from `pos`. The copy costs time proportional to its length." },
          { kind: "code", run: true, caption: "substr copies; its second argument is a length, not an end index.", code: `#include <iostream>
#include <string>

int main() {
    std::string s = "algorithm";
    std::cout << s.substr(0, 4) << ' ' << s.substr(4) << ' ' << s.substr(3, 2) << '\\n';
}
` },
          { kind: "text", text: "`s.find(x)` returns the index of the first occurrence of a character or substring, or the special value `std::string::npos` when it is absent. `npos` is the largest `size_t`, so never compare the result with `-1` through an `int`. `find(x, from)` starts the search at `from`, which is how you walk through every occurrence." },
          { kind: "code", run: true, caption: "Find every occurrence by restarting just after the last hit.", code: `#include <iostream>
#include <string>

int main() {
    std::string s = "banana";
    std::size_t at = s.find("an");
    while (at != std::string::npos) {
        std::cout << at << ' ';
        at = s.find("an", at + 1);
    }
    std::cout << '\\n';
}
` },
          { kind: "pitfall", title: "substr in a loop", text: "Calling `s.substr(i)` on every iteration copies the rest of the string each time: O(n^2) for the whole loop. Compare in place with `s.compare(i, len, other)`, or keep indices instead of building new strings." },
          { kind: "interview", text: "Expect to be asked about the cost of string operations. \"Concatenating in a loop with `+=` is fine; building a new substring per position is quadratic\" is the answer they want to hear." },
        ],
      },
      {
        title: "Characters and numbers",
        blocks: [
          { kind: "text", text: "A `char` is a small integer, so arithmetic works on it. `c - 'a'` maps `'a'..'z'` to `0..25`, which is the standard way to index a 26-slot counting array. Adding to a letter and casting back (`char('a' + 2)`) goes the other way. Add a plain `'a' + 1` and you get the `int` 98, not a char." },
          { kind: "code", run: true, caption: "Counting letters with an array indexed by c - 'a'.", code: `#include <iostream>
#include <string>
#include <vector>

int main() {
    std::string s = "level";
    std::vector<int> count(26, 0);
    for (char c : s) ++count[c - 'a'];
    std::cout << count['l' - 'a'] << count['e' - 'a'] << count['v' - 'a'] << '\\n';
}
` },
          { kind: "text", text: "From `<cctype>`: `isdigit`, `isalpha` and `tolower` take and return `int`. Pass them an `unsigned char` (or a char you know is ASCII), because a negative value is undefined behaviour. For numbers use `std::to_string(n)` to produce text, and `std::stoi` or `std::stoll` to parse it; they throw on bad input, so only call them on text you have already validated." },
          { kind: "code", run: true, caption: "Numbers to text and back.", code: `#include <iostream>
#include <string>

int main() {
    std::string t = std::to_string(12) + std::to_string(30);
    long long n = std::stoll(t) + 1;
    std::cout << t << ' ' << n << '\\n';
}
` },
          { kind: "idiom", title: "Counting table", text: "For lowercase-only input, `vector<int> count(26)` beats a map: O(1) per character and no hashing. If the alphabet is unknown, use 256 slots indexed by `unsigned char`." },
          { kind: "interview", text: "Ask about the alphabet before choosing: \"lowercase letters only, or any ASCII?\". It changes the table size and shows you do not assume." },
        ],
      },
    ],
  },
  {
    id: "s3-splitting", region: "R0", section: "S3",
    title: "Splitting text",
    summary: "Cut a line into fields with find and substr, or with getline over a stringstream, and know what happens at the edges.",
    cardIds: ["s3-split-parsons", "s3-letter-count-cloze"],
    problemIds: ["field-split"],
    pages: [
      {
        title: "Fields from a line",
        blocks: [
          { kind: "text", text: "Splitting on a delimiter is a staple of parsing questions. The manual way keeps two indices: where the current field starts and where the next delimiter is. Cut a field out with `substr(start, end - start)`, then move `start` just past the delimiter." },
          { kind: "code", run: true, caption: "Manual split on commas; empty fields stay in.", code: `#include <iostream>
#include <string>
#include <vector>

int main() {
    std::string line = "ab,,c";
    std::vector<std::string> out;
    std::size_t start = 0;
    while (true) {
        std::size_t at = line.find(',', start);
        if (at == std::string::npos) { out.push_back(line.substr(start)); break; }
        out.push_back(line.substr(start, at - start));
        start = at + 1;
    }
    std::cout << out.size() << ' ' << '[' << out[1] << ']' << '\\n';
}
` },
          { kind: "text", text: "The shorter way is a `std::stringstream` with `getline(ss, part, ',')`, which reads up to each delimiter. It is neat, but it has one edge difference: it drops a final empty field, so \"a,b,\" gives two fields, not three. Decide which behaviour the problem wants before you pick the tool." },
          { kind: "code", run: true, caption: "getline splitting, and the dropped trailing field.", code: `#include <iostream>
#include <sstream>
#include <string>

int main() {
    std::stringstream ss("a,b,");
    std::string part;
    int fields = 0;
    while (std::getline(ss, part, ',')) ++fields;
    std::cout << fields << '\\n';
}
` },
          { kind: "pitfall", title: "Edge fields", text: "Always test the input that is empty, the input with no delimiter, a leading delimiter, doubled delimiters and a trailing delimiter. Each one exposes a different off-by-one in a hand-written split." },
          { kind: "interview", text: "State your edge-case policy first: \"I keep empty fields, so \\\"a,,b\\\" has three\". Then run the doubled and trailing cases through your loop out loud." },
        ],
      },
    ],
  },
];
