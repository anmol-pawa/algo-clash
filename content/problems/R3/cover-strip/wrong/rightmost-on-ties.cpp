class Solution {
public:
    string smallestCover(string tape, string charms) {
        const int n = static_cast<int>(tape.size());
        array<int, 128> need{};
        for (const char ch : charms) ++need[static_cast<unsigned char>(ch)];
        int missing = static_cast<int>(charms.size());
        int bestStart = 0;
        int bestLen = n + 1;
        int left = 0;
        for (int right = 0; right < n; ++right) {
            if (need[static_cast<unsigned char>(tape[right])]-- > 0) --missing;
            while (missing == 0) {
                if (right - left + 1 <= bestLen) {  // bug: '<=' lets a later, equally short cover replace the leftmost one
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                if (++need[static_cast<unsigned char>(tape[left])] > 0) ++missing;
                ++left;
            }
        }
        return bestLen > n ? "" : tape.substr(bestStart, bestLen);
    }
};
