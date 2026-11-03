class Solution {
public:
    int countOverlaps(string text, const string& pat) {
        // Correct but slow: substr(i) copies the whole suffix at every position, O(n^2) bytes.
        int count = 0;
        for (size_t i = 0; i + pat.size() <= text.size(); ++i) {
            const string rest = text.substr(i);
            if (rest.compare(0, pat.size(), pat) == 0) ++count;
        }
        return count;
    }
};
