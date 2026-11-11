class Solution {
public:
    vector<string> echoes(string strand, int k) {
        // Wrong: reports a block every time it is seen again, so a block seen 3+ times is listed repeatedly.
        const int n = static_cast<int>(strand.size());
        vector<string> answer;
        unordered_set<string> seen;
        for (int i = 0; i + k <= n; ++i) {
            const string block = strand.substr(i, k);
            if (!seen.insert(block).second) answer.push_back(block);
        }
        sort(answer.begin(), answer.end());
        return answer;
    }
};
