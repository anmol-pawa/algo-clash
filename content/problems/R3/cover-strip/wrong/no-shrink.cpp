class Solution {
public:
    string smallestCover(string tape, string charms) {
        const int n = static_cast<int>(tape.size());
        array<int, 128> need{};
        for (const char ch : charms) ++need[static_cast<unsigned char>(ch)];
        int missing = static_cast<int>(charms.size());
        for (int right = 0; right < n; ++right) {
            if (need[static_cast<unsigned char>(tape[right])]-- > 0) --missing;
            if (missing == 0) {
                // bug: returns the first covering prefix without shrinking from the left
                return tape.substr(0, right + 1);
            }
        }
        return "";
    }
};
