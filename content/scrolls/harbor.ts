import type { Scroll } from "@/lib/forge/types";

/** CUR §4 #46 "two-way map (bijection check)". Template equals content/problems/R4/verse-match/solution.cpp (tested). */
export const twoWayMapScroll: Scroll = {
  id: "two-way-map",
  cur: 46,
  title: "Scroll of the Twin Ledgers",
  region: "R4",
  blurb: "Keep one map per direction so a pairing is checked as one-to-one both ways.",
  problemId: "verse-match",
  template: `class Solution {
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
`,
  annotations: [
    { line: 4, note: "Only the first n positions can be compared; the longer input simply has leftovers that never get a partner." },
    { line: 5, note: "Ledger one: letter -> the word it stands for. Alone it would let two letters share a word." },
    { line: 6, note: "Ledger two: word -> the letter that stands for it. This second map is what makes the pairing one-to-one." },
    { line: 8, note: "Look both entries up with find. operator[] would insert a default entry and silently pretend a pairing exists." },
    { line: 10, note: "The invariant: before line i, both ledgers describe a perfect pairing of the first i lines." },
    { line: 11, note: "Letter seen before but with a different word: the same letter would stand for two words." },
    { line: 12, note: "Word seen before but with a different letter: two letters would stand for the same word." },
    { line: 13, note: "Only after both checks pass do we record the pairing, so a failing line never pollutes the ledgers." },
    { line: 16, note: "Every compared line fit, so the answer is the number we compared, n." },
  ],
  traceCardIds: [
    "forge-two-way-map-trace-basic",
    "forge-two-way-map-trace-letter-clash",
    "forge-two-way-map-trace-word-clash",
    "forge-two-way-map-trace-short-words",
    "forge-two-way-map-trace-empty",
  ],
  commonBugs: [
    "Using only the letter -> word map accepts a pattern where two different letters share one word.",
    "Using operator[] for the lookups inserts empty entries, so the first sighting looks like a clash.",
    "Recording the pairing before both checks lets a failing line corrupt the ledgers.",
    "Comparing pattern.size() against words.size() with an int cast on only one side is a signed/unsigned trap; take the min first.",
    "Returning i + 1 on a clash counts the offending line as fitting; the answer is the number of lines before it.",
  ],
};

/** CUR §4 #32 "rolling key over a fixed window". Template equals content/problems/R4/echo-strand/solution.cpp (tested). */
export const rollingKeyScroll: Scroll = {
  id: "rolling-key",
  cur: 32,
  title: "Scroll of the Sliding Key",
  region: "R4",
  blurb: "Encode a fixed-length window as one integer and slide it in O(1) per step.",
  problemId: "echo-strand",
  template: `class Solution {
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
`,
  annotations: [
    { line: 6, note: "If k is longer than the strand there are no blocks at all. Return early so the window logic never indexes out of range." },
    { line: 8, note: "Map each of the four letters to 0..3, which fits in 2 bits. A switch on a char is the idiomatic, branch-friendly way." },
    { line: 17, note: "k letters at 2 bits each is 2k <= 60 bits, so the key is an exact encoding. Equal key means equal block; no collisions to verify." },
    { line: 18, note: "mask keeps the lowest 2k bits. Write 1LL, not 1: shifting a 32-bit int by 2k >= 32 is undefined behaviour." },
    { line: 19, note: "Count how many starting positions have produced each key so far." },
    { line: 20, note: "reserve avoids rehashing while the map grows to up to n entries." },
    { line: 23, note: "Slide in O(1): shift everything up by one letter, OR in the new letter, and mask away the letter that fell out of the window." },
    { line: 24, note: "Until k letters have been read the key is only a partial block. Do not count it." },
    { line: 25, note: "Report on the second sighting only, so a block that occurs five times is pushed once. substr rebuilds the text from its start index." },
    { line: 27, note: "Hash-map iteration order is unspecified, so sort for the required alphabetical output." },
  ],
  traceCardIds: [
    "forge-rolling-key-trace-basic",
    "forge-rolling-key-trace-overlap",
    "forge-rolling-key-trace-none",
    "forge-rolling-key-trace-too-long",
    "forge-rolling-key-trace-thrice",
  ],
  commonBugs: [
    "Writing 1 << (2 * k) overflows a 32-bit int once k >= 16; use 1LL.",
    "Forgetting the mask lets old letters stay in the key, so the key stops describing a window of k letters.",
    "Counting blocks before the window is full inserts partial blocks that can collide with real ones.",
    "Pushing on every sighting after the first reports a block that occurs three times twice.",
    "Building each block with substr and hashing the string is O(n * k); the rolling key makes it O(n).",
  ],
};
