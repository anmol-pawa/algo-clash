class Solution {
public:
    bool chantMatches(string pattern, string sentence) {
        vector<string> words;
        istringstream in(sentence);
        for (string w; in >> w;) words.push_back(w);
        if (words.size() != pattern.size()) return false;

        string wordOf[26];                     // letter -> the word it stands for ("" = unseen; words are non-empty)
        unordered_map<string, char> letterOf;  // word -> the letter that stands for it
        for (size_t i = 0; i < pattern.size(); ++i) {
            string& w = wordOf[pattern[i] - 'a'];
            const auto it = letterOf.find(words[i]);
            if (w.empty() != (it == letterOf.end())) return false;  // one side known, the other new
            if (w.empty()) {
                w = words[i];
                letterOf[words[i]] = pattern[i];
            } else if (w != words[i] || it->second != pattern[i]) {
                return false;
            }
        }
        return true;
    }
};
