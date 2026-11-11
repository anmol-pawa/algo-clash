class Solution {
public:
    bool areTwins(string a, string b) {
        char to[128] = {};
        for (int i = 0; i < static_cast<int>(a.size()); ++i) {
            if (to[static_cast<int>(a[i])] == 0) to[static_cast<int>(a[i])] = b[i];
            else if (to[static_cast<int>(a[i])] != b[i]) return false;
        }
        return true;  // Wrong: never checks that two symbols do not share a target ("ab" vs "cc").
    }
};
