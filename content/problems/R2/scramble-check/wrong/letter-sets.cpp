class Solution {
public:
    bool isScramble(string a, string b) {
        return set<char>(a.begin(), a.end()) == set<char>(b.begin(), b.end());  // Wrong: ignores how many times each letter appears.
    }
};
