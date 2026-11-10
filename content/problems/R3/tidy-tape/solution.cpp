class Solution {
public:
    int longestTidy(string tape, int m) {
        int count[26] = {};  // occurrences of each letter inside the window [left, right]
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(tape.size()); ++right) {
            const int c = tape[right] - 'a';
            ++count[c];
            while (count[c] > m) {  // only the new letter can be over the limit
                --count[tape[left] - 'a'];
                ++left;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
