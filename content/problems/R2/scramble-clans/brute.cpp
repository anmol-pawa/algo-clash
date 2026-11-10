class Solution {
public:
    int largestClan(vector<string> words) {
        const int n = static_cast<int>(words.size());
        int best = 0;
        for (int i = 0; i < n; ++i) {
            string a = words[i];
            sort(a.begin(), a.end());
            int size = 0;
            for (int j = 0; j < n; ++j) {
                string b = words[j];
                sort(b.begin(), b.end());
                if (a == b) ++size;
            }
            best = max(best, size);
        }
        return best;
    }
};
