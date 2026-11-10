class Solution {
public:
    vector<int> tidePair(vector<int>& readings, int target) {
        // Wrong: returns the pair that STARTS earliest, not the one that finishes earliest.
        const int n = static_cast<int>(readings.size());
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                if (static_cast<long long>(readings[i]) + readings[j] == target) return {i, j};
        return {-1, -1};
    }
};
