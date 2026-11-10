class Solution {
public:
    bool isMirror(string line) {
        string kept;
        for (const char c : line)
            if (isalnum(static_cast<unsigned char>(c))) kept += static_cast<char>(tolower(static_cast<unsigned char>(c)));
        string reversed(kept.rbegin(), kept.rend());
        return kept == reversed;
    }
};
