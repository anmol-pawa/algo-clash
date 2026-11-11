class Solution {
public:
    vector<int> chainStarts(string text, vector<string> words) {
        // Wrong: treats the list as a set, so repeated words only need to appear once in the window.
        const int n = static_cast<int>(text.size());
        const int k = static_cast<int>(words.size());
        const int w = static_cast<int>(words[0].size());
        const set<string> need(words.begin(), words.end());
        vector<int> result;
        for (int i = 0; i + k * w <= n; ++i) {
            set<string> seen;
            for (int j = 0; j < k; ++j) {
                const string word = text.substr(i + j * w, w);
                if (!need.count(word)) break;
                seen.insert(word);
            }
            if (seen == need) result.push_back(i);
        }
        return result;
    }
};
