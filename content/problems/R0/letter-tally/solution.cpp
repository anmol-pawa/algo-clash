class Solution {
public:
    vector<int> letterTally(string s) {
        vector<int> tally(26, 0);
        for (const char raw : s) {
            // Cast to unsigned char first: passing a negative char to <cctype> functions is undefined.
            const char c = static_cast<char>(tolower(static_cast<unsigned char>(raw)));
            if (c >= 'a' && c <= 'z') ++tally[c - 'a'];  // char arithmetic gives the bucket index
        }
        return tally;
    }
};
