class Solution {
public:
    vector<int> waitDays(vector<int>& temps) {
        const int n = static_cast<int>(temps.size());
        vector<int> wait(n, 0);
        // Wrong: only looks at tomorrow and the day after.
        for (int i = 0; i < n; ++i) {
            if (i + 1 < n && temps[i + 1] > temps[i]) wait[i] = 1;
            else if (i + 2 < n && temps[i + 2] > temps[i]) wait[i] = 2;
        }
        return wait;
    }
};
