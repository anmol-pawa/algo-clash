class Solution {
public:
    int matchingPrefix(string pattern, vector<string> words) {
        if (pattern.size() != words.size()) return 0;  // Wrong: the problem asks for the longest fitting prefix
        const int n = static_cast<int>(pattern.size());
        unordered_map<char, string> wordOf;
        unordered_map<string, char> letterOf;
        for (int i = 0; i < n; ++i) {
            const auto w = wordOf.find(pattern[i]);
            const auto l = letterOf.find(words[i]);
            if ((w != wordOf.end() && w->second != words[i]) || (l != letterOf.end() && l->second != pattern[i])) return i;
            wordOf[pattern[i]] = words[i];
            letterOf[words[i]] = pattern[i];
        }
        return n;
    }
};
