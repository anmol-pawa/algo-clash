import type { Card } from "@/lib/cards/types";

/** R0 Syntax Shores S3 "Arrays, vectors and strings" cards (B7c). Outputs and diagnostics are computed by g++ (see lib/content/cardsNative.ts). */
export const s3Cards: Card[] = [
  {
    id: "s3-ctor-forms", kind: "predict", region: "R0", tags: ["vector", "constructors"],
    prompt: "What does this program print? Four numbers on one line.",
    code: `#include <iostream>
#include <vector>
int main() {
    std::vector<int> a(5);
    std::vector<int> b{5};
    std::vector<int> c(2, 9);
    std::cout << a.size() << ' ' << b.size() << ' ' << b[0] << ' ' << c[1] << "\\n";
}
`,
    explanation: "Parentheses call the count constructor: `a(5)` is five zeros and `c(2, 9)` is two nines. Braces are a literal element list, so `b{5}` is a single element whose value is 5. Reach for parentheses for \"n copies\" and braces only for explicit values.",
  },
  {
    id: "s3-reserve-resize", kind: "predict", region: "R0", tags: ["vector", "reserve", "resize"],
    prompt: "What does this program print? Two lines.",
    code: `#include <iostream>
#include <vector>
int main() {
    std::vector<int> v;
    v.reserve(50);
    std::cout << v.size() << "\\n";
    v.resize(3);
    v.push_back(4);
    std::cout << v.size() << ' ' << v[0] << ' ' << v[3] << "\\n";
}
`,
    explanation: "`reserve` only prepares capacity; the size is still 0, and writing `v[0]` at that point would be undefined behaviour. `resize(3)` creates three value-initialised elements (zeros), and `push_back(4)` then appends a fourth, so the size is 4 with v[0] = 0 and v[3] = 4.",
  },
  {
    id: "s3-oob-index", kind: "multi", region: "R0", tags: ["vector", "at", "undefined-behaviour"],
    prompt: "Select every true statement about indexing a `vector<int> v` with an index `i >= v.size()`.",
    choices: [
      "`v[i]` is undefined behaviour: no check is made",
      "`v.at(i)` throws `std::out_of_range`",
      "`v[i]` grows the vector so that index i exists",
      "`v[i]` always throws an exception when i is out of range",
    ],
    answers: [0, 1],
    explanation: "`operator[]` trusts you: out of range it reads or writes memory that is not yours, which may crash, may silently corrupt data, or may appear to work. `at` checks the bound and throws. Unlike `map::operator[]`, a vector never grows on indexing; use `push_back` or `resize`.",
  },
  {
    id: "s3-size-unsigned", kind: "mcq", region: "R0", tags: ["vector", "size", "unsigned", "off-by-one"],
    prompt: "`v` is an empty `vector<int>`. What does `for (size_t i = 0; i < v.size() - 1; ++i) use(v[i]);` do?",
    choices: [
      "`v.size() - 1` wraps around to a huge unsigned number, so the loop runs far past the end of the vector",
      "It does nothing, because 0 - 1 is -1 and 0 < -1 is false",
      "It does not compile, because size() cannot be subtracted from",
      "It throws `std::out_of_range` on the first iteration",
    ],
    answer: 0,
    explanation: "`size()` is unsigned, so on an empty vector `size() - 1` is 2^64 - 1, and the loop condition stays true until it crashes. Rewrite the condition as `i + 1 < v.size()`, which never subtracts, or guard against empty input first.",
  },
  {
    id: "s3-2d-init", kind: "mcq", region: "R0", tags: ["vector", "2d", "grid"],
    prompt: "Which line creates an `n` by `m` grid of zeros that you can index as `g[r][c]` straight away?",
    choices: [
      "`vector<vector<int>> g(n, vector<int>(m, 0));`",
      "`vector<vector<int>> g(n);`",
      "`vector<int> g(n * m);`",
      "`vector<vector<int>> g; g.reserve(n);`",
    ],
    answer: 0,
    explanation: "The second constructor argument is the row that is copied n times, so every row exists and has m zeros. `g(n)` makes n empty rows, so `g[r][c]` is out of range. A flat `vector<int>` is indexed `g[r * m + c]`, not `g[r][c]`. `reserve` leaves the size at 0.",
  },
  {
    id: "s3-erase-cost", kind: "mcq", region: "R0", tags: ["vector", "erase", "complexity"],
    prompt: "A loop removes every zero from a vector of n integers by calling `v.erase(v.begin() + i)` on each zero it finds. What is the worst-case total cost?",
    choices: [
      "O(n^2), because each erase shifts every later element left",
      "O(n), because erase is constant time",
      "O(n log n), because erase rebalances the vector",
      "O(1), because only the zeros are touched",
    ],
    answer: 0,
    explanation: "Erasing from the middle of a vector moves all the elements after it, which is O(n) per call, so removing up to n/2 zeros costs O(n^2). The erase-remove idiom, `v.erase(remove(v.begin(), v.end(), 0), v.end())`, compacts the survivors in one pass and erases the tail once: O(n).",
  },
  {
    id: "s3-auto-ref", kind: "predict", region: "R0", tags: ["range-for", "auto", "references"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <vector>
int main() {
    std::vector<int> v{1, 2, 3};
    for (auto x : v) x += 5;
    for (auto& y : v) y *= 2;
    for (const auto& z : v) std::cout << z << ' ';
    std::cout << "\\n";
}
`,
    explanation: "The first loop's `auto x` is a copy, so adding 5 changes nothing in the vector. The second loop's `auto& y` is a reference to each element, so doubling it changes the vector to 2 4 6. The third only reads, so `const auto&` avoids a copy.",
  },
  {
    id: "s3-const-auto-error", kind: "compilerError", region: "R0", tags: ["range-for", "const", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `#include <vector>
int main() {
    std::vector<int> v{1, 2, 3};
    for (const auto& x : v) {
        x += 1;
    }
}
`,
    choices: [
      "`x` is a reference to const, so the loop body may not modify it; use `auto&` to edit elements",
      "A range-for cannot iterate a vector of ints",
      "`+=` is not defined for int",
      "`x` must be declared before the loop",
    ],
    answer: 0,
    explanation: "`const auto&` promises read-only access and the compiler enforces it. If the loop should change the elements, write `auto&`; if it only reads, keep `const auto&`, which is also the cheapest form for large element types.",
  },
  {
    id: "s3-substr-args", kind: "predict", region: "R0", tags: ["string", "substr"],
    prompt: "What does this program print? Four parts separated by `|`.",
    code: `#include <iostream>
#include <string>
int main() {
    std::string s = "interview";
    std::cout << s.substr(2, 3) << '|' << s.substr(5) << '|' << s.substr(0, 0) << '|' << s.substr(6, 100) << "\\n";
}
`,
    explanation: "The second argument of `substr` is a length, not an end index: `substr(2, 3)` takes three characters from index 2 (\"ter\"). Leaving it out takes everything from the start position (\"view\"). A length of 0 gives an empty string, and a length that is too large is clipped to the end (\"iew\"). Only a start position past the end throws.",
  },
  {
    id: "s3-find-npos", kind: "predict", region: "R0", tags: ["string", "find", "npos"],
    prompt: "What does this program print? Three values on one line.",
    code: `#include <iostream>
#include <string>
int main() {
    std::string s = "mississippi";
    std::cout << s.find("ss") << ' ' << s.find('s', 4) << ' ' << (s.find('z') == std::string::npos) << "\\n";
}
`,
    explanation: "`find(\"ss\")` returns the first index where the pattern starts (2). `find('s', 4)` starts looking at index 4, so it skips the first two s characters and finds the one at index 5. A missing character returns `npos`, and the comparison prints 1. Never test the result against -1 through an `int`; compare with `npos`.",
  },
  {
    id: "s3-char-arith", kind: "trace", region: "R0", tags: ["string", "char", "arithmetic"],
    prompt: "Trace the character arithmetic. What is printed?",
    code: `#include <iostream>
int main() {
    char c = 'a';
    c += 3;
    std::cout << c << ' ' << ('z' - c) << ' ' << char(c + 1) << ' ' << c + 1 << "\\n";
}
`,
    explanation: "`c += 3` moves 'a' to 'd'. `'z' - c` is integer arithmetic on the character codes, 122 - 100 = 22. `char(c + 1)` casts back to a character ('e'), while the bare `c + 1` is promoted to an `int` and prints its code, 101. Cast back to `char` whenever you want a letter.",
  },
  {
    id: "s3-to-string-stoi", kind: "predict", region: "R0", tags: ["string", "to_string", "stoi"],
    prompt: "What does this program print?",
    code: `#include <iostream>
#include <string>
int main() {
    std::string s = std::to_string(7) + std::to_string(8);
    int n = std::stoi(s) + 1;
    std::cout << s.size() << ' ' << n << "\\n";
}
`,
    explanation: "`to_string` produces text, so the `+` concatenates \"7\" and \"8\" into \"78\" (length 2) instead of adding. `stoi` parses it back to the integer 78, and adding 1 gives 79. Use `stoll` when the value can exceed 32 bits, and remember both throw on text that is not a number.",
  },
  {
    id: "s3-substr-tle", kind: "mcq", region: "R0", tags: ["string", "substr", "performance"],
    prompt: "A loop over a 200,000-character string calls `s.substr(i)` once per position `i` just to compare the suffix, and times out. What is the cause?",
    choices: [
      "Each `substr(i)` copies the rest of the string, so the loop copies O(n^2) characters in total",
      "`substr` runs a regular expression engine internally",
      "A string can only be indexed once per loop",
      "`substr` modifies the original string and forces a reallocation",
    ],
    answer: 0,
    explanation: "`substr` returns a brand-new string, so every call allocates and copies up to n characters: about n^2 / 2 copies for the loop. Compare in place with `s.compare(i, len, pat)`, walk indices manually, or use `find` with a start position, which does not copy anything.",
  },
  {
    id: "s3-letter-count-cloze", kind: "cloze", region: "R0", tags: ["string", "counting", "cloze"],
    prompt: "Fill the blank so the loop counts each lowercase letter into its slot.",
    template: `#include <iostream>
#include <string>
#include <vector>
int main() {
    std::string s = "banana";
    std::vector<int> cnt(26, 0);
    for (char c : s) ++cnt[___];
    std::cout << cnt['a' - 'a'] << cnt['n' - 'a'] << "\\n";
}
`,
    blanks: [["c - 'a'", "c-'a'"]],
    explanation: "Subtracting 'a' turns the letter's code into a slot number: 'a' maps to 0, 'b' to 1 and 'z' to 25. This needs lowercase-only input; with other characters the index would leave 0..25, so ask about the alphabet first. In \"banana\" the letter a appears three times and n twice, so it prints 32.",
  },
  {
    id: "s3-split-parsons", kind: "parsons", region: "R0", tags: ["string", "split", "stringstream", "parsons"],
    prompt: "Put the lines in order so the program prints the length of each comma-separated colour name.",
    lines: [
      "#include <iostream>",
      "#include <sstream>",
      "#include <string>",
      "int main() {",
      "    std::stringstream ss(\"red,green,blue\");",
      "    std::string part;",
      "    while (std::getline(ss, part, ',')) {",
      "        std::cout << part.size() << \" \";",
      "    }",
      "    std::cout << \"\\n\";",
      "}",
    ],
    explanation: "The stream and the string it reads into are declared first. `getline(ss, part, ',')` reads up to each comma and returns false at the end of the stream, which ends the loop; the body prints the length of each field. The program prints 3 5 4.",
  },
];
