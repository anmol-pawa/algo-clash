class Solution {
public:
    string smallestCover(string tape, string charms) {
        const int n = static_cast<int>(tape.size());
        array<int, 128> need{};  // need[c] > 0: copies of c the window still lacks; <= 0: spare copies
        for (const char ch : charms) ++need[static_cast<unsigned char>(ch)];
        int missing = static_cast<int>(charms.size());  // charm copies not yet covered
        int bestStart = 0;
        int bestLen = n + 1;  // n + 1 means "no cover found"
        int left = 0;
        for (int right = 0; right < n; ++right) {
            if (need[static_cast<unsigned char>(tape[right])]-- > 0) --missing;
            while (missing == 0) {  // window [left, right] covers: record it, then try to shrink
                if (right - left + 1 < bestLen) {  // strict '<' keeps the leftmost on ties
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                if (++need[static_cast<unsigned char>(tape[left])] > 0) ++missing;  // we dropped a needed copy
                ++left;
            }
        }
        return bestLen > n ? "" : tape.substr(bestStart, bestLen);
    }
};
