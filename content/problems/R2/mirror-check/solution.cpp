class Solution {
public:
    bool isMirror(string line) {
        int left = 0, right = static_cast<int>(line.size()) - 1;
        while (left < right) {
            // Invariant: everything outside [left, right] has already matched.
            if (!isalnum(static_cast<unsigned char>(line[left]))) { ++left; continue; }
            if (!isalnum(static_cast<unsigned char>(line[right]))) { --right; continue; }
            if (tolower(static_cast<unsigned char>(line[left])) != tolower(static_cast<unsigned char>(line[right]))) return false;
            ++left;
            --right;
        }
        return true;
    }
};
