class Solution {
public:
    int countShuffles(string text, string word) {
        const int n = static_cast<int>(text.size());
        const int m = static_cast<int>(word.size());
        if (m > n) return 0;
        array<bool, 26> inWord{};
        for (const char ch : word) inWord[ch - 'a'] = true;
        int found = 0;
        for (int i = 0; i + m <= n; ++i) {
            array<bool, 26> seen{};
            for (int j = i; j < i + m; ++j) seen[text[j] - 'a'] = true;
            if (seen == inWord) ++found;  // bug: same set of letters is not the same multiset
        }
        return found;
    }
};
