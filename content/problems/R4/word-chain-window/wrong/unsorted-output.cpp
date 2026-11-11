class Solution {
public:
    vector<int> chainStarts(string text, vector<string> words) {
        // Wrong: correct windows, but the alignments are appended one after another and never sorted.
        const int n = static_cast<int>(text.size());
        const int k = static_cast<int>(words.size());
        const int w = static_cast<int>(words[0].size());
        vector<int> result;
        if (static_cast<long long>(k) * w > n) return result;
        unordered_map<string, int> need;
        for (const auto& word : words) ++need[word];
        for (int offset = 0; offset < w; ++offset) {
            unordered_map<string, int> have;
            int inside = 0, left = offset;
            for (int right = offset; right + w <= n; right += w) {
                const string word = text.substr(right, w);
                const auto it = need.find(word);
                if (it == need.end()) { have.clear(); inside = 0; left = right + w; continue; }
                ++have[word]; ++inside;
                while (have[word] > it->second) { --have[text.substr(left, w)]; left += w; --inside; }
                if (inside == k) { result.push_back(left); --have[text.substr(left, w)]; left += w; --inside; }
            }
        }
        return result;
    }
};
