class Solution {
public:
    vector<int> chainStarts(string text, vector<string> words) {
        const int n = static_cast<int>(text.size());
        const int k = static_cast<int>(words.size());
        const int w = static_cast<int>(words[0].size());
        vector<int> result;
        map<string, int> need;
        for (const auto& word : words) ++need[word];
        for (int i = 0; i + k * w <= n; ++i) {
            map<string, int> have;
            for (int j = 0; j < k; ++j) ++have[text.substr(i + j * w, w)];
            if (have == need) result.push_back(i);
        }
        return result;
    }
};
