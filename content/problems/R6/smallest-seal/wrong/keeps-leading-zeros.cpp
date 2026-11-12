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
        kept.resize(kept.size() - static_cast<size_t>(k));
        return kept.empty() ? "0" : kept;  // bug: "10200", k=1 gives "0200"
    }
};
