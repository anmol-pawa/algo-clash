class Solution {
public:
    int longestTidy(string tape, int m) {
        int count[26] = {};
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(tape.size()); ++right) {
            const int c = tape[right] - 'a';
            if (count[c] == m) {  // wrong: restarts at right instead of dropping only the oldest copy of c
                left = right;
                fill(begin(count), end(count), 0);
            }
            ++count[c];
            best = max(best, right - left + 1);
        }
        return best;
    }
};
