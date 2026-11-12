class Solution {
public:
    string smallestSeal(string code, int k) {
        string kept;
        for (const char d : code) {
            while (k > 0 && !kept.empty() && kept.back() > d) {
                kept.pop_back();
                --k;
            }
            kept.push_back(d);
        }
        // bug: removals still owed (e.g. an increasing code) are never applied
        const size_t nz = kept.find_first_not_of('0');
        return nz == string::npos ? "0" : kept.substr(nz);
    }
};
