class Solution {
public:
    vector<int> chainStarts(string text, vector<string> words) {
        // Wrong: only slides from alignment 0, so chains that start at i % w != 0 are never seen.
        const int n = static_cast<int>(text.size());
        const int k = static_cast<int>(words.size());
        const int w = static_cast<int>(words[0].size());
        unordered_map<string, int> need;
        for (const auto& word : words) ++need[word];
        vector<int> result;
        for (int i = 0; i + k * w <= n; i += w) {
            unordered_map<string, int> have;
            bool ok = true;
            for (int j = 0; j < k && ok; ++j) {
                const string word = text.substr(i + j * w, w);
                ok = ++have[word] <= need[word];
            }
            if (ok) result.push_back(i);
        }
        return result;
    }
};
