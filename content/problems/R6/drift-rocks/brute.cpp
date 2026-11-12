class Solution {
public:
    vector<int> survivors(vector<int>& rocks) {
        vector<int> v = rocks;
        for (;;) {
            bool changed = false;
            for (size_t i = 0; i + 1 < v.size(); ++i) {
                if (v[i] > 0 && v[i + 1] < 0) {
                    const int a = v[i], b = -v[i + 1];
                    if (a > b) v.erase(v.begin() + i + 1);
                    else if (a < b) v.erase(v.begin() + i);
                    else v.erase(v.begin() + i, v.begin() + i + 2);
                    changed = true;
                    break;
                }
            }
            if (!changed) break;
        }
        return v;
    }
};
