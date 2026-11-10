class Solution {
public:
    bool hasTwin(vector<int>& badges) {
        vector<int> sorted = badges;
        sort(sorted.begin(), sorted.end());
        for (size_t i = 1; i < sorted.size(); ++i)
            if (sorted[i] == sorted[i - 1]) return true;
        return false;
    }
};
