class Solution {
public:
    int longestCalm(string s, int k) {
        int count[26] = {};
        int distinct = 0, best = 0, left = 0;
        for (int right = 0; right < static_cast<int>(s.size()); ++right) {
            if (count[s[right] - 'a']++ == 0) ++distinct;
            while (distinct > k) {
                if (--count[s[left] - 'a'] == 0) --distinct;
                ++left;
            }
            best = max(best, right - left);  // Wrong: length is right - left + 1.
        }
        return best;
    }
};
