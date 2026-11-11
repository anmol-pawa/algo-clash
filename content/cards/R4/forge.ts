import type { Card } from "@/lib/cards/types";

/** Trace-tier questions for the R4 Forge scrolls (GDD §6.4). Outputs are computed by g++; each program embeds the scroll's template. */
const VERSE = `#include <algorithm>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    int matchingPrefix(string pattern, vector<string> words) {
        const int n = static_cast<int>(min(pattern.size(), words.size()));
        unordered_map<char, string> wordOf;   // letter -> the word it stands for
        unordered_map<string, char> letterOf; // word -> the letter that stands for it
        for (int i = 0; i < n; ++i) {
            const auto w = wordOf.find(pattern[i]);
            const auto l = letterOf.find(words[i]);
            // Both directions must agree with what we already know, or line i breaks the fit.
            if (w != wordOf.end() && w->second != words[i]) return i;
            if (l != letterOf.end() && l->second != pattern[i]) return i;
            wordOf[pattern[i]] = words[i];
            letterOf[words[i]] = pattern[i];
        }
        return n;
    }
};
`;

const ECHO = `#include <algorithm>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<string> echoes(string strand, int k) {
        const int n = static_cast<int>(strand.size());
        vector<string> answer;
        if (k > n) return answer;

        const auto code = [](char c) -> long long {
            switch (c) {
                case 'A': return 0;
                case 'C': return 1;
                case 'G': return 2;
                default:  return 3;  // 'T'
            }
        };

        // Each letter is 2 bits, so a block of k letters is 2k <= 60 bits: exact, no collisions.
        const long long mask = (1LL << (2 * k)) - 1;
        unordered_map<long long, int> seen;  // block key -> how many starts so far
        seen.reserve(n * 2);
        long long key = 0;
        for (int i = 0; i < n; ++i) {
            key = ((key << 2) | code(strand[i])) & mask;  // slide: add the new letter, drop the oldest
            if (i < k - 1) continue;                      // window not full yet
            if (++seen[key] == 2) answer.push_back(strand.substr(i - k + 1, k));  // report on the 2nd sighting only
        }
        sort(answer.begin(), answer.end());
        return answer;
    }
};

void show(const vector<string>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) cout << (i ? ", " : "") << v[i];
    cout << "]\\n";
}
`;

const tag = (scroll: string) => ["forge", scroll, "trace"];

export const forgeR4Cards: Card[] = [
  {
    id: "forge-two-way-map-trace-basic", kind: "trace", region: "R4", tags: tag("two-way-map"),
    prompt: "What does this program print?",
    code: `${VERSE}
int main() {
    cout << Solution().matchingPrefix("abba", {"sun", "moon", "moon", "sun"}) << "\\n";
}
`,
    explanation: "Every line agrees: a is sun on lines 0 and 3, b is moon on lines 1 and 2. All four lines fit, so n = 4 is returned.",
  },
  {
    id: "forge-two-way-map-trace-letter-clash", kind: "trace", region: "R4", tags: tag("two-way-map"),
    prompt: "The last word breaks the pattern. What is printed?",
    code: `${VERSE}
int main() {
    cout << Solution().matchingPrefix("abba", {"sun", "moon", "moon", "star"}) << "\\n";
}
`,
    explanation: "On line 3 the letter a is already tied to sun, but the word is star. The first check fires and returns i = 3.",
  },
  {
    id: "forge-two-way-map-trace-word-clash", kind: "trace", region: "R4", tags: tag("two-way-map"),
    prompt: "Two letters, one word. What is printed?",
    code: `${VERSE}
int main() {
    cout << Solution().matchingPrefix("ab", {"x", "x"}) << "\\n";
}
`,
    explanation: "Line 0 ties a to x and x to a. On line 1 the letter b is new, but the word x is already tied to a, so only the second ledger catches it: 1.",
  },
  {
    id: "forge-two-way-map-trace-short-words", kind: "trace", region: "R4", tags: tag("two-way-map"),
    prompt: "The word list is shorter than the pattern. What is printed?",
    code: `${VERSE}
int main() {
    cout << Solution().matchingPrefix("abcd", {"p", "q"}) << "\\n";
}
`,
    explanation: "n is min(4, 2) = 2. Both lines fit, so the loop ends and n = 2 is returned; the unmatched letters never count.",
  },
  {
    id: "forge-two-way-map-trace-empty", kind: "trace", region: "R4", tags: tag("two-way-map"),
    prompt: "An empty pattern. What is printed?",
    code: `${VERSE}
int main() {
    cout << Solution().matchingPrefix("", {"a"}) << "\\n";
}
`,
    explanation: "n = min(0, 1) = 0, the loop never runs and 0 is returned: the empty prefix always fits.",
  },
  {
    id: "forge-rolling-key-trace-basic", kind: "trace", region: "R4", tags: tag("rolling-key"),
    prompt: "What does this program print?",
    code: `${ECHO}
int main() {
    show(Solution().echoes("ACGACGAC", 3));
}
`,
    explanation: "Blocks ACG, CGA, GAC repeat at starts 3, 4, 5. Each is pushed on its second sighting, then the list is sorted: [ACG, CGA, GAC].",
  },
  {
    id: "forge-rolling-key-trace-overlap", kind: "trace", region: "R4", tags: tag("rolling-key"),
    prompt: "All letters equal. What is printed?",
    code: `${ECHO}
int main() {
    show(Solution().echoes("AAAAAA", 2));
}
`,
    explanation: "Every window is AA, so the key is 0 each time. The count reaches 2 at start 1 and the block is reported once; later sightings do not push again: AA.",
  },
  {
    id: "forge-rolling-key-trace-none", kind: "trace", region: "R4", tags: tag("rolling-key"),
    prompt: "No block repeats. What is printed?",
    code: `${ECHO}
int main() {
    show(Solution().echoes("ACGT", 2));
}
`,
    explanation: "AC, CG and GT each occur once, so the answer vector stays empty and show prints [].",
  },
  {
    id: "forge-rolling-key-trace-too-long", kind: "trace", region: "R4", tags: tag("rolling-key"),
    prompt: "The block is longer than the strand. What is printed?",
    code: `${ECHO}
int main() {
    show(Solution().echoes("ACG", 5));
}
`,
    explanation: "k > n triggers the early return with an empty vector. Without it, the mask would be fine but the substr indices would be nonsense.",
  },
  {
    id: "forge-rolling-key-trace-thrice", kind: "trace", region: "R4", tags: tag("rolling-key"),
    prompt: "One block appears three times. How often is it printed?",
    code: `${ECHO}
int main() {
    show(Solution().echoes("TTTTT", 2));
}
`,
    explanation: "TT occurs at starts 0..3, but only the second sighting pushes it, so it is listed exactly once.",
  },
];
