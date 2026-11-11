class Solution {
public:
    bool chantMatches(string pattern, string sentence) {
        vector<string> words;
        istringstream in(sentence);
        for (string w; in >> w;) words.push_back(w);
        if (words.size() != pattern.size()) return false;
        for (size_t i = 0; i < words.size(); ++i)
            for (size_t j = i + 1; j < words.size(); ++j)
                if ((pattern[i] == pattern[j]) != (words[i] == words[j])) return false;
        return true;
    }
};
