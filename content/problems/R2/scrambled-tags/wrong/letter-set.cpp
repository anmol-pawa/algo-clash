class Solution {
public:
    bool sameLetters(string a, string b) {
        // Wrong: compares which letters appear, ignoring how many times.
        set<char> x(a.begin(), a.end()), y(b.begin(), b.end());
        return x == y;
    }
};
