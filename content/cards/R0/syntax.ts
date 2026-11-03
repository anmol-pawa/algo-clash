import type { Card } from "@/lib/cards/types";

/** R0 Syntax Shores seed cards (B5a). B6/B7 add the full lesson sets. */
export const syntaxCards: Card[] = [
  {
    id: "r0-vector-header", kind: "mcq", region: "R0", tags: ["stl", "includes"],
    prompt: "Which header gives you std::vector?",
    choices: ["<array>", "<vector>", "<list>", "<cstddef>"], answer: 1,
    explanation: "std::vector lives in <vector>. <array> is the fixed-size std::array, <list> is the doubly linked list.",
  },
  {
    id: "r0-contiguous", kind: "multi", region: "R0", tags: ["stl", "memory"],
    prompt: "Select every container that stores its elements in one contiguous block.",
    choices: ["std::vector<int>", "std::array<int, 4>", "std::list<int>", "std::deque<int>", "std::string"],
    answers: [0, 1, 4],
    explanation: "vector, array and string are contiguous, so &v[0] + i reaches element i. list is nodes linked by pointers, and deque is a set of separate blocks, so neither guarantees contiguity.",
  },
  {
    id: "r0-int-division", kind: "predict", region: "R0", tags: ["arithmetic", "integer-division"],
    prompt: "What does this program print? Two lines.",
    code: `#include <iostream>
int main() {
    int a = 17, b = 5;
    std::cout << a / b << "\\n";
    std::cout << a % b << "\\n";
}
`,
    explanation: "Integer division truncates toward zero: 17 / 5 is 3, and 17 % 5 is the remainder 2.",
  },
  {
    id: "r0-loop-sum", kind: "trace", region: "R0", tags: ["loops", "trace"],
    prompt: "Trace the loop. What is printed?",
    code: `#include <iostream>
int main() {
    long long total = 0;
    for (int i = 1; i <= 10; i += 3) {
        total += i;
    }
    std::cout << total << "\\n";
}
`,
    explanation: "i takes 1, 4, 7, 10 and each is added: 1 + 4 + 7 + 10 = 22. The bound is inclusive, so 10 counts.",
  },
  {
    id: "r0-scope-error", kind: "compilerError", region: "R0", tags: ["scope", "compiler-errors"],
    prompt: "The compiler rejects this. What is the cause?",
    code: `#include <iostream>
int main() {
    for (int i = 0; i < 3; ++i) {
    }
    std::cout << i << "\\n";
}
`,
    choices: ["A missing semicolon", "i only exists inside the for loop", "iostream was not included", "i must be declared long long"], answer: 1,
    explanation: "A variable declared in the for-init lives only for that loop. Declare it before the loop if you need it afterwards.",
  },
  {
    id: "r0-const-error", kind: "compilerError", region: "R0", tags: ["const", "compiler-errors"],
    prompt: "Why does this not compile?",
    code: `int main() {
    const int limit = 10;
    limit = 20;
    return limit;
}
`,
    choices: ["limit is const, so it cannot be assigned to", "main must return void", "20 does not fit in an int", "limit is declared too early"], answer: 0,
    explanation: "A const object cannot be modified after initialisation. Drop const, or compute a new value instead of reassigning.",
  },
  {
    id: "r0-sum-vector-order", kind: "parsons", region: "R0", tags: ["vector", "loops", "parsons"],
    prompt: "Put the lines in order so the program prints the sum of the vector.",
    lines: [
      "#include <iostream>",
      "#include <vector>",
      "int main() {",
      "    std::vector<int> v = {4, 8, 15, 16};",
      "    long long sum = 0;",
      "    for (int x : v) sum += x;",
      "    std::cout << sum << \"\\n\";",
      "}",
    ],
    explanation: "Headers first, then main: build the data, initialise the accumulator before the loop, loop, print. Declaring sum after the loop would not compile.",
  },
  {
    id: "r0-count-up-cloze", kind: "cloze", region: "R0", tags: ["loops", "cloze"],
    prompt: "Fill the blanks so it prints 0 1 2 3 4 (one per line).",
    template: `#include <iostream>
int main() {
    int n = 5;
    for (int i = ___; i ___ n; ++i) {
        std::cout << i << "\\n";
    }
}
`,
    blanks: [["0"], ["<"]],
    explanation: "Zero-based loops start at 0 and use i < n, so exactly n iterations run. i <= n would print 5 as well.",
  },
];
