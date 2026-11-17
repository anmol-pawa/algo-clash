class Solution {
public:
    bool hasTwin(vector<int>& badges) {
        // Wrong: only looks back ten scans.
        const int n = static_cast<int>(badges.size());
        for (int i = 0; i < n; ++i)
            for (int j = max(0, i - 10); j < i; ++j)
                if (badges[i] == badges[j]) return true;
        return false;
    }
};
