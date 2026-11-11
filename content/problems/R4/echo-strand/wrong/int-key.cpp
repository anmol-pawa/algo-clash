class Solution {
public:
    vector<string> echoes(string strand, int k) {
        // Wrong: the key is a 32-bit int, so blocks longer than 16 letters lose their high bits and collide.
        const int n = static_cast<int>(strand.size());
        vector<string> answer;
        if (k > n) return answer;
        unordered_map<int, int> seen;
        int key = 0;
        for (int i = 0; i < n; ++i) {
            const int c = strand[i] == 'A' ? 0 : strand[i] == 'C' ? 1 : strand[i] == 'G' ? 2 : 3;
            key = (key << 2) | c;
            if (k < 16) key &= (1 << (2 * k)) - 1;
            if (i < k - 1) continue;
            if (++seen[key] == 2) answer.push_back(strand.substr(i - k + 1, k));
        }
        sort(answer.begin(), answer.end());
        return answer;
    }
};
