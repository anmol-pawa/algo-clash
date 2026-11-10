class Solution {
public:
    int longestTidy(string tape, int m) {
        int count[26] = {};
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(tape.size()); ++right) {
            const int c = tape[right] - 'a';
            ++count[c];
            while (count[c] > m) {
                --count[tape[left] - 'a'];
                ++left;
            }
            best = max(best, right - left);  // wrong: window length is right - left + 1
        }
        return best;
    }
};
