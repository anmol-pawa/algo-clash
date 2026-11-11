class Solution {
public:
    bool chantMatches(string pattern, string sentence) {
        vector<string> words;
        istringstream in(sentence);
        for (string w; in >> w;) words.push_back(w);
        if (words.size() != pattern.size()) return false;
        unordered_map<char, string> wordOf;  // Bug: no reverse map, so two letters may share a word.
        for (size_t i = 0; i < pattern.size(); ++i) {
            const auto it = wordOf.find(pattern[i]);
            if (it == wordOf.end()) wordOf[pattern[i]] = words[i];
            else if (it->second != words[i]) return false;
        }
        return true;
    }
};
