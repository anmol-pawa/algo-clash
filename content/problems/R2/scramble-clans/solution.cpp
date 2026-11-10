class Solution {
public:
    int largestClan(vector<string> words) {
        unordered_map<string, int> clanSize;  // sorted letters -> words in the clan
        int best = 0;
        for (string word : words) {
            sort(word.begin(), word.end());  // canonical key shared by every rearrangement
            best = max(best, ++clanSize[word]);
        }
        return best;
    }
};
