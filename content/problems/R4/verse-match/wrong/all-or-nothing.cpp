class Solution {
public:
    int matchingPrefix(string pattern, vector<string> words) {
        const int n = static_cast<int>(min(pattern.size(), words.size()));
        unordered_map<char, string> wordOf;
        unordered_map<string, char> letterOf;
        for (int i = 0; i < n; ++i) {
            const auto w = wordOf.find(pattern[i]);
            const auto l = letterOf.find(words[i]);
            if ((w != wordOf.end() && w->second != words[i]) || (l != letterOf.end() && l->second != pattern[i])) return 0;  // Wrong: reports 0 instead of the failing index
            wordOf[pattern[i]] = words[i];
            letterOf[words[i]] = pattern[i];
        }
        return n;
    }
};
