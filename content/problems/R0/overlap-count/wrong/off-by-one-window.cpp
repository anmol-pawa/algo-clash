class Solution {
public:
    int countOverlaps(string text, const string& pat) {
        // Wrong: the window loop stops one start position early (< instead of <=), so a match at the very end is missed.
        int count = 0;
        for (size_t i = 0; i + pat.size() < text.size(); ++i) {
            if (text.compare(i, pat.size(), pat) == 0) ++count;
        }
        return count;
    }
};
