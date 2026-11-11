class Solution {
public:
    vector<int> chainStarts(string text, vector<string> words) {
        // Wrong: only checks that every block is some word of the list, never how many times each is used,
        // so "aaaa" is accepted for ["aa", "bb"].
        const int n = static_cast<int>(text.size());
        const int k = static_cast<int>(words.size());
        const int w = static_cast<int>(words[0].size());
        unordered_set<string> known(words.begin(), words.end());
        vector<int> result;
        for (int i = 0; i + k * w <= n; ++i) {
            int hits = 0;
            for (int j = 0; j < k; ++j) hits += known.count(text.substr(i + j * w, w)) ? 1 : 0;
            if (hits == k) result.push_back(i);
        }
        return result;
    }
};
