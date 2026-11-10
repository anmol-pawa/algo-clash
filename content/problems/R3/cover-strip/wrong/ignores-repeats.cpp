class Solution {
public:
    string smallestCover(string tape, string charms) {
        const int n = static_cast<int>(tape.size());
        array<bool, 128> wanted{};  // bug: remembers only which letters are wanted, not how many
        int distinct = 0;
        for (const char ch : charms) {
            if (!wanted[static_cast<unsigned char>(ch)]) { wanted[static_cast<unsigned char>(ch)] = true; ++distinct; }
        }
        array<int, 128> have{};
        int covered = 0;
        int bestStart = 0;
        int bestLen = n + 1;
        int left = 0;
        for (int right = 0; right < n; ++right) {
            const auto r = static_cast<unsigned char>(tape[right]);
            if (wanted[r] && have[r]++ == 0) ++covered;
            while (covered == distinct) {
                if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestStart = left; }
                const auto l = static_cast<unsigned char>(tape[left]);
                if (wanted[l] && --have[l] == 0) --covered;
                ++left;
            }
        }
        return bestLen > n ? "" : tape.substr(bestStart, bestLen);
    }
};
