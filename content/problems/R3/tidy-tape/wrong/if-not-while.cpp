class Solution {
public:
    int longestTidy(string tape, int m) {
        int count[26] = {};
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(tape.size()); ++right) {
            const int c = tape[right] - 'a';
            ++count[c];
            if (count[c] > m) {  // wrong: one step of shrinking may not remove an occurrence of c
                --count[tape[left] - 'a'];
                ++left;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
