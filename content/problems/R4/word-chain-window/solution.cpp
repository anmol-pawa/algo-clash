class Solution {
public:
    vector<int> chainStarts(string text, vector<string> words) {
        const int n = static_cast<int>(text.size());
        const int k = static_cast<int>(words.size());
        const int w = static_cast<int>(words[0].size());
        vector<int> result;
        if (static_cast<long long>(k) * w > n) return result;

        unordered_map<string, int> need;  // how many times each word must appear
        for (const auto& word : words) ++need[word];

        // A chain is a run of k aligned words, so slide one word at a time, once per alignment 0..w-1.
        for (int offset = 0; offset < w; ++offset) {
            unordered_map<string, int> have;  // counts of words inside [left, right)
            int inside = 0;                   // number of words inside the window
            int left = offset;
            for (int right = offset; right + w <= n; right += w) {
                const string word = text.substr(right, w);
                const auto it = need.find(word);
                if (it == need.end()) {  // a word that is not in the list breaks every window across it
                    have.clear();
                    inside = 0;
                    left = right + w;
                    continue;
                }
                ++have[word];
                ++inside;
                while (have[word] > it->second) {  // too many copies of this word: shrink from the left
                    --have[text.substr(left, w)];
                    left += w;
                    --inside;
                }
                if (inside == k) {  // exactly k words, none in excess, so counts match need
                    result.push_back(left);
                    --have[text.substr(left, w)];
                    left += w;
                    --inside;
                }
            }
        }
        sort(result.begin(), result.end());  // alignments were processed one after another
        return result;
    }
};
