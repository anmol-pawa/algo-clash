class Solution {
public:
    int countOverlaps(string text, const string& pat) {
        int count = 0;
        size_t pos = text.find(pat);
        while (pos != string::npos) {
            ++count;
            pos = text.find(pat, pos + 1);  // move by ONE so overlapping occurrences are found
        }
        return count;
    }
};
