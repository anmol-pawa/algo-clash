class Solution {
public:
    int matchingPrefix(string pattern, vector<string> words) {
        const int n = static_cast<int>(min(pattern.size(), words.size()));
        // Correct but quadratic: re-checks every earlier line, comparing whole words.
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < i; ++j) {
                const bool samePattern = pattern[i] == pattern[j];
                const bool sameWord = words[i].size() == words[j].size() && words[i].compare(words[j]) == 0;
                if (samePattern != sameWord) return i;
            }
        }
        return n;
    }
};
