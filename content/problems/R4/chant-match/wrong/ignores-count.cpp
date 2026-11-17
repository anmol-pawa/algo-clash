class Solution {
public:
    bool chantMatches(string pattern, string sentence) {
        vector<string> words;
        istringstream in(sentence);
        for (string w; in >> w;) words.push_back(w);
        unordered_map<char, string> wordOf;
        unordered_map<string, char> letterOf;
        // Bug: only compares as many as the shorter side has; extra letters or words are ignored.
        for (size_t i = 0; i < min(pattern.size(), words.size()); ++i) {
            const auto a = wordOf.find(pattern[i]);
            const auto b = letterOf.find(words[i]);
            if (a == wordOf.end() && b == letterOf.end()) {
                wordOf[pattern[i]] = words[i];
                letterOf[words[i]] = pattern[i];
            } else if (a == wordOf.end() || b == letterOf.end() || a->second != words[i] || b->second != pattern[i]) {
                return false;
            }
        }
        return true;
    }
};
