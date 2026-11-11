class Solution {
public:
    int matchingPrefix(string pattern, vector<string> words) {
        const int n = static_cast<int>(min(pattern.size(), words.size()));
        // Line i breaks the fit when some earlier line j disagrees about "same or different".
        for (int i = 0; i < n; ++i)
            for (int j = 0; j < i; ++j)
                if ((pattern[i] == pattern[j]) != (words[i] == words[j])) return i;
        return n;
    }
};
