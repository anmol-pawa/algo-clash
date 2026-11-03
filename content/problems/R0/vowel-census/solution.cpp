class Solution {
public:
    int countVowels(string s) {
        int count = 0;
        for (const char c : s) {
            const char lower = static_cast<char>(tolower(static_cast<unsigned char>(c)));
            if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') ++count;
        }
        return count;
    }
};
