class Solution {
public:
    int largestClan(vector<string> words) {
        unordered_map<int, int> bySum;
        int best = 0;
        for (const string& w : words) {
            int sum = 0;
            for (const char c : w) sum += c;
            best = max(best, ++bySum[sum]);  // Wrong: "ad" and "bc" share a letter sum but are different clans.
        }
        return best;
    }
};
