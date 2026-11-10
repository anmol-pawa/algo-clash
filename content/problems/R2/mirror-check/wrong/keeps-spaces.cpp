class Solution {
public:
    bool isMirror(string line) {
        int left = 0, right = static_cast<int>(line.size()) - 1;
        while (left < right) {
            // Wrong: spaces and punctuation are compared instead of skipped.
            if (tolower(static_cast<unsigned char>(line[left])) != tolower(static_cast<unsigned char>(line[right]))) return false;
            ++left;
            --right;
        }
        return true;
    }
};
