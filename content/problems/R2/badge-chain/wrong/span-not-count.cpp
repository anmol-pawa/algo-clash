class Solution {
public:
    int longestChain(vector<int> badges) {
        if (badges.empty()) return 0;
        const auto [lo, hi] = minmax_element(badges.begin(), badges.end());
        // Wrong: assumes the numbers between min and max are all present.
        return min<long long>(static_cast<long long>(*hi) - *lo + 1, unordered_set<int>(badges.begin(), badges.end()).size());
    }
};
