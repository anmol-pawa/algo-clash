class Solution {
public:
    vector<int> survivors(vector<int>& rocks) {
        vector<int> kept;
        for (const int rock : rocks) {
            // Wrong: a left-mover that breaks the top is dropped instead of continuing to the next one.
            if (rock < 0 && !kept.empty() && kept.back() > 0) {
                if (kept.back() < -rock) { kept.pop_back(); continue; }
                if (kept.back() == -rock) kept.pop_back();
                continue;
            }
            kept.push_back(rock);
        }
        return kept;
    }
};
