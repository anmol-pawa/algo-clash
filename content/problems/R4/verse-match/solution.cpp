class Solution {
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
