class Solution {
public:
    string smallestSeal(string code, int k) {
        string kept;  // invariant: digits that are still candidates, non-decreasing unless we ran out of removals
        for (const char d : code) {
            // A bigger digit directly before a smaller one makes the number larger: remove it while we can.
            while (k > 0 && !kept.empty() && kept.back() > d) {
                kept.pop_back();
                --k;
            }
            kept.push_back(d);
        }
        kept.resize(kept.size() - static_cast<size_t>(k));  // still owe removals: drop from the end (largest tail)
        const size_t firstNonZero = kept.find_first_not_of('0');
        return firstNonZero == string::npos ? "0" : kept.substr(firstNonZero);
    }
};
