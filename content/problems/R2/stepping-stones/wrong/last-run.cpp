class Solution {
public:
    int longestPath(vector<int>& stones) {
        // Wrong: returns the length of the final run instead of the longest.
        vector<int> v = stones;
        sort(v.begin(), v.end());
        v.erase(unique(v.begin(), v.end()), v.end());
        int run = 0;
        for (size_t i = 0; i < v.size(); ++i) run = (i > 0 && v[i] == v[i - 1] + 1) ? run + 1 : 1;
        return run;
    }
};
