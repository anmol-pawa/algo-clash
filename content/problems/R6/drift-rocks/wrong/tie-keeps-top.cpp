class Solution {
public:
    vector<int> survivors(vector<int>& rocks) {
        vector<int> kept;
        for (const int rock : rocks) {
            bool alive = true;
            while (alive && rock < 0 && !kept.empty() && kept.back() > 0) {
                if (kept.back() < -rock) {
                    kept.pop_back();
                } else {
                    // Wrong: on a tie only the new rock shatters; the right-mover stays.
                    alive = false;
                }
            }
            if (alive) kept.push_back(rock);
        }
        return kept;
    }
};
