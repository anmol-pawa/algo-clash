class Solution {
public:
    vector<int> waitDays(vector<int>& temps) {
        const int n = static_cast<int>(temps.size());
        vector<int> wait(n, 0);
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                if (temps[j] > temps[i]) { wait[i] = j - i; break; }
            }
        }
        return wait;
    }
};
