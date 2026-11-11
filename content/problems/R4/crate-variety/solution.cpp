class Solution {
public:
    int longestVariety(vector<int> kinds, int k) {
        unordered_map<int, int> inBag;  // kind -> how many crates of it are in the window
        int best = 0;
        int left = 0;
        for (int right = 0; right < static_cast<int>(kinds.size()); ++right) {
            ++inBag[kinds[right]];
            while (static_cast<int>(inBag.size()) > k) {  // Invariant after this loop: at most k kinds.
                if (--inBag[kinds[left]] == 0) inBag.erase(kinds[left]);
                ++left;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
