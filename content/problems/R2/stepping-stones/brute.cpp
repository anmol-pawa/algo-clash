class Solution {
public:
    int longestPath(vector<int>& stones) {
        vector<int> v = stones;
        sort(v.begin(), v.end());
        v.erase(unique(v.begin(), v.end()), v.end());
        int best = 0, run = 0;
        for (size_t i = 0; i < v.size(); ++i) {
            run = (i > 0 && static_cast<long long>(v[i]) == static_cast<long long>(v[i - 1]) + 1) ? run + 1 : 1;
            best = max(best, run);
        }
        return best;
    }
};
