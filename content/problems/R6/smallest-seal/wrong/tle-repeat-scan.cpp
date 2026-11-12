class Solution {
public:
    string smallestSeal(string code, int k) {
        // Correct but O(n*k): k times, delete the first digit that is bigger than its right neighbour (or the last digit).
        string s = code;
        for (int round = 0; round < k; ++round) {
            size_t i = 0;
            while (i + 1 < s.size() && s[i] <= s[i + 1]) ++i;
            s.erase(i, 1);
        }
        const size_t nz = s.find_first_not_of('0');
        return nz == string::npos ? "0" : s.substr(nz);
    }
};
