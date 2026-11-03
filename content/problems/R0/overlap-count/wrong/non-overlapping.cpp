class Solution {
public:
    int countOverlaps(string text, const string& pat) {
        // Wrong: jumps past each match, so overlapping occurrences are missed.
        int count = 0;
        size_t pos = text.find(pat);
        while (pos != string::npos) {
            ++count;
            pos = text.find(pat, pos + pat.size());
        }
        return count;
    }
};
