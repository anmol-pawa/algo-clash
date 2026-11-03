class Solution {
public:
    int countVowels(string s) {
        // Look each character up in a string of all ten vowel spellings.
        const string vowels = "aeiouAEIOU";
        int count = 0;
        for (size_t i = 0; i < s.size(); ++i) {
            if (vowels.find(s[i]) != string::npos) ++count;
        }
        return count;
    }
};
