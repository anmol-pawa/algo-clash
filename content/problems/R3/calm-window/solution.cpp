class Solution {
public:
    int longestCalm(string s, int k) {
        int count[26] = {};   // occurrences of each letter inside the window
        int distinct = 0;     // letters with count > 0
        int best = 0;
        int left = 0;
        for (int right = 0; right < static_cast<int>(s.size()); ++right) {
            if (count[s[right] - 'a']++ == 0) ++distinct;
            while (distinct > k) {  // shrink until calm again
                if (--count[s[left] - 'a'] == 0) --distinct;
                ++left;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
