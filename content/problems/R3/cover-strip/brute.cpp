class Solution {
public:
    string smallestCover(string tape, string charms) {
        const int n = static_cast<int>(tape.size());
        array<int, 128> need{};
        for (const char ch : charms) ++need[static_cast<unsigned char>(ch)];
        int bestStart = -1;
        int bestLen = n + 1;
        for (int i = 0; i < n; ++i) {
            array<int, 128> have{};
            for (int j = i; j < n; ++j) {
                ++have[static_cast<unsigned char>(tape[j])];
                bool ok = true;
                for (int c = 0; c < 128; ++c) {
                    if (have[c] < need[c]) { ok = false; break; }
                }
                if (ok) {
                    if (j - i + 1 < bestLen) { bestLen = j - i + 1; bestStart = i; }
                    break;  // longer stretches from this start cannot be shorter
                }
            }
        }
        return bestStart < 0 ? "" : tape.substr(bestStart, bestLen);
    }
};
