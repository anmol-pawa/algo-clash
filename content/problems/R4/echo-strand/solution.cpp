class Solution {
public:
    vector<string> echoes(string strand, int k) {
        const int n = static_cast<int>(strand.size());
        vector<string> answer;
        if (k > n) return answer;

        const auto code = [](char c) -> long long {
            switch (c) {
                case 'A': return 0;
                case 'C': return 1;
                case 'G': return 2;
                default:  return 3;  // 'T'
            }
        };

        // Each letter is 2 bits, so a block of k letters is 2k <= 60 bits: exact, no collisions.
        const long long mask = (1LL << (2 * k)) - 1;
        unordered_map<long long, int> seen;  // block key -> how many starts so far
        seen.reserve(n * 2);
        long long key = 0;
        for (int i = 0; i < n; ++i) {
            key = ((key << 2) | code(strand[i])) & mask;  // slide: add the new letter, drop the oldest
            if (i < k - 1) continue;                      // window not full yet
            if (++seen[key] == 2) answer.push_back(strand.substr(i - k + 1, k));  // report on the 2nd sighting only
        }
        sort(answer.begin(), answer.end());
        return answer;
    }
};
