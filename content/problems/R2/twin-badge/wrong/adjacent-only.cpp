class Solution {
public:
    bool hasTwin(vector<int>& badges) {
        // Wrong: only compares neighbours, so twins that are apart go unnoticed.
        for (size_t i = 1; i < badges.size(); ++i)
            if (badges[i] == badges[i - 1]) return true;
        return false;
    }
};
