class Solution {
public:
    bool isScramble(string a, string b) {
        int sa = 0, sb = 0;
        for (const char c : a) sa += c;
        for (const char c : b) sb += c;
        return a.size() == b.size() && sa == sb;  // Wrong: "ad" and "bc" have equal sums but different letters.
    }
};
