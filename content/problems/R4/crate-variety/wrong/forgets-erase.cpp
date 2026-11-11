class Solution {
public:
    int longestVariety(vector<int> kinds, int k) {
        unordered_map<int, int> inBag;
        int best = 0;
        int left = 0;
        for (int right = 0; right < static_cast<int>(kinds.size()); ++right) {
            ++inBag[kinds[right]];
            while (static_cast<int>(inBag.size()) > k) {
                --inBag[kinds[left]];  // Wrong: a count of 0 stays in the map, so size() never drops and the loop runs off the array.
                ++left;
                if (left > right) break;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
