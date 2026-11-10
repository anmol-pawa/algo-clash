class Solution {
public:
    string smallestCover(string tape, string charms) {
        const int n = static_cast<int>(tape.size());
        array<int, 128> need{};
        for (const char ch : charms) ++need[static_cast<unsigned char>(ch)];
        const int total = static_cast<int>(charms.size());
        int bestStart = -1;
        int bestLen = n + 1;
        for (int i = 0; i < n; ++i) {  // correct but O(n^2): restarts a fresh scan from every start
            array<int, 128> left = need;
            int missing = total;
            for (int j = i; j < n; ++j) {
                if (left[static_cast<unsigned char>(tape[j])]-- > 0) --missing;
                if (missing == 0) {
                    if (j - i + 1 < bestLen) { bestLen = j - i + 1; bestStart = i; }
                    break;
                }
            }
        }
        return bestStart < 0 ? "" : tape.substr(bestStart, bestLen);
    }
};
