class Solution {
public:
    int countShuffles(string text, string word) {
        const int n = static_cast<int>(text.size());
        const int m = static_cast<int>(word.size());
        if (m > n) return 0;
        array<int, 26> need{};    // letters the word demands
        array<int, 26> window{};  // letters currently inside text[i - m + 1 .. i]
        for (const char ch : word) ++need[ch - 'a'];
        int found = 0;
        for (int i = 0; i < n; ++i) {
            ++window[text[i] - 'a'];                 // newcomer on the right
            if (i >= m) --window[text[i - m] - 'a'];  // the letter that just left on the left
            if (i >= m - 1 && window == need) ++found;  // a full-size window with equal counts
        }
        return found;
    }
};
