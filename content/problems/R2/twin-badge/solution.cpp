class Solution {
public:
    bool hasTwin(vector<int>& badges) {
        unordered_set<int> seen;
        seen.reserve(badges.size());
        for (const int b : badges) {
            if (!seen.insert(b).second) return true;  // insert fails when b was already present
        }
        return false;
    }
};
