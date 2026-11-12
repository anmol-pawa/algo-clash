class Solution {
public:
    string smallestSeal(string code, int k) {
        // bug: greedily scratches the k largest digits (leftmost first), ignoring position
        vector<int> idx(code.size());
        iota(idx.begin(), idx.end(), 0);
        stable_sort(idx.begin(), idx.end(), [&](int a, int b) { return code[a] > code[b]; });
        vector<bool> gone(code.size(), false);
        for (int i = 0; i < k; ++i) gone[idx[i]] = true;
        string s;
        for (size_t i = 0; i < code.size(); ++i) {
            if (!gone[i]) s += code[i];
        }
        const size_t nz = s.find_first_not_of('0');
        return nz == string::npos ? "0" : s.substr(nz);
    }
};
