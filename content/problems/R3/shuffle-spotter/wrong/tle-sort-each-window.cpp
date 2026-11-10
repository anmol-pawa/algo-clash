class Solution {
public:
    int countShuffles(string text, string word) {
        const int n = static_cast<int>(text.size());
        const int m = static_cast<int>(word.size());
        string target = word;
        sort(target.begin(), target.end());
        int found = 0;
        for (int i = 0; i + m <= n; ++i) {  // correct but re-sorts every window: O(n * m log m)
            string piece = text.substr(i, m);
            sort(piece.begin(), piece.end());
            if (piece == target) ++found;
        }
        return found;
    }
};
