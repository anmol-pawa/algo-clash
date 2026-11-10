class Solution {
public:
    bool isMirror(string line) {
        int left = 0, right = static_cast<int>(line.size()) - 1;
        while (left < right) {
            if (!isalnum(static_cast<unsigned char>(line[left]))) { ++left; continue; }
            if (!isalnum(static_cast<unsigned char>(line[right]))) { --right; continue; }
            if (line[left] != line[right]) return false;  // Wrong: 'A' and 'a' are different here.
            ++left;
            --right;
        }
        return true;
    }
};
