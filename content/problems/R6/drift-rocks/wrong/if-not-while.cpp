class Solution {
public:
    vector<int> survivors(vector<int>& rocks) {
        vector<int> kept;
        for (const int rock : rocks) {
            bool alive = true;
            // Wrong: only one collision per arriving rock.
            if (rock < 0 && !kept.empty() && kept.back() > 0) {
                if (kept.back() < -rock) kept.pop_back();
                else {
                    if (kept.back() == -rock) kept.pop_back();
                    alive = false;
                }
            }
            if (alive) kept.push_back(rock);
        }
        return kept;
    }
};
