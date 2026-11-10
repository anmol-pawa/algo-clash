class Solution {
public:
    int largestClan(vector<string> words) {
        unordered_map<size_t, int> bySize;
        int best = 0;
        for (const string& w : words) best = max(best, ++bySize[w.size()]);  // Wrong: equal length is not the same letters.
        return best;
    }
};
