class Solution {
public:
    int largestClan(vector<string> words) {
        const int n = static_cast<int>(words.size());
        int best = 0;
        for (int i = 0; i < n; ++i) {
            int size = 0;
            for (int j = 0; j < n; ++j) {
                string a = words[i], b = words[j];  // Wrong: re-sorts both words for every pair, O(n^2 L log L).
                sort(a.begin(), a.end());
                sort(b.begin(), b.end());
                if (a == b) ++size;
            }
            best = max(best, size);
        }
        return best;
    }
};
