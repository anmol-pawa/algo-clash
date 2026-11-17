class Solution {
public:
    bool chantMatches(string pattern, string sentence) {
        vector<string> words;
        istringstream in(sentence);
        for (string w; in >> w;) words.push_back(w);
        if (words.size() != pattern.size()) return false;
        // Bug: compares only the first letter of each word, so "ox" and "oak" look identical.
        unordered_map<char, char> fwd, rev;
        for (size_t i = 0; i < pattern.size(); ++i) {
            const char c = words[i][0];
            if (fwd.count(pattern[i]) && fwd[pattern[i]] != c) return false;
            if (rev.count(c) && rev[c] != pattern[i]) return false;
            fwd[pattern[i]] = c;
            rev[c] = pattern[i];
        }
        return true;
    }
};
