class Solution {
public:
    int countVowels(string s) {
        // Wrong: capital vowels are ignored.
        int count = 0;
        for (const char c : s) {
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') ++count;
        }
        return count;
    }
};
