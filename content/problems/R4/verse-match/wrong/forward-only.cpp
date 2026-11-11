class Solution {
public:
    int matchingPrefix(string pattern, vector<string> words) {
        const int n = static_cast<int>(min(pattern.size(), words.size()));
        unordered_map<char, string> wordOf;
        for (int i = 0; i < n; ++i) {
            const auto it = wordOf.find(pattern[i]);
            if (it != wordOf.end() && it->second != words[i]) return i;
            wordOf[pattern[i]] = words[i];  // Wrong: never checks that two letters share one word
        }
        return n;
    }
};
