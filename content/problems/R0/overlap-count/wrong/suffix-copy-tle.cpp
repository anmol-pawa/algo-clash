class Solution {
public:
    int countOverlaps(string text, const string& pat) {
        // Correct but slow: three whole-suffix copies at every position, O(n^2) bytes.
        int count = 0;
        for (size_t i = 0; i + pat.size() <= text.size(); ++i) {
            const string rest = text.substr(i);
            const string padded = rest + '#';           // a second full copy of the suffix
            const string tail = padded.substr(0, padded.size() - 1);  // and a third
            if (tail.compare(0, pat.size(), pat) == 0) ++count;
        }
        return count;
    }
};
