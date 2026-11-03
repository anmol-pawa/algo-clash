class Solution {
public:
    int countOverlaps(string text, const string& pat) {
        // Compare the phrase against every window character by character.
        int count = 0;
        for (size_t i = 0; i + pat.size() <= text.size(); ++i) {
            bool same = true;
            for (size_t k = 0; k < pat.size(); ++k) {
                if (text[i + k] != pat[k]) { same = false; break; }
            }
            if (same) ++count;
        }
        return count;
    }
};
