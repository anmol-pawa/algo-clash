class Solution {
public:
    bool areTwins(string a, string b) {
        return set<char>(a.begin(), a.end()).size() == set<char>(b.begin(), b.end()).size();  // Wrong: ignores where the symbols sit.
    }
};
