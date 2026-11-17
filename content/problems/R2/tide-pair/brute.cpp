class Solution {
public:
    vector<int> tidePair(vector<int>& readings, int target) {
        const int n = static_cast<int>(readings.size());
        for (int j = 0; j < n; ++j)
            for (int i = 0; i < j; ++i)
                if (static_cast<long long>(readings[i]) + readings[j] == target) return {i, j};
        return {-1, -1};
    }
};
