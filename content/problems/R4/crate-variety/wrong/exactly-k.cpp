class Solution {
public:
    int longestVariety(vector<int> kinds, int k) {
        unordered_map<int, int> inBag;
        int best = 0;
        int left = 0;
        for (int right = 0; right < static_cast<int>(kinds.size()); ++right) {
            ++inBag[kinds[right]];
            while (static_cast<int>(inBag.size()) > k) {
                if (--inBag[kinds[left]] == 0) inBag.erase(kinds[left]);
                ++left;
            }
            if (static_cast<int>(inBag.size()) == k) best = max(best, right - left + 1);  // Wrong: "at most k" is not "exactly k".
        }
        return best;
    }
};
