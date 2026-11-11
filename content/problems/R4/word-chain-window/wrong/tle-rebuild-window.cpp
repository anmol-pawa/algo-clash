class Solution {
public:
    vector<int> chainStarts(string text, vector<string> words) {
        // Correct but O(n * k) word lookups: every start re-reads all k words instead of sliding.
        const int n = static_cast<int>(text.size());
        const int k = static_cast<int>(words.size());
        const int w = static_cast<int>(words[0].size());
        unordered_map<string, int> need;
        for (const auto& word : words) ++need[word];
        vector<int> result;
        for (int i = 0; i + k * w <= n; ++i) {
            unordered_map<string, int> have;
            bool ok = true;
            for (int j = 0; j < k && ok; ++j) {
                const string word = text.substr(i + j * w, w);
                const auto it = need.find(word);
                ok = it != need.end() && ++have[word] <= it->second;
            }
            if (ok) result.push_back(i);
        }
        return result;
    }
};
