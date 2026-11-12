class Solution {
public:
    vector<int> survivors(vector<int>& rocks) {
        vector<int> kept;
        for (const int rock : rocks) {
            bool alive = true;
            // Wrong: collides with any neighbour on the stack, even a left-mover.
            while (alive && rock < 0 && !kept.empty()) {
                if (abs(kept.back()) < -rock) {
                    kept.pop_back();
                } else {
                    if (abs(kept.back()) == -rock) kept.pop_back();
                    alive = false;
                }
            }
            if (alive) kept.push_back(rock);
        }
        return kept;
    }
};
