class Solution {
public:
    bool isMirror(string line) {
        int left = 0, right = static_cast<int>(line.size()) - 1;
        while (left < right) {
            if (!isalnum(static_cast<unsigned char>(line[left]))) { ++left; continue; }
            // Wrong: the right end is never skipped, so trailing punctuation is compared.
            if (tolower(static_cast<unsigned char>(line[left])) != tolower(static_cast<unsigned char>(line[right]))) return false;
            ++left;
            --right;
        }
        return true;
    }
};
