class Solution {
public:
    int countShuffles(string text, string word) {
        const int n = static_cast<int>(text.size());
        const int m = static_cast<int>(word.size());
        if (m > n) return 0;
        array<int, 26> need{};
        array<int, 26> window{};
        for (const char ch : word) ++need[ch - 'a'];
        int found = 0;
        for (int i = 0; i < n - 1; ++i) {  // bug: stops one letter early, so the final window is never checked
            ++window[text[i] - 'a'];
            if (i >= m) --window[text[i - m] - 'a'];
            if (i >= m - 1 && window == need) ++found;
        }
        return found;
    }
};
